from django.contrib import admin

from .models import Poll, Choice

# derive from admin.StackedInline for a more vertical representation
class ChoiceInline(admin.TabularInline):
    model = Choice
    readonly_fields = ['votes']
    extra = 3

class PollAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {"fields": ["question_text"]}),
        ("Date information", {
            "fields": ["pub_date"],
            "classes": ["collapse"]}),
    ]
    inlines = [ChoiceInline]
    
admin.site.register(Poll, PollAdmin)