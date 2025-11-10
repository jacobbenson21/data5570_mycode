# Troubleshooting Guide

## Issue: Buttons Not Working / Can't Add Recipes or People

### Check 1: Browser Console Errors
1. Open your Expo app in browser
2. Press F12 (or Cmd+Option+I on Mac) to open DevTools
3. Go to Console tab
4. Look for errors when clicking buttons

**Common errors:**
- `Failed to fetch` → API connection issue
- `CORS error` → CORS not configured on backend
- `404 Not Found` → Wrong API URL
- `Network request failed` → Backend not running or Security Group issue

### Check 2: Network Tab
1. In DevTools, go to Network tab
2. Click "Add Recipe" button
3. Look for requests to `http://54.153.92.247:8000/api/recipes/`
4. Check the status:
   - **200 OK** → Working!
   - **404** → Wrong URL
   - **CORS error** → CORS not configured
   - **Failed** → Backend not running

### Check 3: API URL Configuration
The app should be using: `http://54.153.92.247:8000/api`

Check `fhExpo/config/api.js` - it should have:
```javascript
const PRODUCTION_API_URL = 'http://54.153.92.247:8000/api';
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || PRODUCTION_API_URL;
```

### Check 4: Backend is Running
On EC2, make sure Django is running:
```bash
ssh -i ~/Downloads/jake.pem ubuntu@54.153.92.247
cd ~/myproject
source myvenv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

### Check 5: Security Group
In AWS Console:
- EC2 → Instances → Your instance
- Security tab → Security Group
- Make sure port 8000 is allowed

### Check 6: CORS Configuration
On EC2, check `myproject/settings.py` has:
- `'corsheaders'` in INSTALLED_APPS
- CORS middleware configured
- `CORS_ALLOWED_ORIGINS` includes your frontend URL

## Issue: No Test Data

The database starts empty. To add test data:

### Option 1: Use Django Admin
1. Go to: http://54.153.92.247:8000/admin/
2. Create superuser if needed:
   ```bash
   ssh -i ~/Downloads/jake.pem ubuntu@54.153.92.247
   cd ~/myproject
   source myvenv/bin/activate
   python manage.py createsuperuser
   ```
3. Log in and add data through admin interface

### Option 2: Use the App
- Use the "Add Recipe" and "Add Person" buttons in your Expo app
- If buttons work, data will be saved to backend

### Option 3: Add via API
```bash
# Add a recipe
curl -X POST http://54.153.92.247:8000/api/recipes/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Recipe","description":"My first recipe"}'

# Add a person
curl -X POST http://54.153.92.247:8000/api/people/ \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe"}'
```

## Quick Fixes

### Force API URL (if __DEV__ is causing issues)
Edit `fhExpo/config/api.js`:
```javascript
export const API_BASE_URL = 'http://54.153.92.247:8000/api';
```

### Restart Expo App
```bash
# Stop current Expo (Ctrl+C)
# Then restart
cd fhExpo
npm start
```

### Clear Browser Cache
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Or clear browser cache

