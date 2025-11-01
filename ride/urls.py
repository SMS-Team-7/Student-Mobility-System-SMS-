from django.urls import path
from .views import (
    BookRideView, CompleteRideView,
    RideListView, TokenRewardListView,
    LocationUpdateView, RideMonitorView

)

urlpatterns = [
    # Rides
    path("rides/", RideListView.as_view(), name="ride-list"),
    path("rides/book/", BookRideView.as_view(), name="ride-book"),
    path("rides/<int:ride_id>/complete/", CompleteRideView.as_view(), name="ride-complete"),
        path("rides/<int:ride_id>/location/", LocationUpdateView.as_view(), name="update-location"),
    path("rides/<int:ride_id>/monitor/", RideMonitorView.as_view(), name="ride-monitor"),
    # Rewards
    path("rewards/", TokenRewardListView.as_view(), name="reward-list"),
]
