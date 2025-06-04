from django import forms
from .models import Choice, Poll

class VoteForm(forms.Form):
    choice = forms.ChoiceField(
        widget=forms.RadioSelect,
        required=True,
    )

    def __init__(self, poll, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['choice'].choices = [(choice.id, choice.choice_text) for choice in poll.choice_set.all()]
        self.fields['choice'].label = poll.question_text

class NewPollForm(forms.Form):
    question = forms.CharField(max_length=500, required=True)
    choices = forms.JSONField( initial=["Choice 1", "Choice 2"], required=True)