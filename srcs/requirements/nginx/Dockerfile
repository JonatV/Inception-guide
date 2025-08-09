FROM debian:bullseye

RUN apt-get update && \
	apt-get install nginx openssl -y && \
	rm -rf /var/lib/apt/lists/* && \
	rm -rf /etc/nginx/sites-*/default 

COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY tools/setup_ssl.sh /setup.sh

RUN chmod +x /setup.sh && \
	chmod -R 755 /var/www/html/ && \
	chown -R www-data:www-data /var/www/html

EXPOSE 443

ENTRYPOINT ["bash", "/setup.sh"]
