from django.urls import path

from . import views

app_name = "polls"
urlpatterns = [
    path('', views.index, name="index"),
    path('new/', views.new_poll, name="new"),
    path('<str:poll_name>/', views.by_name, name="poll"),
    path('vote/<str:poll_name>/', views.vote, name="vote"),
    path('results/<str:poll_name>/', views.results, name="results"),
]