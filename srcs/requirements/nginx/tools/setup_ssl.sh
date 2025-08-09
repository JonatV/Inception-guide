#!/bin/bash
echo -e "\e[34mSetting up NGINX SSL certificates...\e[0m"

if [ -z "$DOMAIN_NAME" ]; then
	echo -e "\e[31m--> Missing required environment variable: DOMAIN_NAME.\e[0m"
	exit 1
fi

mkdir -p /etc/nginx/ssl

if [ ! -f /etc/nginx/ssl/nginx.crt ]; then
	echo -e "\e[34m--> Generating self-signed SSL certificate...\e[0m"
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout /etc/nginx/ssl/nginx.key \
		-out /etc/nginx/ssl/nginx.crt \
		-subj "/C=BE/ST=Brussels/L=Brussels/O=42School/OU=student/CN=${DOMAIN_NAME}" > /dev/null 2>&1
	echo -e "\e[32m--> SSL certificate generated successfully\e[0m"
else
	echo -e "\e[33m--> SSL certificate already exists, skipping\e[0m"
fi

echo -e "\e[32m--> Starting NGINX...\e[0m"

exec nginx -g "daemon off;"
