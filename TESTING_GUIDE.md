# Testing Guide - Family History Recipe App

## Step 1: Test Backend API (On EC2)

### 1.1 Install CORS Headers
```bash
python3 -m pip install django-cors-headers
```

### 1.2 Start Django Server
```bash
# Make sure you're in your Django project directory
cd /path/to/your/django/project
python manage.py runserver 0.0.0.0:8000
```

### 1.3 Test Backend from EC2 (SSH into EC2)
```bash
# Test GET request
curl http://localhost:8000/api/recipes/

# Test POST request (create a recipe)
curl -X POST http://localhost:8000/api/recipes/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Recipe","description":"This is a test"}'

# Test GET people
curl http://localhost:8000/api/people/

# Test GET countries
curl http://localhost:8000/api/countries/
```

If these work, your backend is running correctly!

## Step 2: Test Backend from Your Local Machine

### 2.1 Get Your EC2 Public IP
- Go to AWS Console → EC2 → Instances
- Find your instance's **Public IPv4 address**

### 2.2 Test Connection from Local Machine
```bash
# Replace YOUR_EC2_IP with your actual EC2 IP
curl http://YOUR_EC2_IP:8000/api/recipes/
```

**Expected Result:**
- If you see `[]` (empty array) or JSON data → ✅ Backend is accessible!
- If you see "Connection refused" → ❌ Check Security Group (port 8000)
- If you see timeout → ❌ Check Security Group or firewall

### 2.3 Test POST Request from Local Machine
```bash
curl -X POST http://YOUR_EC2_IP:8000/api/recipes/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Recipe from Local","description":"Testing connection"}'
```

**Expected Result:**
- If you see JSON with the created recipe → ✅ POST works!
- If you see CORS error → ❌ Check CORS settings in settings.py

## Step 3: Configure Frontend

### 3.1 Update API URL
Edit `fhExpo/config/api.js`:
```javascript
const PRODUCTION_API_URL = 'http://YOUR_EC2_IP:8000/api';
```

Replace `YOUR_EC2_IP` with your actual EC2 public IP.

### 3.2 Test with Environment Variable (Optional)
Create `.env` file in `fhExpo/` directory:
```
EXPO_PUBLIC_API_URL=http://YOUR_EC2_IP:8000/api
```

## Step 4: Test Frontend Connection

### 4.1 Start Expo App
```bash
cd fhExpo
npm start
# Or
expo start
```

### 4.2 Open in Browser
- Press `w` to open in web browser
- Or navigate to the URL shown (usually `http://localhost:8081`)

### 4.3 Check Browser Console
1. Open Developer Tools (F12 or Cmd+Option+I)
2. Go to Console tab
3. Look for:
   - ✅ No errors → Good!
   - ✅ "Error fetching data from backend" → Check API URL
   - ❌ CORS errors → Check CORS settings

### 4.4 Test GET Request (Data Loading)
1. Open the app
2. Check if recipes/people/countries load automatically
3. If empty, that's OK if database is empty
4. Check Network tab in DevTools:
   - Look for requests to `http://YOUR_EC2_IP:8000/api/recipes/`
   - Status should be `200 OK`

### 4.5 Test POST Request (Create Recipe)
1. Click "Add New Recipe"
2. Fill in:
   - Title: "Test Recipe"
   - Description: "Testing POST request"
3. Click "Add Recipe"
4. Check:
   - ✅ Recipe appears in list → POST works!
   - ❌ Error message → Check console for details

### 4.6 Test POST Request (Create Person)
1. Click "People" or navigate to add person
2. Fill in:
   - First Name: "Test"
   - Last Name: "Person"
3. Click "Add Person"
4. Check if person appears in list

## Step 5: Full Flow Testing

### Test Complete CRUD Operations:

1. **CREATE** ✅
   - Add a recipe
   - Add a person
   - Add a country
   - Verify they appear in lists

2. **READ** ✅
   - View recipe details
   - View person details
   - Check if data loads from backend

3. **UPDATE** ✅
   - Edit a recipe
   - Edit a person
   - Verify changes save

4. **DELETE** ✅
   - Delete a recipe
   - Delete a person
   - Verify they disappear

## Step 6: Check Redux DevTools (Optional)

If you have Redux DevTools installed:
1. Open DevTools
2. Check Redux tab
3. You should see:
   - `recipes/fetchAll/pending`
   - `recipes/fetchAll/fulfilled`
   - Actions for create/update/delete

## Common Issues & Solutions

### Issue: CORS Error
**Error:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution:**
1. Check `settings.py` has `corsheaders` installed
2. Verify CORS middleware is before SecurityMiddleware
3. Add your frontend URL to `CORS_ALLOWED_ORIGINS`
4. Or temporarily use `CORS_ALLOW_ALL_ORIGINS = True` for testing

### Issue: Connection Refused
**Error:** `Failed to fetch` or `Network request failed`

**Solution:**
1. Check EC2 Security Group allows port 8000
2. Verify Django is running on `0.0.0.0:8000` (not `127.0.0.1:8000`)
3. Check your local firewall

### Issue: 404 Not Found
**Error:** `404 Not Found` when accessing API

**Solution:**
1. Verify URL ends with `/api/recipes/` (note trailing slash)
2. Check Django URLs are configured correctly
3. Verify `path('api/', include('familyhistory.urls'))` in main urls.py

### Issue: Data Not Loading
**Symptoms:** App loads but shows empty lists

**Solution:**
1. Check browser console for errors
2. Check Network tab - are requests being made?
3. Verify API URL is correct in `config/api.js`
4. Test API directly with curl

## Quick Test Checklist

- [ ] Backend runs on EC2 (`python manage.py runserver 0.0.0.0:8000`)
- [ ] Can curl backend from local machine
- [ ] Frontend API URL configured correctly
- [ ] App loads without errors
- [ ] Data loads from backend (GET works)
- [ ] Can create recipe (POST works)
- [ ] Can create person (POST works)
- [ ] Can edit recipe (PUT works)
- [ ] Can delete recipe (DELETE works)

## Testing Script

Run this quick test script to verify everything:

```bash
# Test script - save as test_api.sh
#!/bin/bash

EC2_IP="YOUR_EC2_IP"  # Replace with your IP

echo "Testing GET recipes..."
curl -s http://$EC2_IP:8000/api/recipes/ | head -20

echo -e "\n\nTesting POST recipe..."
curl -X POST http://$EC2_IP:8000/api/recipes/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Recipe","description":"API Test"}' \
  -s | head -20

echo -e "\n\nTesting GET people..."
curl -s http://$EC2_IP:8000/api/people/ | head -20

echo -e "\n\nDone!"
```

Make it executable and run:
```bash
chmod +x test_api.sh
./test_api.sh
```

