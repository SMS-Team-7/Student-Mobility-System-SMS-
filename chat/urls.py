from django.urls import path
from .views import (
    ChatMessageListView,
    DriverLocationListView,
    DriverLocationUpdateView,
)

urlpatterns = [
    # Chat
    path("messages/", ChatMessageListView.as_view(), name="chat-message-list"),

    # Driver Locations
    path("drivers/locations/", DriverLocationListView.as_view(), name="driver-location-list"),
    path("drivers/locations/update/", DriverLocationUpdateView.as_view(), name="driver-location-update"),

    # Note: WebRTC signaling (audio/video call) is handled via WebSocket consumers
]
