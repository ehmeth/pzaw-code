from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.db.models import Sum
from django.utils import timezone
from django.views import generic

from .models import Poll, Choice
from .forms import VoteForm, NewPollForm

class IndexView(generic.ListView):
    template_name = "polls/index.html"
    context_object_name = "latest_polls"
    
    def get_queryset(self):
        return Poll.objects.order_by("-pub_date")[:5]

class DetailView(generic.DetailView):
    model = Poll
    template_name = "polls/poll.html"
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['vote_form'] = VoteForm(self.object)
        return context;

class ResultsView(generic.DetailView):
    model = Poll
    template_name = "polls/results.html"
        
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        votes = self.object.choice_set.aggregate(total=Sum('votes'))
        context['total_votes'] = max(1, votes['total'])
        return context

def vote(request, poll_id):
    if request.method == 'GET':
        return HttpResponseRedirect(reverse("polls:details", args=[poll_id]))
    try:
        poll = Poll.objects.get(pk=poll_id)
        vote_form = VoteForm(poll, data=request.POST)
        if vote_form.is_valid():
            selected_choice = Choice.objects.get(pk = vote_form.cleaned_data['choice'])
            selected_choice.votes += 1
            selected_choice.save()
            return HttpResponseRedirect(reverse("polls:results", args=[poll_id]))
        else:
            context = {
                'poll': poll,
                'vote_form': vote_form
            }
            return render(request, "polls/poll.html", context)
            
    except Poll.DoesNotExist:
        return render(request, "polls/poll.html", status=404)

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
        
def choices_valid(choices):
    return isinstance(choices, list) and all(isinstance(val, str) for val in choices)