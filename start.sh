#!/bin/sh
set -e

echo "📦 Applying database migrations..."
python manage.py migrate --noinput

echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

# Use Render’s dynamic port (or 8000 locally)
PORT=${PORT:-8000}

if [ "$RENDER" = "true" ]; then
  echo "🚀 Starting Django with Gunicorn on port $PORT..."
  gunicorn team7.wsgi:application --bind 0.0.0.0:$PORT --workers 4 --timeout 120
else
  echo "🚀 Starting Django development server on port $PORT..."
  python manage.py runserver 0.0.0.0:$PORT
fi
