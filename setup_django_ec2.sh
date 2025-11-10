#!/bin/bash

# Django Setup Script for EC2
# Run this script ON YOUR EC2 INSTANCE (not locally)

echo "=========================================="
echo "Django Setup Script for EC2"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo "Please don't run as root. Use a regular user."
   exit 1
fi

# Update system
echo "1. Updating system packages..."
sudo apt update

# Install Python and pip if not installed
echo ""
echo "2. Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "   Installing Python3..."
    sudo apt install python3 python3-pip -y
else
    echo "   Python3 already installed: $(python3 --version)"
fi

# Install Django and dependencies
echo ""
echo "3. Installing Django and dependencies..."
pip3 install django djangorestframework django-cors-headers

# Check if manage.py exists
echo ""
echo "4. Looking for Django project..."
if [ -f "manage.py" ]; then
    echo "   Found manage.py in current directory"
    PROJECT_DIR=$(pwd)
elif [ -f "../manage.py" ]; then
    echo "   Found manage.py in parent directory"
    cd ..
    PROJECT_DIR=$(pwd)
elif [ -f "~/myproject/manage.py" ]; then
    echo "   Found manage.py in ~/myproject"
    cd ~/myproject
    PROJECT_DIR=$(pwd)
else
    echo "   ⚠️  manage.py not found!"
    echo "   Please navigate to your Django project directory first"
    echo "   Or create a new project with: django-admin startproject myproject"
    exit 1
fi

echo "   Project directory: $PROJECT_DIR"

# Run migrations
echo ""
echo "5. Running database migrations..."
cd "$PROJECT_DIR"
python3 manage.py migrate

# Check settings.py for CORS
echo ""
echo "6. Checking CORS configuration..."
if grep -q "corsheaders" "$PROJECT_DIR/myproject/settings.py"; then
    echo "   ✅ CORS headers found in settings"
else
    echo "   ⚠️  CORS headers not found. You may need to configure them."
fi

# Check ALLOWED_HOSTS
echo ""
echo "7. Checking ALLOWED_HOSTS..."
if grep -q "ALLOWED_HOSTS = \['\*'\]" "$PROJECT_DIR/myproject/settings.py"; then
    echo "   ✅ ALLOWED_HOSTS configured"
else
    echo "   ⚠️  ALLOWED_HOSTS may need to be set to ['*'] or ['54.153.92.247']"
fi

# Install screen for keeping server running
echo ""
echo "8. Installing screen (for keeping server running)..."
sudo apt install screen -y

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Make sure Security Group allows port 8000"
echo "2. Start Django server:"
echo "   screen -S django"
echo "   python3 manage.py runserver 0.0.0.0:8000"
echo "   (Press Ctrl+A then D to detach)"
echo ""
echo "3. Test from your local machine:"
echo "   curl http://54.153.92.247:8000/api/recipes/"
echo ""

