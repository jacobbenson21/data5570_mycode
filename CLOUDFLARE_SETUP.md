# Cloudflare Tunnel Setup for HTTPS

## What This Does
Cloudflare tunnel creates a secure HTTPS connection to your Django backend, so you don't have to expose port 8000 directly and get a free SSL certificate.

## Step 1: Install Cloudflared on EC2

**SSH into EC2:**
```bash
ssh -i ~/Downloads/jake.pem ubuntu@54.153.92.247
```

**Install cloudflared:**
```bash
curl -L https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-archive-keyring.gpg >/dev/null

echo "deb [signed-by=/usr/share/keyrings/cloudflare-archive-keyring.gpg] https://pkg.cloudflare.com/cloudflared $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/cloudflared.list

sudo apt update
sudo apt install -y cloudflared
```

## Step 2: Start Cloudflare Tunnel

**Make sure Django is running first:**
```bash
cd ~/myproject
source myvenv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

**In a NEW terminal/SSH session, start the tunnel:**
```bash
ssh -i ~/Downloads/jake.pem ubuntu@54.153.92.247
cloudflared tunnel --url http://localhost:8000
```

You'll see output like:
```
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable): |
|  https://xxxx-xxxx-xxxx.trycloudflare.com                                                 |
|                                                                                            |
+--------------------------------------------------------------------------------------------+
```

**Copy that HTTPS URL!** It will look like: `https://xxxx-xxxx-xxxx.trycloudflare.com`

## Step 3: Update Frontend API URL

Edit `fhExpo/config/api.js` and update the URL:
```javascript
const PRODUCTION_API_URL = 'https://xxxx-xxxx-xxxx.trycloudflare.com/api';
```

Replace `xxxx-xxxx-xxxx.trycloudflare.com` with your actual Cloudflare URL.

## Step 4: Update CORS Settings

**On EC2, update `myproject/settings.py`:**

Add your Cloudflare URL to CORS_ALLOWED_ORIGINS:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:8081',
    'http://127.0.0.1:8081',
    'http://localhost:19006',
    'http://127.0.0.1:19006',
    'https://xxxx-xxxx-xxxx.trycloudflare.com',  # Add your Cloudflare URL
]
```

**Restart Django** after updating settings.

## Step 5: Keep Tunnel Running

The tunnel URL changes each time you restart it. To keep it running:

**Option 1: Use screen (recommended)**
```bash
# SSH into EC2
ssh -i ~/Downloads/jake.pem ubuntu@54.153.92.247

# Start screen session for tunnel
screen -S cloudflare
cloudflared tunnel --url http://localhost:8000

# Detach: Ctrl+A then D
# Reattach: screen -r cloudflare
```

**Option 2: Run in background**
```bash
nohup cloudflared tunnel --url http://localhost:8000 > cloudflare.log 2>&1 &
```

## Important Notes

⚠️ **Tunnel URL Changes**: The free Cloudflare tunnel URL changes each time you restart it. For a permanent URL, you need to:
1. Create a Cloudflare account
2. Set up a named tunnel
3. Configure a custom domain

⚠️ **Two Processes Needed**:
- Django server: `python manage.py runserver 0.0.0.0:8000`
- Cloudflare tunnel: `cloudflared tunnel --url http://localhost:8000`

Both need to be running!

## Quick Setup Script

I can create a script that starts both Django and Cloudflare tunnel together. Would you like me to create that?

