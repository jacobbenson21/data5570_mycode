# Final Steps to Get Django Running

## ✅ What's Already Done:
- [x] Project files uploaded to EC2
- [x] Virtual environment created
- [x] Dependencies installed
- [x] Database migrations run

## 🚀 Start Django Server

**SSH into EC2:**
```bash
ssh -i ~/Downloads/jake.pem ubuntu@54.153.92.247
```

**Once on EC2, run:**
```bash
cd ~/myproject
source myvenv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

You should see:
```
Starting development server at http://0.0.0.0:8000/
```

## 🔒 Keep It Running After Disconnect

**Option 1: Using screen (recommended)**
```bash
# SSH into EC2
ssh -i ~/Downloads/jake.pem ubuntu@54.153.92.247

# Start screen session
screen -S django

# Activate venv and start Django
cd ~/myproject
source myvenv/bin/activate
python manage.py runserver 0.0.0.0:8000

# Detach: Press Ctrl+A, then D
# Reattach later: screen -r django
```

**Option 2: Using nohup**
```bash
cd ~/myproject
source myvenv/bin/activate
nohup python manage.py runserver 0.0.0.0:8000 > django.log 2>&1 &
```

## 🔓 Configure Security Group

**In AWS Console:**
1. EC2 → Instances → Select your instance
2. Security tab → Security Group → Edit inbound rules
3. Add rule:
   - **Type:** Custom TCP
   - **Port:** 8000
   - **Source:** My IP (or 0.0.0.0/0 for testing)

## 🧪 Test It

**From your local machine:**
```bash
curl http://54.153.92.247:8000/api/recipes/
```

Should return `[]` or JSON data!

## 📝 Quick Reference

**SSH into EC2:**
```bash
ssh -i ~/Downloads/jake.pem ubuntu@54.153.92.247
```

**Start Django (on EC2):**
```bash
cd ~/myproject && source myvenv/bin/activate && python manage.py runserver 0.0.0.0:8000
```

**Stop Django:**
- If in screen: `screen -r django` then Ctrl+C
- If in terminal: Just Ctrl+C

