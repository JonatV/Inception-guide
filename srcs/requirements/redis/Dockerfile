FROM debian:bullseye

# Install necessary packages
RUN apt-get update && \
	apt-get install -y \
	redis

ENTRYPOINT ["redis-server", "--protected-mode", "no"]
