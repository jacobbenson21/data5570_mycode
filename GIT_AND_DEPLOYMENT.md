# Git and EC2 Deployment Guide

## Quick Answers

### 1. What Changes for Option 2 (Permanent Cloudflare Tunnel)?

**If you set up a permanent Cloudflare tunnel with a custom domain:**

**On EC2:**
- Update `myproject/settings.py`:
  - Add your new permanent domain to `CORS_ALLOWED_ORIGINS`
  - Add it to `CSRF_TRUSTED_ORIGINS`
- Restart Django

**On Local (Frontend):**
- Update `fhExpo/config/api.js`:
  - Change `PRODUCTION_API_URL` to your new permanent domain
  - Example: `'https://yourdomain.com/api'`

**That's it!** The tunnel runs automatically on EC2.

---

## 2. Pushing to Git

### Step-by-Step:

```bash
# 1. Check what changed
cd /Users/jacobbenson/local_data5570_mycode
git status

# 2. Add files (excluding .gitignore items)
git add .

# 3. Commit
git commit -m "Add frontend API integration and Cloudflare setup"

# 4. Push
git push origin main
```

### What Gets Committed:
✅ **DO commit:**
- All frontend code (`fhExpo/`)
- Django project code (`myproject/`, `familyhistory/`)
- Configuration files (`requirements.txt`, etc.)
- Documentation files (`.md` files)

❌ **DON'T commit (auto-ignored by .gitignore):**
- `db.sqlite3` (database)
- `myvenv/` (virtual environment)
- `node_modules/` (Node packages)
- `*.pem` (SSH keys)
- `__pycache__/` (Python cache)

---

## 3. What Needs to Be on EC2?

### ✅ Already on EC2 (Backend):
- Django project (`myproject/`, `familyhistory/`)
- Virtual environment (`myvenv/`)
- Database (`db.sqlite3`)
- Django server running
- Cloudflare tunnel (if set up)

### ✅ Stays Local (Frontend):
- Expo app (`fhExpo/`)
- Runs on your machine
- Connects to EC2 backend via API

### 🔄 When to Update EC2:

**Only update EC2 if you change:**
- Django code (`myproject/`, `familyhistory/`)
- `requirements.txt`
- Database models (need migrations)

**Don't update EC2 if you only change:**
- Frontend code (just restart Expo locally)

---

## 4. Syncing Changes to EC2

### Option A: Using Git (Recommended)

**On EC2:**
```bash
ssh -i ~/Downloads/jake.pem ubuntu@54.153.92.247
cd ~/myproject
git pull origin main

# If you changed models:
python3 manage.py migrate

# Restart Django (if running in screen):
screen -r django
# Press Ctrl+C to stop, then:
python3 manage.py runserver 0.0.0.0:8000
# Press Ctrl+A then D to detach
```

### Option B: Using SCP (Manual)

**From local machine:**
```bash
# Upload Django project
scp -i ~/Downloads/jake.pem -r myproject ubuntu@54.153.92.247:~/

# Upload familyhistory app
scp -i ~/Downloads/jake.pem -r familyhistory ubuntu@54.153.92.247:~/myproject/
```

---

## 5. Current Setup Status

### What's Working Now:
- ✅ Frontend runs locally (Expo)
- ✅ Backend runs on EC2 (Django)
- ✅ Frontend connects to EC2 via Cloudflare tunnel
- ✅ CORS configured
- ✅ CSRF configured

### Workflow:

**Making Frontend Changes:**
1. Edit files in `fhExpo/`
2. Test locally (Expo auto-reloads)
3. `git add .` → `git commit -m "message"` → `git push`
4. **No EC2 changes needed** ✅

**Making Backend Changes:**
1. Edit Django files locally
2. `git add .` → `git commit -m "message"` → `git push`
3. On EC2: `git pull` → restart Django
4. Test

---

## 6. Important Notes

### Database:
- **Database stays on EC2** - don't copy it
- If you need to reset: delete `db.sqlite3` on EC2 and run `python3 manage.py migrate`

### Virtual Environment:
- **Virtual environment stays on EC2**
- If you need to recreate: `python3 -m venv myvenv` then `pip install -r requirements.txt`

### Frontend:
- **Frontend never needs to be on EC2**
- It runs on your local machine or will be deployed to EAS later

### API URL:
- Currently: `https://wagner-conditions-rock-familiar.trycloudflare.com/api`
- If you get a permanent domain, update `fhExpo/config/api.js`

---

## 7. Quick Commands Reference

### Local (Your Machine):
```bash
# Start Expo
cd fhExpo && npm start

# Push to git
git add .
git commit -m "Your message"
git push origin main
```

### EC2 (SSH into first):
```bash
# Connect
ssh -i ~/Downloads/jake.pem ubuntu@54.153.92.247

# Pull latest code
cd ~/myproject && git pull origin main

# Start Django (in screen)
screen -S django
source myvenv/bin/activate
cd ~/myproject
python3 manage.py runserver 0.0.0.0:8000
# Press Ctrl+A then D to detach

# View Django logs
screen -r django

# Start Cloudflare tunnel (if permanent, it auto-starts)
cloudflared tunnel --url http://localhost:8000
```

---

## 8. Troubleshooting

### "Can't connect to backend"
- Check EC2 is running
- Check Django is running: `screen -r django`
- Check Cloudflare tunnel is running
- Check `fhExpo/config/api.js` has correct URL

### "CORS error"
- Make sure frontend URL is in `CORS_ALLOWED_ORIGINS` in `myproject/settings.py`
- Restart Django after changing settings

### "Git push fails"
- Make sure you're on the right branch: `git branch`
- Check if remote is set: `git remote -v`

