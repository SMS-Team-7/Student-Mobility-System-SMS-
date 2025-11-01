from django.urls import path
from . import views

urlpatterns = [
    path('messages/', views.ChatMessageListView.as_view(), name='chat-message-list'),
    path('drivers/', views.DriverLocationListView.as_view(), name='driver-location-list'),
]
