# Deployment Guide for Workzen Frontend

This document outlines the complete deployment setup for the Workzen Frontend application.

## Architecture Overview

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   GitHub        │─────▶│   GitHub        │─────▶│   VPS (Docker)  │
│   Repository    │      │   Actions       │      │   + Nginx       │
└─────────────────┘      └─────────────────┘      └─────────────────┘
                                                            │
                                                            ▼
                                                    ┌─────────────────┐
                                                    │   workzen.web.id│
                                                    └─────────────────┘
```

## Components

### 1. GitHub Actions Workflow (`.github/workflows/deploy.yml`)

- **Triggers**: Push to main/master branch or manual dispatch
- **Steps**:
  1. Checkout code
  2. Set up Docker Buildx
  3. Login to GitHub Container Registry (ghcr.io)
  4. Build and push Docker image
  5. Deploy to VPS via SSH

### 2. Docker Configuration

**Dockerfile**:
- Multi-stage build for optimization
- Builder stage: Install dependencies and build
- Production stage: Run with minimal files
- Non-root user for security

**docker-compose.prod.yml**:
- Production configuration
- External network for communication with other services
- Environment variables for API URL

### 3. Nginx Configuration

**nginx/workzen.conf**:
- HTTP to HTTPS redirect
- SSL/TLS configuration with Let's Encrypt
- Gzip compression
- Proxy to Next.js app
- Security headers
- Static file caching

## Initial VPS Setup

### Step 1: Run VPS Setup Script

```bash
cd /root/.openclaw/workspace/workzen-fe
chmod +x setup-vps.sh
./setup-vps.sh
```

This will:
- Install Docker and Docker Compose
- Install Nginx
- Install Certbot
- Create Docker network
- Generate SSH key for GitHub Actions

### Step 2: Configure GitHub Secrets

Add the following secrets to your GitHub repository:

| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `VPS_HOST` | Your VPS IP or hostname | `echo $(hostname -I)` |
| `VPS_USER` | `root` | - |
| `VPS_SSH_KEY` | Private SSH key | `cat ~/.ssh/id_ed25519` |
| `GITHUB_TOKEN` | Auto-generated | - |

### Step 3: Setup SSL Certificate

```bash
cd /root/.openclaw/workspace/workzen-fe
chmod +x setup-ssl.sh
./setup-ssl.sh
```

This will:
- Configure Nginx with SSL
- Obtain Let's Encrypt certificate
- Setup auto-renewal

## Deployment Process

### Automatic Deployment

1. Push code to `main` branch
2. GitHub Actions triggers automatically
3. Docker image is built and pushed to ghcr.io
4. VPS pulls the image and restarts containers
5. Nginx serves the updated application

### Manual Deployment

```bash
# On VPS
cd /root/.openclaw/workspace/workzen-fe
git pull origin main
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## Monitoring & Troubleshooting

### View Logs

```bash
# GitHub Actions logs
# Check in GitHub repository → Actions tab

# Docker logs
docker logs -f workzen-fe

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Common Issues

**1. SSH Connection Failed**
```bash
# Test SSH connection from GitHub Actions
cat ~/.ssh/authorized_keys  # Verify key is added
```

**2. Docker Login Failed**
```bash
# Test GitHub Container Registry login
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_ACTOR --password-stdin
```

**3. SSL Certificate Issues**
```bash
# Renew certificate manually
certbot renew --force-renewal
systemctl reload nginx
```

## Security Considerations

1. **SSH Key**: Use dedicated SSH key for GitHub Actions
2. **Docker**: Run containers as non-root user
3. **Secrets**: Never commit secrets to repository
4. **SSL**: Always use HTTPS in production
5. **Updates**: Regularly update base images and dependencies

## Maintenance

### Weekly
- Review GitHub Actions logs
- Check disk usage: `df -h`
- Monitor container health: `docker ps`

### Monthly
- Update Docker images
- Review and rotate SSH keys
- Check SSL certificate expiry

### Quarterly
- Security audit
- Update dependencies
- Review access logs

---

For questions or issues, check the logs first and refer to the troubleshooting section above.
