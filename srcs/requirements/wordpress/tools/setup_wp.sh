#!/bin/bash

echo -e "\e[34mSetting up WordPress...\e[0m"

if [ -z "$SQL_DATABASE" ] || \
	[ -z "$SQL_USER" ] || \
	[ -z "$SQL_PASSWORD" ] || \
	[ -z "$DOMAIN_NAME" ] || \
	[ -z "$WP_ADMIN_USER" ] || \
	[ -z "$WP_ADMIN_PASSWORD" ] || \
	[ -z "$WP_ADMIN_EMAIL" ] || \
	[ -z "$WP_USER" ] || \
	[ -z "$WP_USER_EMAIL" ] || \
	[ -z "$WP_USER_PASSWORD" ]; then
	echo -e "\e[31m--> Missing required environment variables.\e[0m"
	exit 1
fi

echo -e "\e[34m--> Establishing connection with the database...\e[0m"

sleep 10

MAX_RETRIES=30
COUNT=0
while [ $COUNT -lt $MAX_RETRIES ]; do
	if mysqladmin ping -h"mariadb" -u"$SQL_USER" -p"$SQL_PASSWORD" --silent; then
		echo -e "\e[32m--> Database connection established!\e[0m"
		break
	fi
	echo -e "\e[33m--> Waiting for the database... Attempt $((COUNT + 1))/$MAX_RETRIES\e[0m"
	sleep 2
	COUNT=$((COUNT + 1))
done

if [ $COUNT -eq $MAX_RETRIES ]; then
	echo -e "\e[31mFailed to connect to the database after $MAX_RETRIES attempts.\e[0m"
	exit 1
fi

if [ ! -f /var/www/html/wp-config.php ]; then
	echo -e "\e[34m--> Downloading WordPress...\e[0m"
	wp core download --version=6.0 --locale=fr_FR --allow-root
	echo -e "\e[32m--> WordPress downloaded successfully\e[0m"
	echo -e "\e[34m--> Creating wp-config.php...\e[0m"
	wp config create --allow-root \
		--dbname="${SQL_DATABASE}" \
		--dbuser="${SQL_USER}" \
		--dbpass="${SQL_PASSWORD}" \
		--dbhost="mariadb:3306" \
		--path="/var/www/html/"
	echo -e "\e[32m--> wp-config.php created successfully\e[0m"
	echo -e "\e[34m--> Installing WordPress...\e[0m"
	wp core install --allow-root \
		--url="${DOMAIN_NAME}" \
		--title="Inception42" \
		--admin_user="${WP_ADMIN_USER}" \
		--admin_password="${WP_ADMIN_PASSWORD}" \
		--admin_email="${WP_ADMIN_EMAIL}" \
		--path="/var/www/html/"
	echo -e "\e[32m--> WordPress installed successfully\e[0m"
	echo -e "\e[34m--> Creating ${WP_USER} WordPress user...\e[0m"
	wp user create "${WP_USER}" "${WP_USER_EMAIL}" \
		--user_pass="${WP_USER_PASSWORD}" \
		--role=author \
		--allow-root \
		--path="/var/www/html/"
	echo -e "\e[32m--> ${WP_USER} user created successfully\e[0m"
else
	echo -e "\e[33m--> WordPress is already installed. No changes made.\e[0m"
fi

mkdir -p /run/php

chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html

echo -e "\e[34m--> Setting up Redis for WordPress...\e[0m"

# for the Redis bonus
wp plugin install redis-cache --activate --allow-root --path="/var/www/html/"
wp config set WP_REDIS_HOST "redis" --allow-root --path="/var/www/html/"
wp redis enable --allow-root --path="/var/www/html/"


echo -e "\e[32m--> Starting PHP-FPM...\e[0m"
sleep 2
exec php-fpm7.4 -F
