#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_help() {
    echo -e "${GREEN}=== Inception Project Evaluation VM Manager ===${NC}"
    echo ""
    echo -e "${YELLOW}Usage:${NC}"
    echo "  $0 start    - Start the evaluation VM"
    echo "  $0 stop     - Stop the evaluation VM"
    echo "  $0 connect  - Connect to running VM"
    echo "  $0 status   - Show VM status"
    echo "  $0 clean    - Remove VM and rebuild"
    echo "  $0 logs     - Show VM logs"
    echo ""
    echo -e "${BLUE}What this VM provides:${NC}"
    echo "- Full root access (sudo without password)"
    echo "- Docker and Docker Compose installed"
    echo "- Git for cloning your project"
    echo "- Ability to modify /etc/hosts"
    echo "- Isolated environment for evaluation"
}

start_vm() {
    echo -e "${GREEN}Starting Inception Evaluation VM...${NC}"
    docker-compose up -d --build
    echo -e "${GREEN}VM started successfully!${NC}"
    echo -e "${YELLOW}Connect with: $0 connect${NC}"
}

stop_vm() {
    echo -e "${YELLOW}Stopping Inception Evaluation VM...${NC}"
    docker-compose down
    echo -e "${GREEN}VM stopped.${NC}"
}

connect_vm() {
    echo -e "${BLUE}Connecting to Inception Evaluation VM...${NC}"
    docker exec -it inception-evaluation-vm /bin/bash
}

status_vm() {
    echo -e "${BLUE}=== VM Status ===${NC}"
    docker-compose ps
    echo ""
    echo -e "${BLUE}=== Container Info ===${NC}"
    if docker ps | grep -q inception-evaluation-vm; then
        docker exec inception-evaluation-vm whoami 2>/dev/null && echo -e "${GREEN}VM is running and accessible${NC}" || echo -e "${YELLOW}VM is starting...${NC}"
    else
        echo -e "${RED}VM is not running${NC}"
    fi
}

clean_vm() {
    echo -e "${YELLOW}Cleaning and rebuilding VM...${NC}"
    docker-compose down -v
    docker-compose build --no-cache
    echo -e "${GREEN}VM cleaned and ready to start.${NC}"
}

logs_vm() {
    echo -e "${BLUE}=== VM Logs ===${NC}"
    docker-compose logs -f
}

case "$1" in
    start)
        start_vm
        ;;
    stop)
        stop_vm
        ;;
    connect)
        connect_vm
        ;;
    status)
        status_vm
        ;;
    clean)
        clean_vm
        ;;
    logs)
        logs_vm
        ;;
    *)
        print_help
        ;;
esac
