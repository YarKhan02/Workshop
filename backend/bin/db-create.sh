#!/bin/bash

CYAN='\033[1;36m'
NO_COLOR='\033[0m'
LABEL="db-create"
printf "${CYAN}== ${LABEL}${NO_COLOR}\n"

# Set your connection string
# CONNECTION_URL="postgresql://yarkhan:yarkhanworkshop@localhost:5432/postgres"
CONNECTION_URL="postgresql://detailinghub:RoDFD9WJ6HgpV7RZc2R9@detailinghub.cz26gy8cuvti.ap-southeast-2.rds.amazonaws.com:5432/workshop"

# Create the new database
psql $CONNECTION_URL -c "CREATE DATABASE workshop"