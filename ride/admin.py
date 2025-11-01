# ride/admin.py
from django.contrib import admin
from .models import Ride, TokenReward, Location


@admin.register(Ride)
class RideAdmin(admin.ModelAdmin):
    list_display = ("id", "rider", "driver", "pickup_location", "dropoff_location", "status", "created_at", "completed_at")
    list_filter = ("status", "created_at")
    search_fields = ("student__user__username", "driver__user__username", "pickup_location", "dropoff_location")
    ordering = ("-created_at",)


@admin.register(TokenReward)
class TokenRewardAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "ride", "amount", "reason", "created_at")
    search_fields = ("user__username", "reason")
    list_filter = ("created_at",)
    ordering = ("-created_at",)


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ("id", "ride", "role", "latitude", "longitude", "timestamp")
    list_filter = ("role",)
    search_fields = ("ride__id",)
    ordering = ("-timestamp",)
