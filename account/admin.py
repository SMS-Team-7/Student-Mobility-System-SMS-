from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, TempLoginToken


# ----------------- CUSTOM USER ADMIN -----------------
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        "username", 
        "email", 
        "role", 
        "hedera_account_id", 
        "is_staff", 
        "is_active"
    )
    list_filter = ("role", "is_staff", "is_active", "is_superuser")
    search_fields = ("username", "email", "hedera_account_id")
    ordering = ("username",)

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name", "email")}),
        ("Roles & Permissions", {"fields": ("role", "is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Hedera Info", {"fields": ("hedera_account_id", "hedera_public_key", "hedera_private_key_encrypted")}),
        ("OTP Info", {"fields": ("otp_secret", "otp_created_at")}),
        ("Important Dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "email",
                    "password1",
                    "password2",
                    "role",
                    "is_active",
                    "is_staff",
                ),
            },
        ),
    )


# ----------------- TEMP LOGIN TOKEN ADMIN -----------------
@admin.register(TempLoginToken)
class TempLoginTokenAdmin(admin.ModelAdmin):
    list_display = (
        "token",
        "user",
        "is_verified",
        "created_at",
        "expires_at",
        "expired_status",
    )
    list_filter = ("is_verified", "created_at")
    search_fields = ("token", "user__username", "user__email")
    ordering = ("-created_at",)

    def expired_status(self, obj):
        return "✅ Valid" if not obj.is_expired() else "❌ Expired"
    expired_status.short_description = "Status"
