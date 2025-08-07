#!/bin/bash

echo -e "\e[32mLaunching the project...\e[0m"

BLANK_START=false

if [[ "$1" == "--blank-start" ]]; then
	BLANK_START=true
fi

sed -i "s|/home/[^/]\+/data/|/home/$USER/data/|g" .env

source .env

if $BLANK_START; then
	echo -e "\e[33m--> Starting with a new image and clean volumes...\e[0m"
	sudo docker compose down --volumes --remove-orphans
	sudo docker system prune -f
	sudo rm -rf "${SQL_DATA_PATH}"
	sudo rm -rf "${WP_DATA_PATH}"
	echo -e "\e[33m--> All volumes and data directories cleaned.\e[0m"
else
	echo -e "\e[34m--> Continuing with existing data...\e[0m"
	sudo docker compose down --remove-orphans
fi

if ! grep -q "${DOMAIN_NAME}" /etc/hosts; then
	echo "127.0.0.0 ${DOMAIN_NAME}" | sudo tee -a /etc/hosts
	echo -e "\e[32m--> The domain name ${DOMAIN_NAME} has been added to /etc/hosts."
else
	echo -e "\e[34m--> The domain name ${DOMAIN_NAME} is already present in /etc/hosts."
fi

mkdir -p "${SQL_DATA_PATH}"
mkdir -p "${WP_DATA_PATH}"

if $BLANK_START; then
	echo -e "\e[33m--> Building images from scratch...\e[0m"
	sudo docker compose build --no-cache
	sudo docker compose up
else
	sudo docker compose up --build
fi
