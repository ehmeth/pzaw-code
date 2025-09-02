from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('<int:id>/', views.by_id, name="index"),
    path('<str:poll_name>/', views.by_name, name="index") 
]