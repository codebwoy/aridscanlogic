#!/usr/bin/env bash
# Install Docker Engine + Compose on an Oracle Linux / Ubuntu OCI Always Free VM.
# Run as a user with sudo. Does not open OCI Security List ports (do that in the console).
set -euo pipefail

if [[ "$(id -u)" -eq 0 ]]; then
  echo "Run as a normal user with sudo, not as root." >&2
  exit 1
fi

if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  echo "Docker and Compose already installed."
  docker --version
  docker compose version
  exit 0
fi

if [[ -f /etc/os-release ]]; then
  # shellcheck source=/dev/null
  . /etc/os-release
else
  echo "Cannot detect OS." >&2
  exit 1
fi

echo "Installing Docker for ${ID:-unknown}..."

if [[ "${ID}" == "ubuntu" || "${ID}" == "debian" ]]; then
  sudo apt-get update -y
  sudo apt-get install -y ca-certificates curl
  sudo install -m 0755 -d /etc/apt/keyrings
  sudo curl -fsSL https://download.docker.com/linux/${ID}/gpg -o /etc/apt/keyrings/docker.asc
  sudo chmod a+r /etc/apt/keyrings/docker.asc
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/${ID} \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
  sudo apt-get update -y
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
elif [[ "${ID}" == "ol" || "${ID}" == "oracle" ]]; then
  sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo || true
  sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin || \
    sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  sudo systemctl enable --now docker
else
  echo "Unsupported OS ${ID}. Install Docker Engine + Compose plugin manually." >&2
  exit 1
fi

sudo usermod -aG docker "$USER"
echo "Docker installed. Log out and back in (or: newgrp docker), then:"
echo "  cd deploy/oracle && cp .env.example .env && edit .env && docker compose up -d --build"
