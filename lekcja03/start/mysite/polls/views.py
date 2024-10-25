from django.shortcuts import render
from django.http import HttpResponse

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

def poll_text(poll):
    options = "<br>".join("- " + x for x in poll["options"])
    return f"{poll['question']}<br>{options}"

def index(request):
    return HttpResponse("Hello, you are in the polls page.")

def by_id(request, id):
    if (0 <= id < len(poll_names)):
        return HttpResponse(poll_text(open_polls[poll_names[id]]))
    else:
        return HttpResponse("No such poll right now", status=404)

def by_name(request, poll_name):
    global open_polls
    if poll_name in open_polls:
        return HttpResponse(poll_text(open_polls[poll_name]))
    else:
        return HttpResponse("No such poll right now", status=404)