# note
# Gnupg :
	# node use gpg to ensure the package is secure.
	# So we need to install gnupg because it is used to verify the NodeSource repository. 
# redis-commander:
	# --redis-host: is our redis service (defined in docker-compose.yml).
	# --redis-port: where Redis instance is running. That's how connection is established.
	# --port: port on which Redis-commander runs.
# -fsL :
	# -f: fail silently on server errors.
	# -s: silent mode
	# -L: follow redirects (if url is redirected)
FROM debian:bullseye

RUN apt-get update && \
    apt-get install -y \
    curl \
    gnupg \
    && curl -fsL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g redis-commander

EXPOSE 8082

CMD ["redis-commander", "--redis-host", "redis", "--redis-port", "6379", "--port", "8082"]
