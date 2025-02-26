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
]