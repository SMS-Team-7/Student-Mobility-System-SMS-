from rest_framework import generics, permissions
from .models import ChatMessage, DriverLocation
from .serializers import ChatMessageSerializer, DriverLocationSerializer
from rest_framework.response import Response
from rest_framework.views import APIView

# Real-time endpoints mainly handled via WebSocket consumers, but we can provide REST access too

class ChatMessageListView(generics.ListAPIView):
    """
    List all messages involving the authenticated user.
    """
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ChatMessage.objects.filter(sender=user) | ChatMessage.objects.filter(receiver=user)


class DriverLocationListView(generics.ListAPIView):
    """
    List all drivers' locations (for students to see nearby drivers).
    """
    serializer_class = DriverLocationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DriverLocation.objects.all()


class DriverLocationUpdateView(APIView):
    """
    REST endpoint for driver to update their location.
    Real-time updates will be pushed via Channels.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        driver_profile = getattr(request.user, "driver_profile", None)
        if not driver_profile:
            return Response({"error": "Only drivers can update their location."}, status=403)

        latitude = request.data.get("latitude")
        longitude = request.data.get("longitude")

        if latitude is None or longitude is None:
            return Response({"error": "latitude and longitude are required."}, status=400)

        location, created = DriverLocation.objects.get_or_create(driver=driver_profile)
        location.latitude = latitude
        location.longitude = longitude
        location.save()

        # Here, your Channels consumer should push this updated location to subscribed students in real-time

        return Response(DriverLocationSerializer(location).data)

