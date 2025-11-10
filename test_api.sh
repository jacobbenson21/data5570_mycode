#!/bin/bash

# API Testing Script
# Replace YOUR_EC2_IP with your actual EC2 public IP address

EC2_IP="54.153.92.247"

echo "=========================================="
echo "Testing Family History Recipe API"
echo "=========================================="
echo ""

echo "1. Testing GET /api/recipes/"
echo "----------------------------------------"
curl -s http://$EC2_IP:8000/api/recipes/ | python3 -m json.tool 2>/dev/null || curl -s http://$EC2_IP:8000/api/recipes/
echo ""
echo ""

echo "2. Testing POST /api/recipes/ (Create Recipe)"
echo "----------------------------------------"
curl -X POST http://$EC2_IP:8000/api/recipes/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Recipe from Script","description":"This is a test recipe created by the test script","servings":4}' \
  -s | python3 -m json.tool 2>/dev/null || curl -X POST http://$EC2_IP:8000/api/recipes/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Recipe from Script","description":"This is a test recipe created by the test script","servings":4}' \
  -s
echo ""
echo ""

echo "3. Testing GET /api/people/"
echo "----------------------------------------"
curl -s http://$EC2_IP:8000/api/people/ | python3 -m json.tool 2>/dev/null || curl -s http://$EC2_IP:8000/api/people/
echo ""
echo ""

echo "4. Testing POST /api/people/ (Create Person)"
echo "----------------------------------------"
curl -X POST http://$EC2_IP:8000/api/people/ \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"Person"}' \
  -s | python3 -m json.tool 2>/dev/null || curl -X POST http://$EC2_IP:8000/api/people/ \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"Person"}' \
  -s
echo ""
echo ""

echo "5. Testing GET /api/countries/"
echo "----------------------------------------"
curl -s http://$EC2_IP:8000/api/countries/ | python3 -m json.tool 2>/dev/null || curl -s http://$EC2_IP:8000/api/countries/
echo ""
echo ""

echo "=========================================="
echo "Testing Complete!"
echo "=========================================="
echo ""
echo "If you see JSON responses above, your API is working!"
echo "If you see errors, check:"
echo "  1. EC2 Security Group allows port 8000"
echo "  2. Django is running: python manage.py runserver 0.0.0.0:8000"
echo "  3. CORS is configured in settings.py"
echo "  4. You replaced YOUR_EC2_IP with your actual IP"

