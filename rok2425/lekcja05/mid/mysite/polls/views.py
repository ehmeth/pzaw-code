from django.shortcuts import render
from django.http import HttpResponseBadRequest

open_polls = {
    "pets": {
        "question": "Which are better, cats or dogs?",
        "options": [
            "cats",
            "dogs",
        ],
    },
    "flavours": {
        "question": "Which is better? Chocolate or vanilla?",
        "options": [
            "chocolate",
            "vanilla",
        ],
    },
    "baby-boy-names": 
    {
        "question": "What is the best name for a baby boy?",
        "options": [
            "bryan",
            "donald",
            "justin",
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
    context = {}
    retcode = 200
    if poll_name in poll_names:
        context['poll'] = open_polls[poll_name]
    else:
        retcode = 404
    return render(request, "polls/poll.html", context, status=retcode)

def forms(request):
    if request.method == 'GET':
        return render(request, "polls/forms.html", {})
    elif request.method == 'POST':
        return render(request, "polls/post.html", {'params': request.POST})
    else:
        return HttpResponseBadRequest("Unsupported method")