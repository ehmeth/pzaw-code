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

ChoiceFormSet = forms.inlineformset_factory(parent_model=Poll, model=Choice, extra=0, min_num=2, fields=["choice_text"], can_delete=False)