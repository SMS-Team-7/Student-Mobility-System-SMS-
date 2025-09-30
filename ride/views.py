from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone

# ---- Import models ----
from driver.models import Driver, Student   # driver app
from .models import Ride, TokenReward       # ride app

# ---- Import serializers ----
from .serializers import RideSerializer, TokenRewardSerializer


# -------- Ride Booking --------
class BookRideView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        student = getattr(request.user, "student_profile", None)
        if not student:
            return Response({"error": "Only students can book rides."}, status=403)

        driver_id = request.data.get("driver_id")
        pickup_location = request.data.get("pickup_location")
        dropoff_location = request.data.get("dropoff_location")

        if not driver_id or not pickup_location or not dropoff_location:
            return Response(
                {"error": "driver_id, pickup_location and dropoff_location are required."},
                status=400
            )

        try:
            driver = Driver.objects.get(id=driver_id, is_available=True)
        except Driver.DoesNotExist:
            return Response({"error": "Driver not available."}, status=404)

        # Create ride
        ride = Ride.objects.create(
            student=student,
            driver=driver,
            pickup_location=pickup_location,
            dropoff_location=dropoff_location,
        )

        # Reward student for booking
        TokenReward.objects.create(
            user=request.user,
            ride=ride,
            amount=5,
            reason="Booked a ride"
        )

        return Response(RideSerializer(ride).data, status=201)


# -------- Complete Ride --------
class CompleteRideView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, ride_id):
        try:
            ride = Ride.objects.get(id=ride_id)
        except Ride.DoesNotExist:
            return Response({"error": "Ride not found."}, status=404)

        driver = getattr(request.user, "driver_profile", None)
        if not driver or ride.driver != driver:
            return Response({"error": "Only the assigned driver can complete this ride."}, status=403)

        if ride.status == "completed":
            return Response({"error": "Ride already completed."}, status=400)

        # Mark ride completed
        ride.status = "completed"
        ride.completed_at = timezone.now()
        ride.save()

        # Reward driver
        TokenReward.objects.create(
            user=request.user,
            ride=ride,
            amount=10,
            reason="Completed ride on time"
        )

        return Response(RideSerializer(ride).data, status=200)


# -------- Ride + Rewards Listing --------
class RideListView(generics.ListAPIView):
    serializer_class = RideSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, "student_profile"):
            return Ride.objects.filter(student=user.student_profile)
        elif hasattr(user, "driver_profile"):
            return Ride.objects.filter(driver=user.driver_profile)
        return Ride.objects.none()


class TokenRewardListView(generics.ListAPIView):
    serializer_class = TokenRewardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TokenReward.objects.filter(user=self.request.user)
