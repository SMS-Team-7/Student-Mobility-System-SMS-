from django.urls import path
from .views import (
    BookRideView, CompleteRideView,
    RideListView, TokenRewardListView,
)

urlpatterns = [
    # Rides
    path("rides/", RideListView.as_view(), name="ride-list"),
    path("rides/book/", BookRideView.as_view(), name="ride-book"),
    path("rides/<int:ride_id>/complete/", CompleteRideView.as_view(), name="ride-complete"),

    # Rewards
    path("rewards/", TokenRewardListView.as_view(), name="reward-list"),
]
