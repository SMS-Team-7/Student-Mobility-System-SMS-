#!/bin/sh

echo "📦 Applying database migrations..."
python manage.py migrate --noinput

echo "🚀 Starting Django development server..."
python manage.py runserver 0.0.0.0:8000
