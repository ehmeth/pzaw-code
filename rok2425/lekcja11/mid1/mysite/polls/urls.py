from django.urls import path

from . import views

app_name = "polls"
urlpatterns = [
    path('', views.IndexView.as_view(), name="index"),
    path('new/', views.new_poll, name="new"),
    path('<int:pk>/', views.DetailView.as_view(), name="details"),
    path('vote/<int:poll_id>/', views.vote, name="vote"),
    path('results/<int:pk>/', views.ResultsView.as_view(), name="results"),
    path('user/login/', views.user_login, name="login"),
]