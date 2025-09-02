from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.db.models import Sum

from .models import Poll, Choice
from .forms import VoteForm

def index(request):
    context = {
        "latest_polls": Poll.objects.order_by("-pub_date")[:5]
    }
    return render(request, "polls/index.html", context)

def by_id(request, poll_id):
    context = {}
    retcode = 200
    try:
        poll = Poll.objects.get(pk=poll_id)
        context['poll'] = poll
        context['vote_form'] = VoteForm(poll)
    except Poll.DoesNotExist:
        retcode = 404
    return render(request, "polls/poll.html", context, status=retcode)

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

def results(request, poll_id):
    context = {}
    retcode = 200
    try:
        poll = Poll.objects.get(pk=poll_id)
        context['poll'] = poll
        votes = poll.choice_set.aggregate(total=Sum('votes'))
        context['total_votes'] = max(1, votes['total'])
    except Poll.DoesNotExist:
        retcode = 404
    return render(request, "polls/results.html", context, status=retcode)