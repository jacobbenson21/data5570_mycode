# Setup Instructions for Backend Connection

## ✅ What's Been Done

1. **Backend CORS Configuration** - Updated `myproject/settings.py` with CORS settings
2. **API Service Layer** - Created `fhExpo/services/api.js` with all API functions
3. **API Configuration** - Created `fhExpo/config/api.js` for URL management
4. **Redux Async Thunks** - Updated `fhExpo/app/store.jsx` with async thunks for GET and POST
5. **Root Layout** - Updated to fetch data on app startup

## 🔧 What You Need to Do

### 1. On Your EC2 Instance

```bash
# Install CORS headers
python3 -m pip install django-cors-headers

# Make sure ALLOWED_HOSTS in settings.py includes your EC2 IP or '*'
# (Already done in settings.py)

# Run Django server on all interfaces
python manage.py runserver 0.0.0.0:8000
```

### 2. Configure AWS Security Group

- Go to EC2 → Security Groups
- Add Inbound Rule: Custom TCP, Port 8000, Source: Your IP (or 0.0.0.0/0 for testing)

### 3. Update Frontend API URL

Edit `fhExpo/config/api.js`:
```javascript
const PRODUCTION_API_URL = 'http://YOUR_EC2_PUBLIC_IP:8000/api';
```

Replace `YOUR_EC2_PUBLIC_IP` with your actual EC2 public IP address.

### 4. Update Remaining Components

The following files still need to be updated to use the new state structure and async thunks:

- `fhExpo/app/recipes/[id].jsx` - Update selectors and dispatch calls
- `fhExpo/app/recipes/edit/[id].jsx` - Update selectors and dispatch calls
- `fhExpo/app/people/[id].jsx` - Update selectors and dispatch calls
- `fhExpo/app/people/edit/[id].jsx` - Update selectors and dispatch calls
- `fhExpo/app/add_person.jsx` - Update dispatch calls
- `fhExpo/app/add_country.jsx` - Update dispatch calls
- `fhExpo/components/RecipeList.jsx` - Update selectors
- `fhExpo/components/RecipeIngredients.jsx` - Update selectors and dispatch calls

### 5. State Structure Changes

All selectors need to be updated from:
```javascript
const recipes = useSelector((state) => state.recipes || []);
```

To:
```javascript
const recipes = useSelector((state) => state.recipes?.items || []);
```

### 6. Dispatch Changes

All dispatch calls need to be updated from:
```javascript
dispatch(addRecipe(data));
```

To:
```javascript
await dispatch(createRecipe(data)).unwrap();
```

## 📝 Files Already Updated

- ✅ `myproject/settings.py` - CORS configured
- ✅ `fhExpo/config/api.js` - API URL config
- ✅ `fhExpo/services/api.js` - API service functions
- ✅ `fhExpo/app/store.jsx` - Async thunks added
- ✅ `fhExpo/app/_layout.tsx` - Fetches data on startup
- ✅ `fhExpo/app/index.jsx` - Updated selectors
- ✅ `fhExpo/app/add_recipe.jsx` - Updated to use async thunks

## 🧪 Testing

1. Test backend connection:
   ```bash
   curl http://YOUR_EC2_IP:8000/api/recipes/
   ```

2. Test POST request:
   ```bash
   curl -X POST http://YOUR_EC2_IP:8000/api/recipes/ \
     -H "Content-Type: application/json" \
     -d '{"title":"Test Recipe"}'
   ```

3. Run frontend and verify data loads from backend

