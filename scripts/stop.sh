#!/bin/bash
set -euo pipefail

echo "Stop services..."

# --- PostgreSQL Flexible Server ---
PG_STATE=$(az postgres flexible-server show \
  --name roadmap-maker-southeastasia-psql \
  --resource-group roadmap-maker-southeastasia-rg \
  --query "state" -o tsv)

if [[ "$PG_STATE" == "Ready" ]]; then
  echo "Stopping PostgreSQL Flexible Server..."
  az postgres flexible-server stop \
    --name roadmap-maker-southeastasia-psql \
    --resource-group roadmap-maker-southeastasia-rg &
else
  echo "PostgreSQL Flexible Server is not in 'Ready' state (current: $PG_STATE), skipping stop."
fi

# --- AKS Cluster ---
AKS_STATE=$(az aks show \
  --name roadmap-maker-primary-aks \
  --resource-group roadmap-maker-southeastasia-rg \
  --query "powerState.code" -o tsv)

if [[ "$AKS_STATE" == "Running" ]]; then
  echo "Stopping AKS cluster..."
  az aks stop \
    --resource-group roadmap-maker-southeastasia-rg \
    --name roadmap-maker-primary-aks &
else
  echo "AKS cluster is not running (current: $AKS_STATE), skipping stop."
fi

wait
echo "All stop operations completed"