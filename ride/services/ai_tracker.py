# ride/services/ai_tracker.py

from math import radians, sin, cos, sqrt, atan2
from datetime import datetime

def haversine(lat1, lon1, lat2, lon2):
    """Calculate distance in km between two coordinates."""
    R = 6371.0
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    return R * 2 * atan2(sqrt(a), sqrt(1 - a))

def analyze_driver_behavior(driver_locations):
    """AI logic to monitor driver behavior."""
    if len(driver_locations) < 2:
        return {"status": "insufficient_data"}

    start = driver_locations[0]
    end = driver_locations[-1]
    distance = haversine(start.latitude, start.longitude, end.latitude, end.longitude)
    time_diff = (end.timestamp - start.timestamp).total_seconds() / 3600  # hours

    avg_speed = distance / time_diff if time_diff > 0 else 0

    if avg_speed > 120:
        return {"alert": "Driver may be speeding", "avg_speed": avg_speed}
    elif avg_speed < 5 and distance > 0.5:
        return {"alert": "Driver stopped unexpectedly", "avg_speed": avg_speed}
    else:
        return {"status": "normal", "avg_speed": avg_speed}
