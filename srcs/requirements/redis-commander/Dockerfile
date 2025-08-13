FROM debian:bullseye

# Install Node.js and npm
RUN apt-get update && \
    apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Redis Commander
RUN npm install -g redis-commander

# Expose port
EXPOSE 8082

# Start Redis Commander
CMD ["redis-commander", "--redis-host", "redis", "--redis-port", "6379", "--port", "8082"]
