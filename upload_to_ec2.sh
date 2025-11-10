#!/bin/bash

# Script to upload Django project to EC2
# Run this from your LOCAL machine (not on EC2)

EC2_IP="54.153.92.247"
EC2_USER="ubuntu"  # Change to "ec2-user" if using Amazon Linux
KEY_FILE="$HOME/Downloads/jake.pem"

echo "=========================================="
echo "Uploading Django Project to EC2"
echo "=========================================="
echo ""

# Check if key file exists
if [ ! -f "$KEY_FILE" ]; then
    echo "❌ Key file not found: $KEY_FILE"
    echo "Please update KEY_FILE in this script with your actual key file path"
    exit 1
fi

echo "Uploading project files..."
echo ""

# Upload Django project
echo "1. Uploading myproject directory..."
scp -i "$KEY_FILE" -r myproject "$EC2_USER@$EC2_IP:~/" || {
    echo "❌ Failed to upload myproject"
    exit 1
}

# Upload familyhistory app
echo "2. Uploading familyhistory app..."
scp -i "$KEY_FILE" -r familyhistory "$EC2_USER@$EC2_IP:~/" || {
    echo "❌ Failed to upload familyhistory"
    exit 1
}

echo ""
echo "=========================================="
echo "Upload Complete!"
echo "=========================================="
echo ""
echo "Next steps on EC2:"
echo "1. SSH into EC2: ssh -i $KEY_FILE $EC2_USER@$EC2_IP"
echo "2. Move files to correct location:"
echo "   mv ~/myproject ~/"
echo "   mv ~/familyhistory ~/myproject/"
echo "3. Run setup script: cd ~/myproject && bash setup_django_ec2.sh"
echo ""

