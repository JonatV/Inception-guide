# note:
	# --protected-mode: disables protected mode so that Redis can be accessed form outside the container 
	# It's also installed in the wp dashboard
FROM debian:bullseye

RUN apt-get update && \
	apt-get install -y \
	redis

ENTRYPOINT ["redis-server", "--protected-mode", "no"]
