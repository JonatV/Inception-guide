# note:
	# the second curl is used to download a better theme for Adminer.
	# to connect : mariadb, jveirman, 123, wordpress
FROM debian:bullseye
RUN apt-get update && \
	apt-get install -y \
	curl \
	php7.4 \
	php7.4-mysqli

RUN mkdir -p /var/www/html
RUN curl -L -o /var/www/html/index.php https://github.com/vrana/adminer/releases/download/v5.3.0/adminer-5.3.0.php
RUN curl -L -o /var/www/html/adminer.css https://raw.githubusercontent.com/Niyko/Hydra-Dark-Theme-for-Adminer/master/adminer.css

EXPOSE 8080

CMD ["php", "-S", "0.0.0.0:8080", "-t", "/var/www/html"]
