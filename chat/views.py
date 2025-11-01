from rest_framework import generics, permissions
from .models import ChatMessage, DriverLocation
from .serializers import ChatMessageSerializer, DriverLocationSerializer

# --- Chat Messages ---
class ChatMessageListView(generics.ListAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ChatMessage.objects.filter(sender=user) | ChatMessage.objects.filter(receiver=user)

# --- Driver Locations ---
class DriverLocationListView(generics.ListAPIView):
    serializer_class = DriverLocationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DriverLocation.objects.all()
