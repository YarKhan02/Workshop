#!/bin/bash

# Navigate to backend directory (if not already there)
cd "$(dirname "$0")"

# Activate virtual environment
source venv/bin/activate

# Run Django development server
python3 manage.py runserver