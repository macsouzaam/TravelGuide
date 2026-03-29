#!/usr/bin/env bash
set -euo pipefail

ACCOUNT_ID="596055752742"
REGION="us-east-1"
REPO="travelguide"
IMAGE_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO}:latest"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR/../infra/terraform-ec2"

if ! command -v terraform >/dev/null 2>&1; then
  echo "✖ terraform não encontrado no PATH"
  exit 1
fi

INSTANCE_ID="$(cd "$TERRAFORM_DIR" && terraform output -raw instance_id 2>/dev/null || true)"
APP_URL="$(cd "$TERRAFORM_DIR" && terraform output -raw app_url 2>/dev/null || true)"

if [[ -z "$INSTANCE_ID" ]]; then
  echo "✖ Não foi possível obter instance_id via terraform output"
  echo "  Verifique se o Terraform já foi aplicado em: $TERRAFORM_DIR"
  exit 1
fi

if [[ -z "$APP_URL" ]]; then
  echo "✖ Não foi possível obter app_url via terraform output"
  echo "  Verifique se o output app_url existe no Terraform"
  exit 1
fi

# 1) Build e push
echo "════════════════════════════════════"
echo " Build & Push"
echo "════════════════════════════════════"
"$SCRIPT_DIR/build-and-push.sh"

# 2) Pull + restart via SSM
echo ""
echo "════════════════════════════════════"
echo " Deploy via SSM (sem Terraform)"
echo "════════════════════════════════════"

COMMAND_ID=$(aws ssm send-command \
  --region "$REGION" \
  --instance-ids "$INSTANCE_ID" \
  --document-name "AWS-RunShellScript" \
  --parameters "commands=[
    \"aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com\",
    \"docker pull ${IMAGE_URI}\",
    \"docker stop travelguide || true\",
    \"docker rm travelguide || true\",
    \"docker run -d --name travelguide --restart unless-stopped --env-file /etc/travelguide.env -p 80:3000 ${IMAGE_URI}\"
  ]" \
  --output text \
  --query "Command.CommandId")

echo "SSM Command ID: $COMMAND_ID"
echo "Aguardando execução..."

aws ssm wait command-executed \
  --region "$REGION" \
  --command-id "$COMMAND_ID" \
  --instance-id "$INSTANCE_ID" 2>/dev/null || true

STATUS=$(aws ssm get-command-invocation \
  --region "$REGION" \
  --command-id "$COMMAND_ID" \
  --instance-id "$INSTANCE_ID" \
  --query "Status" --output text)

echo "Status SSM: $STATUS"

if [[ "$STATUS" == "Success" ]]; then
  echo ""
  echo "✔ Deploy concluído!"
  echo "  URL: $APP_URL"
  echo ""
  echo "▶ Verificando saúde..."
  sleep 5
  curl -sf -o /dev/null -w "HTTP %{http_code}\n" "$APP_URL" || echo "App ainda iniciando, aguarde ~30s"
else
  echo "✖ SSM retornou: $STATUS"
  aws ssm get-command-invocation \
    --region "$REGION" \
    --command-id "$COMMAND_ID" \
    --instance-id "$INSTANCE_ID" \
    --query "StandardErrorContent" --output text
  exit 1
fi
