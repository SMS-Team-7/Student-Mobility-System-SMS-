#!/bin/sh
set -e

echo "📦 Applying database migrations..."
python manage.py migrate --noinput

echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

# 👑 Create a default admin user if it doesn't exist
echo "👑 Creating default superuser if not exists..."
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
username = "dan"
email = "olorunfemidaniel53@gmail.com"
password = "2004"

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print("✅ Superuser created: username='admin' | password='admin1234'")
else:
    print("ℹ️ Superuser already exists.")
EOF

# Use Render’s dynamic port (or 8000 locally)
PORT=${PORT:-8000}

if [ "$RENDER" = "true" ]; then
  echo "🚀 Starting Django with Gunicorn on port $PORT..."
  gunicorn team7.wsgi:application --bind 0.0.0.0:$PORT --workers 4 --timeout 120
else
  echo "🚀 Starting Django development server on port $PORT..."
  python manage.py runserver 0.0.0.0:$PORT
fi
