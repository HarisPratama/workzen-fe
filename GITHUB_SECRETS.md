# GitHub Secrets Configuration

The following secrets need to be configured in the GitHub repository:

## Required Secrets

Go to: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### 1. VPS_HOST
- **Name:** `VPS_HOST`
- **Value:** IP address or hostname of your VPS (e.g., `VM-9-164-opencloudos` or IP)

### 2. VPS_USER
- **Name:** `VPS_USER`
- **Value:** `root` (or the user with SSH access)

### 3. VPS_SSH_KEY
- **Name:** `VPS_SSH_KEY`
- **Value:** Private SSH key content (the entire content of `~/.ssh/id_rsa` or similar)
  - To get the key: `cat ~/.ssh/id_rsa` on the VPS
  - Copy the entire output including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`

### 4. GITHUB_TOKEN
- **Name:** `GITHUB_TOKEN`
- **Note:** This is automatically provided by GitHub Actions, no need to create manually

## Setting up SSH Key on VPS

If you don't have an SSH key set up yet:

```bash
# Generate SSH key (if not exists)
ssh-keygen -t ed25519 -C "github-actions"

# Add to authorized_keys
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys

# Get private key for GitHub secret
cat ~/.ssh/id_ed25519
```

## Verifying Setup

After adding all secrets:
1. Push any change to the main branch
2. Go to `Actions` tab in GitHub
3. Check if the workflow runs successfully
