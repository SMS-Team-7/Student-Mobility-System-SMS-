# Use official Python image as base
FROM python:3.13-slim

# ---- Set environment variables ----
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# ---- Set working directory ----
WORKDIR /app

# ---- Install system dependencies + OpenJDK 21 ----
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    build-essential \
    ca-certificates \
    gnupg \
    && mkdir -p /usr/share/man/man1 \
    && apt-get install -y openjdk-21-jdk-headless\
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ---- Copy requirements and install ----
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---- Copy project files ----
COPY . .

# ---- Expose the app port ----
EXPOSE 8000

# ---- Run the app ----
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
