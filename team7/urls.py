
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from django.conf import settings
from django.conf.urls.static import static
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

    path('chat/', include('chat.urls')),
    
    path('biometric/', include('bio.urls')),  # Biometric authentication endpoints
    
    # API schema & documentation
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("swagger/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)