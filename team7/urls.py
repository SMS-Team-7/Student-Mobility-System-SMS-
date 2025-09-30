
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    # Admin panel
    path("admin/", admin.site.urls),

    # App routes
    path("", include("account.urls")),
    
    path("transport/", include("driver.urls")),
    
    path("ride/", include("ride.urls")),
    
    path("library/", include("book.urls")),
    
    path("reward/", include("reward.urls")),  # Tokens & Rewards endpoints
    
    path('daily-tasks/', include('task.urls')),   # ✅ clean and readable


    
    # API schema & documentation
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("swagger/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]
