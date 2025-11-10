# Complete Django Setup Guide for EC2

## Step-by-Step Instructions

### Step 1: SSH into Your EC2 Instance

```bash
ssh -i your-key.pem ubuntu@54.153.92.247
# Or if using ec2-user:
# ssh -i your-key.pem ec2-user@54.153.92.247
```

**Note:** Replace `your-key.pem` with your actual key file name.

### Step 2: Check Python Installation

```bash
python3 --version
# Should show Python 3.x

# If not installed:
sudo apt update
sudo apt install python3 python3-pip -y
```

### Step 3: Upload Your Django Project to EC2

You have two options:

#### Option A: Using SCP (from your local machine)
```bash
# From your LOCAL machine (not EC2), run:
scp -i your-key.pem -r /Users/jacobbenson/local_data5570_mycode/myproject ubuntu@54.153.92.247:~/
scp -i your-key.pem -r /Users/jacobbenson/local_data5570_mycode/familyhistory ubuntu@54.153.92.247:~/
```

#### Option B: Using Git (recommended)
```bash
# On EC2:
cd ~
git clone YOUR_REPO_URL
# Or create the project structure manually
```

#### Option C: Manual Setup (if you want to recreate)
I can help you create the files directly on EC2 if needed.

### Step 4: Install Required Packages

```bash
# On EC2:
cd ~/myproject  # or wherever you put your Django project

# Install Django and dependencies
pip3 install django djangorestframework django-cors-headers

# Or if you have a requirements.txt:
pip3 install -r requirements.txt
```

### Step 5: Verify Project Structure

Your project should have this structure:
```
~/myproject/
├── manage.py
├── myproject/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── familyhistory/
    ├── __init__.py
    ├── models.py
    ├── views.py
    ├── serializers.py
    └── urls.py
```

### Step 6: Configure Django Settings

Make sure `myproject/settings.py` has:

1. **CORS configured** (should already be done):
   - `'corsheaders'` in INSTALLED_APPS
   - `'corsheaders.middleware.CorsMiddleware'` in MIDDLEWARE
   - CORS settings at bottom

2. **ALLOWED_HOSTS**:
   ```python
   ALLOWED_HOSTS = ['*']  # Or ['54.153.92.247', 'localhost']
   ```

### Step 7: Run Migrations

```bash
cd ~/myproject
python3 manage.py migrate
```

This creates the database tables.

### Step 8: Create Superuser (Optional - for admin)

```bash
python3 manage.py createsuperuser
# Follow prompts to create admin user
```

### Step 9: Start Django Server

```bash
# Run on all interfaces so it's accessible from outside
python3 manage.py runserver 0.0.0.0:8000
```

You should see:
```
Starting development server at http://0.0.0.0:8000/
```

### Step 10: Keep Server Running (After SSH Disconnect)

Use `screen` or `tmux`:

```bash
# Install screen if needed
sudo apt install screen -y

# Start a screen session
screen -S django

# Run Django
python3 manage.py runserver 0.0.0.0:8000

# Detach: Press Ctrl+A, then D
# Reattach later: screen -r django
```

### Step 11: Configure AWS Security Group

In AWS Console:
1. EC2 → Instances → Select your instance
2. Click "Security" tab
3. Click on Security Group name
4. Click "Edit inbound rules"
5. Click "Add rule":
   - **Type:** Custom TCP
   - **Port:** 8000
   - **Source:** My IP (or 0.0.0.0/0 for testing - NOT for production!)

### Step 12: Test from Your Local Machine

```bash
# From your LOCAL machine:
curl http://54.153.92.247:8000/api/recipes/
```

Should return `[]` or JSON data.

## Quick Setup Script

I can create a setup script that does most of this automatically. Would you like me to create one?

## What Information Do I Need?

To help you better, please provide:

1. **Do you have your Django project files on EC2 already?**
   - If yes, where? (path)
   - If no, do you want to upload them?

2. **What's your EC2 username?**
   - `ubuntu` (Ubuntu AMI)
   - `ec2-user` (Amazon Linux)
   - Something else?

3. **Do you have SSH access working?**
   - Can you SSH into the instance?

4. **What Python version is on EC2?**
   - Run: `python3 --version` on EC2

## Common Issues

### Issue: "Module not found"
**Solution:** Make sure you installed all packages:
```bash
pip3 install django djangorestframework django-cors-headers
```

### Issue: "Port already in use"
**Solution:** Kill the process:
```bash
sudo lsof -t -i tcp:8000 | xargs kill -9
```

### Issue: "Permission denied"
**Solution:** Check file permissions:
```bash
chmod +x manage.py
```

### Issue: "Can't connect from local machine"
**Solution:** 
1. Check Security Group allows port 8000
2. Make sure Django is running on `0.0.0.0:8000` (not `127.0.0.1:8000`)
3. Check EC2 instance firewall: `sudo ufw status`

## Next Steps After Setup

Once Django is running:
1. Test API: `curl http://54.153.92.247:8000/api/recipes/`
2. Start your Expo app: `cd fhExpo && npm start`
3. Test creating a recipe in the app

