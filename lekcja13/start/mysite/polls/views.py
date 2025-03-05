from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.db.models import Sum
from django.utils import timezone
from django.views import generic

from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm

from .models import Poll, Choice
from .forms import VoteForm, NewPollForm, ChoiceFormSet

class IndexView(generic.ListView):
    template_name = "polls/index.html"
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
            'question_form': NewPollForm(),
            'choices_formset': ChoiceFormSet()
         }
        return render(request, "polls/new.html", context)
    else:
        question_form = NewPollForm(request.POST)
        choices_formset = ChoiceFormSet(request.POST)
        if question_form.is_valid() and choices_formset.is_valid():
            poll = Poll.objects.create(question_text=question_form.cleaned_data['question'], pub_date=timezone.now())
            for choice in choices_formset.cleaned_data:
                choice['question'] = poll
            Choice.objects.bulk_create([Choice(**value) for value in choices_formset.cleaned_data])

            return HttpResponseRedirect(reverse("polls:vote", args=[poll.id]))
        else:
            context = {
                'question_form': question_form,
            }
            if question_form.is_valid() and not choices_valid(question_form.cleaned_data['choices']):
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