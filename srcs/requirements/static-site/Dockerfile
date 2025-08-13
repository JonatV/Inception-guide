FROM debian:bullseye

# Install NGINX
RUN apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/*

# Remove default nginx config
RUN rm -rf /var/www/html/*
RUN rm /etc/nginx/sites-enabled/default

# Copy static site files
COPY site/ /var/www/html/
COPY conf/nginx.conf /etc/nginx/sites-enabled/static-site

# Set permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

# Expose port
EXPOSE 8083

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
