from django.shortcuts import render
from django.template import loader
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
    options = "\n".join("- " + x for x in poll["options"])
    return f"{poll['question']}\n{options}"

def index(request):
    template = loader.get_template("polls/base.html")
    context = {
        "content": "This is the polls page"
    }
    return HttpResponse(template.render(context, request))

def by_id(request, id):
    template = loader.get_template("polls/base.html")
    context = {}
    retcode = 200
    if (0 <= id < len(poll_names)):
        context['content'] = poll_text(open_polls[poll_names[id]])
    else:
        context['content'] = "No such poll right now"
        retcode = 404
    return HttpResponse(template.render(context, request), status=retcode)


def by_name(request, poll_name):
    template = loader.get_template("polls/base.html")
    context = {}
    retcode = 200
    if poll_name in poll_names:
        context['content'] = poll_text(open_polls[poll_name])
    else:
        context['content'] = "No such poll right now"
        retcode = 404
    return HttpResponse(template.render(context, request), status=retcode)