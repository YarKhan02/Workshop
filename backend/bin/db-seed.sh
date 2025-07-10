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

echo -e "${CYAN}== Seeding Cars...${NO_COLOR}"
python manage.py seed_car

echo -e "${CYAN}== Seeding Product...${NO_COLOR}"
python manage.py seed_product

echo -e "${CYAN}== Seeding Product Variant...${NO_COLOR}"
python manage.py seed_product_variant