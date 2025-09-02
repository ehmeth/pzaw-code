from django.urls import path

from . import views

app_name = "polls"
urlpatterns = [
    path('', views.index, name="index"),
    path('<int:poll_id>/', views.by_id, name="details"),
    path('vote/<int:poll_id>/', views.vote, name="vote"),
    path('results/<int:poll_id>/', views.results, name="results"),
]