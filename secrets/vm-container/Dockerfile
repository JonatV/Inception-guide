# VM-like Docker container for inception project evaluation
FROM ubuntu:22.04

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Paris

# Install essential packages
RUN apt-get update && apt-get install -y \
    docker.io \
    docker-compose \
    git \
    sudo \
    vim \
    nano \
    curl \
    wget \
    make \
    build-essential \
    openssl \
    ca-certificates \
    gnupg \
    lsb-release \
    systemd \
    systemd-sysv \
    net-tools \
    iproute2 \
    iputils-ping \
    tree \
    htop \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create a user with sudo privileges (you can be root-like)
RUN useradd -m -s /bin/bash evaluator \
    && echo "evaluator:password" | chpasswd \
    && usermod -aG sudo,docker evaluator \
    && echo "evaluator ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Enable Docker in Docker (DinD)
RUN systemctl enable docker || true

# Create workspace directory
RUN mkdir -p /home/evaluator/inception_project

# Switch to evaluator user
USER evaluator
WORKDIR /home/evaluator

# Create a startup script
RUN echo '#!/bin/bash\n\
echo "=== Welcome to Inception Project Evaluation Environment ==="\n\
echo "You have full root access via sudo (no password required)"\n\
echo "Docker is available and ready to use"\n\
echo ""\n\
echo "To get started:"\n\
echo "1. Clone your project: git clone <your-repo-url> inception_project"\n\
echo "2. cd inception_project/srcs"\n\
echo "3. Create .env file with your configuration"\n\
echo "4. Run: sudo ./run_docker.sh"\n\
echo ""\n\
echo "Current user: $(whoami)"\n\
echo "Docker status: $(sudo service docker status | head -1)"\n\
echo "Available commands: docker, docker-compose, git, sudo, vim, nano"\n\
echo "================================================================"\n\
/bin/bash' > /home/evaluator/welcome.sh && chmod +x /home/evaluator/welcome.sh

# Set up Docker daemon start
USER root
RUN echo '#!/bin/bash\n\
# Start Docker daemon\n\
sudo service docker start\n\
# Run the welcome script\n\
/home/evaluator/welcome.sh' > /startup.sh && chmod +x /startup.sh

USER evaluator
WORKDIR /home/evaluator

# Expose the port your NGINX will use
EXPOSE 443

CMD ["/startup.sh"]
