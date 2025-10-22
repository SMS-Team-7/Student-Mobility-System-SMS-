from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.conf import settings
from .models import Ride, Location
from .serializers import LocationSerializer
from .services.ai_tracker import analyze_driver_behavior
# ---- Import models ----
from driver.models import Driver, Student   # driver app
from .models import Ride, TokenReward       # ride app

# ---- Import serializers ----
from .serializers import RideSerializer, TokenRewardSerializer

# ---- Import Hedera services ----
from reward.services.hedera_service import (
    transfer_tokens,
    create_hedera_account,
)


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

        # --- Ensure user has Hedera account (custodial) ---
        if not request.user.hedera_account_id:
            account_id, pub_key, priv_key = create_hedera_account()
            request.user.hedera_account_id = account_id
            request.user.hedera_public_key = pub_key
            request.user.hedera_private_key_encrypted = priv_key  # ✅ corrected field
            request.user.save()

        # 🎁 Reward student (on-chain + local)
        try:
            reward = transfer_tokens(
                user=request.user,
                amount=5,
                reason=f"Booked ride #{ride.id}"
            )
        except Exception as e:
            return Response({"error": f"Ride booked but reward failed: {str(e)}"}, status=500)

        return Response({
            "ride": RideSerializer(ride).data,
            "reward": TokenRewardSerializer(reward).data
        }, status=201)


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

        # --- Ensure driver has Hedera account (custodial) ---
        if not request.user.hedera_account_id:
            account_id, pub_key, priv_key = create_hedera_account()
            request.user.hedera_account_id = account_id
            request.user.hedera_public_key = pub_key
            request.user.hedera_private_key = priv_key
            request.user.save()

        # 🎁 Reward driver (on-chain + local)
        try:
            reward = transfer_tokens(
                user=request.user,
                amount=10,
                reason=f"Completed ride #{ride.id}"
            )
        except Exception as e:
            return Response({"error": f"Ride completed but reward failed: {str(e)}"}, status=500)

        return Response({
            "ride": RideSerializer(ride).data,
            "reward": TokenRewardSerializer(reward).data
        }, status=200)


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



class LocationUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, ride_id):
        role = request.data.get("role")  # "driver" or "student"
        lat = request.data.get("latitude")
        lon = request.data.get("longitude")

        if not role or lat is None or lon is None:
            return Response({"error": "Missing data"}, status=400)

        try:
            ride = Ride.objects.get(id=ride_id)
        except Ride.DoesNotExist:
            return Response({"error": "Ride not found"}, status=404)

        location = Location.objects.create(
            ride=ride,
            role=role,
            latitude=float(lat),
            longitude=float(lon),
        )
        return Response(LocationSerializer(location).data, status=201)


class RideMonitorView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, ride_id):
        try:
            ride = Ride.objects.get(id=ride_id)
        except Ride.DoesNotExist:
            return Response({"error": "Ride not found"}, status=404)

        driver_locations = ride.locations.filter(role="driver").order_by("timestamp")[:20]
        analysis = analyze_driver_behavior(driver_locations)
        return Response(analysis, status=200)
