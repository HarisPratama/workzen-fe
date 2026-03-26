#!/bin/bash

# SSL Certificate Setup Script for Workzen
# This script sets up Let's Encrypt SSL certificates

set -e

echo "=========================================="
echo "Setting up SSL for Workzen"
echo "=========================================="

# Colors
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

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root or with sudo"
    exit 1
fi

# Copy nginx configuration
print_status "Setting up nginx configuration..."

# Create nginx config for workzen
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

cat > /etc/nginx/sites-available/workzen.conf << 'EOF'
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name workzen.web.id www.workzen.web.id;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    server_name workzen.web.id www.workzen.web.id;

    # SSL certificates (will be updated by certbot)
    ssl_certificate /etc/letsencrypt/live/workzen.web.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/workzen.web.id/privkey.pem;
    
    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # Proxy to Next.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Handle Next.js static files with caching
    location /_next/static {
        proxy_pass http://localhost:3000/_next/static;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/workzen.conf /etc/nginx/sites-enabled/workzen.conf

# Remove default site if exists
rm -f /etc/nginx/sites-enabled/default

# Create certbot webroot
mkdir -p /var/www/certbot

print_status "Testing nginx configuration..."
nginx -t

# Test certificate issuance (staging first to avoid rate limits)
print_status "Testing SSL certificate issuance (staging)..."

certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --staging \
    -d workzen.web.id \
    -d www.workzen.web.id \
    --agree-tos \
    --non-interactive \
    --email admin@workzen.web.id || print_warning "Staging test failed or already exists"

# Get real certificate
print_status "Obtaining real SSL certificate..."

certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    -d workzen.web.id \
    -d www.workzen.web.id \
    --agree-tos \
    --non-interactive \
    --email admin@workzen.web.id

print_status "Reloading nginx..."
systemctl reload nginx

# Set up auto-renewal
print_status "Setting up auto-renewal..."

# Create renewal hook to reload nginx
cat > /etc/letsencrypt/renewal-hooks/deploy/nginx-reload.sh << 'EOF'
#!/bin/bash
systemctl reload nginx
EOF

chmod +x /etc/letsencrypt/renewal-hooks/deploy/nginx-reload.sh

# Test renewal
certbot renew --dry-run

print_status "=========================================="
print_status "SSL Setup completed!"
print_status "=========================================="
print_status "Domain: workzen.web.id"
print_status "SSL: Enabled with Let's Encrypt"
print_status "Auto-renewal: Enabled"
print_status "=========================================="
