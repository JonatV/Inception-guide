#!/bin/bash

echo -e "\e[34mSetting up mariaDB...\e[0m"

service mariadb start

echo -e "\e[34m--> Establishing connection with the database...\e[0m"
MAX_RETRIES=30
COUNT=0
while [ $COUNT -lt $MAX_RETRIES ]; do
	if mysqladmin ping -h"localhost" --silent; then
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

echo -e "\e[34m--> setting up DB and user...\e[0m"

# Use socket authentication or skip grant tables for initial setup / to do
mysql -u root << EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY '${SQL_ROOT_PASSWORD}';
FLUSH PRIVILEGES;
EOF

echo -e "\e[32m--> Root user password updated successfully.\e[0m"

mysql -u root -p"${SQL_ROOT_PASSWORD}" << EOF
CREATE DATABASE IF NOT EXISTS \`${SQL_DATABASE}\`;
CREATE USER IF NOT EXISTS '${SQL_USER}'@'%' IDENTIFIED BY '${SQL_PASSWORD}';
GRANT ALL PRIVILEGES ON \`${SQL_DATABASE}\`.* TO '${SQL_USER}'@'%';
FLUSH PRIVILEGES;
EOF

echo -e "\e[32m--> DB and user creation successful.\e[0m"

echo -e "\e[32m--> Starting MariaDB in foreground...\e[0m"
mysqladmin -u root -p"${SQL_ROOT_PASSWORD}" shutdown
sleep 2
exec mysqld_safe
