NAME = inception


.PHONY: up

up:
	@cd srcs && ./run_docker.sh

re:
	@cd srcs && ./run_docker.sh

down:
	@cd srcs && sudo docker compose down

ps:
	@cd srcs && sudo docker compose ps

clean:
	@cd srcs && sudo ./run_docker.sh --clean

blank-start:
	@cd srcs && sudo ./run_docker.sh --blank-start
