FROM debian:bullseye

RUN apt-get update && \
	apt-get install -y nginx && \
	rm -rf /var/lib/apt/lists/*

RUN rm -rf /var/www/html/*
RUN rm /etc/nginx/sites-enabled/default

COPY site/ /var/www/html/
COPY conf/nginx.conf /etc/nginx/sites-enabled/static-site

RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

EXPOSE 8083

CMD ["nginx", "-g", "daemon off;"]
