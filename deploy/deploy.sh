#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVER="${DEPLOY_HOST:-root@82.112.254.227}"
REMOTE_DIR="${DEPLOY_REMOTE:-/opt/my-accounts}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519}"
SSH_OPTS=(-i "${SSH_KEY}" -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new)

echo "==> Syncing my_accounts to ${SERVER}:${REMOTE_DIR}"
rsync -avz --delete \
  -e "ssh ${SSH_OPTS[*]}" \
  --exclude .git \
  --exclude node_modules \
  --exclude client/node_modules \
  --exclude server/node_modules \
  --exclude client/dist \
  --exclude '*.md' \
  "${ROOT_DIR}/" \
  "${SERVER}:${REMOTE_DIR}/"

echo "==> Building and starting containers on VPS"
ssh "${SSH_OPTS[@]}" "${SERVER}" bash -s <<REMOTE
set -euo pipefail
cd ${REMOTE_DIR}
docker compose -f docker-compose.prod.yml up -d --build
sleep 3
docker compose -f docker-compose.prod.yml ps
curl -sf http://127.0.0.1:7704/api/health && echo
REMOTE

echo ""
echo "Live: http://82.112.254.227:7704/"
echo "Login: admin@business.local / admin123"
