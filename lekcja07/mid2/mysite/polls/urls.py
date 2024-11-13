from django.urls import path

from . import views

app_name = "polls"
urlpatterns = [
    path('', views.index, name="index"),
    path('<int:poll_id>/', views.by_id, name="details"),
    path('vote/<str:poll_name>/', views.vote, name="vote"),
    path('results/<str:poll_name>/', views.results, name="results"),
]