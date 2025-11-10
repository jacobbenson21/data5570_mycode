#!/bin/bash

# Script to start Django on EC2
# Run this ON EC2 after SSH'ing in

cd ~/myproject
source myvenv/bin/activate
python manage.py runserver 0.0.0.0:8000

