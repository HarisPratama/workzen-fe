#!/bin/bash

# Manual deployment script for Workzen Frontend
# Usage: ./deploy.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "=========================================="
echo "Workzen Frontend - Manual Deployment"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the right directory?"
    exit 1
fi

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Pull latest changes
print_status "Pulling latest changes..."
git pull origin main || print_warning "Failed to pull or not a git repository"

# Build Docker image
print_status "Building Docker image..."
docker build -t workzen-fe:latest .

# Stop existing container
print_status "Stopping existing container..."
docker stop workzen-fe-prod 2>/dev/null || true
docker rm workzen-fe-prod 2>/dev/null || true

# Run new container
print_status "Starting new container..."
docker run -d \
    --name workzen-fe-prod \
    --restart unless-stopped \
    -p 3000:3000 \
    -e NODE_ENV=production \
    -e NEXT_PUBLIC_API_URL=https://api.workzen.web.id \
    workzen-fe:latest

# Verify deployment
print_status "Verifying deployment..."
sleep 3

if curl -sf http://localhost:3000 > /dev/null; then
    print_status "✓ Application is running on http://localhost:3000"
else
    print_error "✗ Application is not responding"
    docker logs workzen-fe-prod --tail 50
    exit 1
fi

# Cleanup
print_status "Cleaning up..."
docker image prune -f > /dev/null 2>&1 || true

echo "=========================================="
print_status "Deployment completed successfully!"
echo "=========================================="
echo "Application URL: http://localhost:3000"
echo "Docker Container: workzen-fe-prod"
echo "=========================================="
