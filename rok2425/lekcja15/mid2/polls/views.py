import json
from http import HTTPStatus

from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.db.models import Sum
from django.utils import timezone
from django.views import generic
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie

from django.contrib.auth import logout, login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm

from .models import Poll, Choice
from .forms import VoteForm, NewPollForm

def api_auth_login(request):
    data = json.loads(request.body)
    # TODO(kleindan) validate auth data
    user = authenticate(request, username=data.get('username'), password=data.get("password"))
    if user is not None:
        login(request, user)
        return JsonResponse({"message": "authenticated"})
    else:
        return JsonResponse({"message": "Incorrect username or password"}, status=HTTPStatus.UNAUTHORIZED)


@login_required
def api_auth_logout(request):
    logout(request)
    return JsonResponse({"status": "ok"})
        
@ensure_csrf_cookie
def api_auth_status(request):
    response = {"authenticated": request.user.is_authenticated}
    if (request.user.is_authenticated):
        response['username'] = request.user.get_username()
    return JsonResponse(response)

@require_POST
def api_new_poll(request):
    data = json.loads(request.body)
    validation_errors = []
    response_obj = {}
    status = HTTPStatus.OK

    # validate question
    question_text = data.get('question')
    choice_list = data.get('choices')
    if (len(question_text) > Poll._meta.get_field('question_text').max_length):
        validation_errors.append(f"question text cannot be longer than {Poll.question_text.max_length} characters")
    # TODO(kleindan) Is this all the validation we want? What about HTML tags? Non-ASCII characters?
        
    # validate choices
    for choice in choice_list:
        if (len(choice) > Choice._meta.get_field('choice_text').max_length):
            validation_errors.append(f"question text cannot be longer than {Choice.choice_text.max_length} characters")
    # TODO(kleindan) Is this all the validation we want? What about HTML tags? Non-ASCII characters?
    
    if (len(validation_errors) > 0):
        response_obj['validation_errors'] = validation_errors
        status = HTTPStatus.BAD_REQUEST
    else:
        poll = Poll.objects.create(question_text=question_text, pub_date=timezone.now())
        Choice.objects.bulk_create(Choice(question=poll, choice_text=choice) for choice in data.get('choices'))
        response_obj['poll_id'] = poll.id
    return JsonResponse(response_obj, status=status)

def api_polls(request):
    poll_qset = Poll.objects.order_by("-pub_date")[:5]
    poll_list = [{"question": poll.question_text, "id": poll.pk} for poll in poll_qset]
    return JsonResponse({"pollList": poll_list})

class IndexView(generic.ListView):
    template_name = "polls/list.html"
    context_object_name = "latest_polls"
    queryset = Poll.objects.order_by("-pub_date")[:5]

class DetailView(LoginRequiredMixin, generic.DetailView):
    model = Poll
    template_name = "polls/poll.html"
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['vote_form'] = VoteForm(self.object)
        return context;

class ResultsView(LoginRequiredMixin, generic.DetailView):
    model = Poll
    template_name = "polls/results.html"
        
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        votes = self.object.choice_set.aggregate(total=Sum('votes'))
        context['total_votes'] = max(1, votes['total'])
        return context

@login_required
def vote(request, poll_id):
    if request.method == 'GET':
        return HttpResponseRedirect(reverse("polls:details", args=[poll_id]))
    try:
        if not 'voted' in request.session:
            request.session['voted'] = [];
        poll = Poll.objects.get(pk=poll_id)
        vote_form = VoteForm(poll, data=request.POST)
        if poll.id in request.session['voted']:
            context = {
                'poll': poll,
                'vote_form': vote_form,
                'error_message': "You already voted!"
            }
            return render(request, "polls/poll.html", context)
        elif vote_form.is_valid():
            selected_choice = Choice.objects.get(pk = vote_form.cleaned_data['choice'])
            selected_choice.votes += 1
            selected_choice.save()
            request.session['voted'].append(poll.id)
            request.session.modified = True
            return HttpResponseRedirect(reverse("polls:results", args=[poll_id]))
        else:
            context = {
                'poll': poll,
                'vote_form': vote_form
            }
            return render(request, "polls/poll.html", context)
            
    except Poll.DoesNotExist:
        return render(request, "polls/poll.html", status=404)

@login_required
def new_poll(request):
    if request.method == 'GET':
        context = { 
            'form': NewPollForm()
         }
        return render(request, "polls/new.html", context)
    else:
        form = NewPollForm(request.POST)
        if form.is_valid() and choices_valid(form.cleaned_data['choices']):
            poll = Poll.objects.create(question_text=form.cleaned_data['question'], pub_date=timezone.now())
            Choice.objects.bulk_create(Choice(question=poll, choice_text=choice) for choice in form.cleaned_data['choices'])

            return HttpResponseRedirect(reverse("polls:vote", args=[poll.id]))
        else:
            context = {
                'form': form,
            }
            if form.is_valid() and not choices_valid(form.cleaned_data['choices']):
                context['error_message'] = 'Correct the form of Choices field'
            return render(request, "polls/new.html", context)
        
def user_login(request):
    if request.method == 'POST':
        login_form = AuthenticationForm(data=request.POST)
        if login_form.is_valid():
            login(request, login_form.get_user())
            nexturl = request.POST["next"] or "polls:index"
            return redirect(to=nexturl)
        else:
            context = { 'form': login_form }
            return render(request, "polls/login.html", context)
    else:
        context = { 
            'form': AuthenticationForm(),
            'next': request.GET['next'] or "polls:index"
        }
        return render(request, "polls/login.html", context)

def user_register(request):
    if request.method == 'POST':
        register_form = UserCreationForm(data=request.POST)
        if register_form.is_valid():
            user = register_form.save()
            login(request, user)
            return redirect("polls:index")
        else:
            context = { 'form': register_form }
            return render(request, "polls/register.html", context)
    else:
        context = { 'form': UserCreationForm() }
        return render(request, "polls/register.html", context)
        
def choices_valid(choices):
    return isinstance(choices, list) and all(isinstance(val, str) for val in choices)