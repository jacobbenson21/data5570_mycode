# Quick Start: Get Django Running on EC2

## 🚀 Fastest Way (3 Steps)

### Step 1: Upload Your Project to EC2

**From your LOCAL machine**, run:
```bash
# Edit upload_to_ec2.sh first - update KEY_FILE with your key file name
nano upload_to_ec2.sh
# Then run:
./upload_to_ec2.sh
```

**OR manually:**
```bash
# Replace 'your-key.pem' with your actual key file
scp -i your-key.pem -r myproject ubuntu@54.153.92.247:~/
scp -i your-key.pem -r familyhistory ubuntu@54.153.92.247:~/
scp -i your-key.pem requirements.txt ubuntu@54.153.92.247:~/
```

### Step 2: SSH into EC2 and Setup

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@54.153.92.247

# Once on EC2, run these commands:
cd ~
mv familyhistory myproject/
cd myproject

# Install dependencies
pip3 install -r ~/requirements.txt
# OR: pip3 install django djangorestframework django-cors-headers

# Run migrations
python3 manage.py migrate

# Start server
python3 manage.py runserver 0.0.0.0:8000
```

### Step 3: Configure Security Group

In AWS Console:
1. EC2 → Instances → Your instance
2. Security tab → Security Group → Edit inbound rules
3. Add: Custom TCP, Port 8000, Source: My IP (or 0.0.0.0/0 for testing)

## ✅ Test It

From your local machine:
```bash
curl http://54.153.92.247:8000/api/recipes/
```

Should return `[]` or JSON data!

## 📝 What You Need to Provide

1. **Your SSH key file name** - What's your `.pem` file called?
   - Example: `my-key.pem`, `ec2-key.pem`, etc.

2. **EC2 username** - Usually:
   - `ubuntu` (for Ubuntu AMI)
   - `ec2-user` (for Amazon Linux)
   - Check your AMI type in AWS Console

3. **Can you SSH?** - Try:
   ```bash
   ssh -i your-key.pem ubuntu@54.153.92.247
   ```

## 🔧 Alternative: Manual Setup

If you prefer to do it step by step:

1. **SSH into EC2**
2. **Install Python packages:**
   ```bash
   sudo apt update
   sudo apt install python3 python3-pip -y
   pip3 install django djangorestframework django-cors-headers
   ```
3. **Upload your project** (use SCP or Git)
4. **Run migrations:**
   ```bash
   cd ~/myproject
   python3 manage.py migrate
   ```
5. **Start server:**
   ```bash
   python3 manage.py runserver 0.0.0.0:8000
   ```

## 🎯 Keep Server Running After Disconnect

```bash
# Use screen
screen -S django
python3 manage.py runserver 0.0.0.0:8000
# Press Ctrl+A then D to detach

# Reattach later:
screen -r django
```

## ❓ Need Help?

Tell me:
1. What's your SSH key file name?
2. Can you SSH into EC2? (yes/no)
3. What happens when you try?

Then I can give you exact commands to run!

