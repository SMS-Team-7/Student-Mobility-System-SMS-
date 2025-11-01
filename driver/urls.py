from django.urls import path
from .views import (
    DriverListView, DriverDetailView,
    StudentListView, StudentDetailView,
)

urlpatterns = [
    # Drivers
    path("drivers/", DriverListView.as_view(), name="driver-list"),
    path("drivers/<int:pk>/", DriverDetailView.as_view(), name="driver-detail"),

    # Students
    path("students/", StudentListView.as_view(), name="student-list"),
    path("students/<int:pk>/", StudentDetailView.as_view(), name="student-detail"),
]
