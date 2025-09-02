from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
import re

open_polls = {
    "pets": {
        "question": "Which are better, cats or dogs?",
        "options": [
            {
                'text': "cats",
                'votes': 0,
            },
            {
                'text': "dogs",
                'votes': 0,
            },
        ],
    },
    "flavours": {
        "question": "Which is better? Chocolate or vanilla?",
        "options": [
            {
                'text': "chocolate",
                'votes': 0,
            },
            {
                'text': "vanilla",
                'votes': 0,
            },
        ],
    },
    "baby-boy-names": 
    {
        "question": "What is the best name for a baby boy?",
        "options": [
            {
                'text': "bryan",
                'votes': 0,
            },
            {
                'text': "donald",
                'votes': 0,
            },
            {
                'text': "justin",
                'votes': 0,
            },
        ]
    }
}

poll_names = [
    "pets",
    "flavours",
    "baby-boy-names",
]

def index(request):
    context = { "polls": open_polls }
    return render(request, "polls/index.html", context)

def by_name(request, poll_name):
    context = {
        "poll_name": poll_name,
    }
    retcode = 200
    if poll_name in poll_names:
        context['poll'] = open_polls[poll_name]
    else:
        retcode = 404
    return render(request, "polls/poll.html", context, status=retcode)

def vote(request, poll_name):
    if request.method == 'GET':
        return HttpResponseRedirect(reverse("polls:poll", args=[poll_name]))
    if poll_name in poll_names:
        if "choice" in request.POST and re.match("\d+", request.POST['choice']):
            user_choice = int(request.POST["choice"])
        else:
            user_choice = -1
        if 0 <= user_choice < len(open_polls[poll_name]['options']):
            selected_choice = open_polls[poll_name]['options'][user_choice]
            selected_choice['votes'] += 1
            return HttpResponseRedirect(reverse("polls:results", args=[poll_name]))
        else:
            context = {
                "poll_name": poll_name, 
                "error_message": "Wybrano nieprawidłową opcję",
                "poll": open_polls[poll_name],
            }
            return render( request, "polls/poll.html", context)
    else:
        return render( request, "polls/poll.html", { "poll_name": poll_name })

def results(request, poll_name):
    context = {
        "poll_name": poll_name,
    }
    retcode = 200
    if poll_name in poll_names:
        context['poll'] = open_polls[poll_name]
        context['total_votes'] = max(1, sum(option['votes'] for option in open_polls[poll_name]['options']))
    else:
        retcode = 404
    return render(request, "polls/results.html", context, status=retcode)