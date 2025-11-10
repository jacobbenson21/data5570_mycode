# Exact Commands for Your Setup

## Your Info:
- EC2 IP: 54.153.92.247
- SSH Key: ~/Downloads/jake.pem
- EC2 User: ubuntu (or ec2-user if Amazon Linux)

## Step 1: Test SSH Connection

```bash
ssh -i ~/Downloads/jake.pem ubuntu@54.153.92.247
```

**If this works:** You'll see a prompt on EC2. Type `exit` to come back.

**If this fails:** Try `ec2-user` instead:
```bash
ssh -i ~/Downloads/jake.pem ec2-user@54.153.92.247
```

## Step 2: Upload Your Django Project

**From your LOCAL machine** (run these commands):

```bash
cd /Users/jacobbenson/local_data5570_mycode

# Upload Django project
scp -i ~/Downloads/jake.pem -r myproject ubuntu@54.153.92.247:~/

# Upload familyhistory app
scp -i ~/Downloads/jake.pem -r familyhistory ubuntu@54.153.92.247:~/

# Upload requirements.txt
scp -i ~/Downloads/jake.pem requirements.txt ubuntu@54.153.92.247:~/
```

**OR use the automated script:**
```bash
cd /Users/jacobbenson/local_data5570_mycode
./upload_to_ec2.sh
```

## Step 3: Setup Django on EC2

**SSH into EC2:**
```bash
ssh -i ~/Downloads/jake.pem ubuntu@54.153.92.247
```

**Once on EC2, run these commands:**

```bash
# Move familyhistory into myproject
cd ~
mv familyhistory myproject/
cd myproject

# Install Python packages
pip3 install django djangorestframework django-cors-headers
# OR if requirements.txt uploaded:
# pip3 install -r ~/requirements.txt

# Run database migrations
python3 manage.py migrate

# Start Django server
python3 manage.py runserver 0.0.0.0:8000
```

You should see:
```
Starting development server at http://0.0.0.0:8000/
```

**Keep it running:** Press Ctrl+A then D (if using screen) or leave terminal open.

## Step 4: Configure AWS Security Group

1. Go to AWS Console → EC2 → Instances
2. Select your instance (54.153.92.247)
3. Click "Security" tab
4. Click on Security Group name
5. Click "Edit inbound rules"
6. Click "Add rule":
   - **Type:** Custom TCP
   - **Port:** 8000
   - **Source:** My IP (or 0.0.0.0/0 for testing)

## Step 5: Test from Local Machine

**Open a NEW terminal** (keep EC2 one running), then:

```bash
curl http://54.153.92.247:8000/api/recipes/
```

Should return `[]` or JSON data!

## Quick Copy-Paste Commands

### Upload (run locally):
```bash
cd /Users/jacobbenson/local_data5570_mycode && scp -i ~/Downloads/jake.pem -r myproject familyhistory requirements.txt ubuntu@54.153.92.247:~/
```

### Setup (run on EC2 after SSH):
```bash
cd ~ && mv familyhistory myproject/ && cd myproject && pip3 install django djangorestframework django-cors-headers && python3 manage.py migrate && python3 manage.py runserver 0.0.0.0:8000
```

## Troubleshooting

**If SSH fails:**
- Check key permissions: `chmod 400 ~/Downloads/jake.pem`
- Try `ec2-user` instead of `ubuntu`
- Check Security Group allows SSH (port 22)

**If upload fails:**
- Make sure you're running from the project directory
- Check key file path is correct

**If Django won't start:**
- Check Python: `python3 --version`
- Install packages: `pip3 install django djangorestframework django-cors-headers`
- Check you're in the right directory (where manage.py is)

