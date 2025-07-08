#!/bin/bash

CYAN='\033[1;36m'
NO_COLOR='\033[0m'
LABEL="db-seed"
printf "${CYAN}== ${LABEL}${NO_COLOR}\n"

cd "$(dirname "$0")/.."

echo -e "${CYAN}== Seeding Users...${NO_COLOR}"
python manage.py seed_user

echo -e "${CYAN}== Seeding Customers...${NO_COLOR}"
python manage.py seed_customer