from django.urls import path
from django.contrib.auth.views import LogoutView

from . import views

app_name = "polls"
urlpatterns = [
    path('', views.IndexView.as_view(), name="index"),
    path('new/', views.new_poll, name="new"),
    path('<int:pk>/', views.DetailView.as_view(), name="details"),
    path('vote/<int:poll_id>/', views.vote, name="vote"),
    path('results/<int:pk>/', views.ResultsView.as_view(), name="results"),
    path('user/login/', views.user_login, name="login"),
    path('user/register/', views.user_register, name="register"),
    path('user/logout/', LogoutView.as_view(next_page="polls:index"), name="logout"),
    path('api/polls', views.api_polls, name="api_polls"),
    path('api/new', views.api_new_poll, name="api_new_poll"),
    path('api/auth/status', views.api_auth_status, name="api_auth_status"),
    path('api/auth/logout', views.api_auth_logout, name="api_auth_logout"),
    path('api/auth/login', views.api_auth_login, name="api_auth_login"),
    path('api/auth/register', views.api_auth_register, name="api_auth_register"),
    path('api/<int:poll_id>/', views.api_polls_details, name="api_details"),
    path('api/<int:poll_id>/vote', views.api_polls_vote, name="api_vote"),
]