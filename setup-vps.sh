#!/bin/bash

# VPS Setup Script for Workzen Frontend
# Run this on the VPS to set up the environment

set -e

echo "=========================================="
echo "Setting up Workzen Frontend on VPS"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_status "Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
else
    print_status "Docker is already installed"
fi

# 2. Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_status "Docker Compose not found. Installing..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    print_status "Docker Compose is already installed"
fi

# 3. Create Docker network
print_status "Creating Docker network..."
docker network create workzen-network 2>/dev/null || print_warning "Network already exists"

# 4. Install nginx if not present
if ! command -v nginx &> /dev/null; then
    print_status "Installing nginx..."
    if command -v apt &> /dev/null; then
        apt update && apt install -y nginx
    elif command -v yum &> /dev/null; then
        yum install -y nginx
    fi
    systemctl enable nginx
    systemctl start nginx
else
    print_status "nginx is already installed"
fi

# 5. Install Certbot for SSL
if ! command -v certbot &> /dev/null; then
    print_status "Installing Certbot..."
    if command -v apt &> /dev/null; then
        apt install -y certbot python3-certbot-nginx
    elif command -v yum &> /dev/null; then
        yum install -y certbot python3-certbot-nginx
    fi
else
    print_status "Certbot is already installed"
fi

# 6. Setup SSH key for GitHub Actions if not exists
if [ ! -f ~/.ssh/id_ed25519 ]; then
    print_status "Generating SSH key for GitHub Actions..."
    ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/id_ed25519 -N ""
    cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
fi

print_status "SSH public key for GitHub Actions:"
cat ~/.ssh/id_ed25519.pub

print_status "SSH private key (save this to GitHub Secrets as VPS_SSH_KEY):"
echo "=========================================="
cat ~/.ssh/id_ed25519
echo "=========================================="

# 7. Create deployment directory
mkdir -p /root/.openclaw/workspace/workzen-fe

print_status "=========================================="
print_status "Setup completed!"
print_status "=========================================="
print_status "Next steps:"
print_status "1. Copy the SSH private key above to GitHub Secrets as VPS_SSH_KEY"
print_status "2. Add VPS_HOST, VPS_USER, and GITHUB_TOKEN to GitHub Secrets"
print_status "3. Run the SSL setup script: ./setup-ssl.sh"
print_status "=========================================="
