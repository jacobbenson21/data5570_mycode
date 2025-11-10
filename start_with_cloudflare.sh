#!/bin/bash

# Script to start Django and Cloudflare tunnel
# Run this ON EC2

cd ~/myproject
source myvenv/bin/activate

# Start Django in background
python manage.py runserver 0.0.0.0:8000 > django.log 2>&1 &
DJANGO_PID=$!

echo "Django started (PID: $DJANGO_PID)"
echo "Waiting 3 seconds for Django to start..."
sleep 3

# Start Cloudflare tunnel
echo "Starting Cloudflare tunnel..."
echo "Your HTTPS URL will appear below:"
echo ""

cloudflared tunnel --url http://localhost:8000

# If tunnel stops, kill Django too
kill $DJANGO_PID 2>/dev/null

