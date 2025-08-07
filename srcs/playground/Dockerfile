FROM debian:bullseye

RUN	apt-get update && apt-get upgrade -y && \
	apt-get install -y wget php7.4-fpm php7.4-mysql mariadb-client && \
	rm -rf /var/lib/apt/lists/*
RUN mkdir -p /run/php
RUN sed -i 's/listen = \/run\/php\/php7.4-fpm.sock/listen = 0.0.0.0:9000/' /etc/php/7.4/fpm/pool.d/www.conf
