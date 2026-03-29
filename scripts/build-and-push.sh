#!/usr/bin/env bash
set -euo pipefail

ACCOUNT_ID="596055752742"
REGION="us-east-1"
REPO="travelguide"
IMAGE_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO}:latest"

echo "▶ ECR login..."
aws ecr get-login-password --region "$REGION" \
  | docker login --username AWS --password-stdin "${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

echo "▶ Build da imagem..."
docker build --platform linux/amd64 -t "${REPO}:latest" "$(git rev-parse --show-toplevel)"

echo "▶ Tag e push para ECR..."
docker tag "${REPO}:latest" "$IMAGE_URI"
docker push "$IMAGE_URI"

echo "✔ Push concluído: $IMAGE_URI"
