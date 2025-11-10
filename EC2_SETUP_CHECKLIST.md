# EC2 Setup Checklist

## ✅ What's Done
- [x] EC2 instance started
- [x] Public IP: 54.153.92.247
- [x] Frontend API config updated

## 🔧 What You Need to Do on EC2

### 1. SSH into Your EC2 Instance
```bash
ssh -i your-key.pem ubuntu@54.153.92.247
# Or ec2-user@54.153.92.247 (depending on AMI)
```

### 2. Install CORS Headers (if not already installed)
```bash
python3 -m pip install django-cors-headers
```

### 3. Navigate to Your Django Project
```bash
cd /path/to/your/django/project
# Usually something like: cd ~/myproject or cd /home/ubuntu/myproject
```

### 4. Make Sure CORS is Configured
Check `myproject/settings.py` has:
- `'corsheaders'` in INSTALLED_APPS
- `'corsheaders.middleware.CorsMiddleware'` in MIDDLEWARE (before SecurityMiddleware)
- CORS settings at the bottom

### 5. Start Django Server
```bash
# Run on all interfaces (0.0.0.0) so it's accessible from outside
python manage.py runserver 0.0.0.0:8000
```

**OR use screen/tmux to keep it running after you disconnect:**
```bash
# Using screen
screen -S django
python manage.py runserver 0.0.0.0:8000
# Press Ctrl+A then D to detach (keeps running)

# To reattach later:
screen -r django
```

### 6. Configure AWS Security Group
In AWS Console:
1. Go to EC2 → Instances
2. Select your instance
3. Click "Security" tab
4. Click on Security Group
5. Click "Edit inbound rules"
6. Add rule:
   - Type: Custom TCP
   - Port: 8000
   - Source: My IP (or 0.0.0.0/0 for testing - NOT for production!)

## 🧪 Test the Connection

### From Your Local Machine:
```bash
# Test GET request
curl http://54.153.92.247:8000/api/recipes/

# Test POST request
curl -X POST http://54.153.92.247:8000/api/recipes/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Recipe","description":"Testing connection"}'
```

### Or Use the Test Script:
```bash
./test_api.sh
```

## ✅ Quick Checklist

- [ ] SSH'd into EC2
- [ ] Installed django-cors-headers
- [ ] CORS configured in settings.py
- [ ] Django server running on 0.0.0.0:8000
- [ ] Security Group allows port 8000
- [ ] Can curl API from local machine
- [ ] Frontend API URL is set to http://54.153.92.247:8000/api

## 🚀 Once Everything Works

1. Start your Expo app:
   ```bash
   cd fhExpo
   npm start
   ```

2. Open in browser (press 'w')

3. Check browser console for any errors

4. Try creating a recipe to test POST request

## ⚠️ Important Notes

- **Keep Django running**: If you close your SSH session, Django will stop. Use `screen` or `tmux` to keep it running.
- **Security Group**: Make sure port 8000 is open in your Security Group
- **Firewall**: Some EC2 instances have additional firewall rules - check `sudo ufw status` if needed

