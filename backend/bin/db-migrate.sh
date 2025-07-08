#!/bin/bash

CYAN='\033[1;36m'
NO_COLOR='\033[0m'
LABEL="db-migrate"
printf "${CYAN}== ${LABEL}${NO_COLOR}\n"

python manage.py makemigrations
python manage.py migrate