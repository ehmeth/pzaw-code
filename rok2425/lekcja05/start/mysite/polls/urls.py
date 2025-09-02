from django.urls import path

from . import views

app_name = "polls"
urlpatterns = [
    path('', views.index, name="index"),
    path('<str:poll_name>/', views.by_name, name="poll") 
]