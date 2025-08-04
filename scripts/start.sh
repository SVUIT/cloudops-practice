#!/bin/bash
set -euo pipefail

echo "Starting services if they are stopped..."

# --- PostgreSQL Flexible Server ---
PG_STATE=$(az postgres flexible-server show \
  --name roadmap-maker-southeastasia-psql \
  --resource-group roadmap-maker-southeastasia-rg \
  --query "state" -o tsv)

if [[ "$PG_STATE" == "Stopped" ]]; then
  echo "Starting PostgreSQL Flexible Server..."
  az postgres flexible-server start \
    --name roadmap-maker-southeastasia-psql \
    --resource-group roadmap-maker-southeastasia-rg &
else
  echo "PostgreSQL Flexible Server is not in 'Stopped' state (current: $PG_STATE), skipping start."
fi

# --- AKS Cluster ---
AKS_STATE=$(az aks show \
  --name roadmap-maker-primary-aks \
  --resource-group roadmap-maker-southeastasia-rg \
  --query "powerState.code" -o tsv)

if [[ "$AKS_STATE" == "Stopped" ]]; then
  echo "Starting AKS cluster..."
  az aks start \
    --name roadmap-maker-primary-aks \
    --resource-group roadmap-maker-southeastasia-rg &
else
  echo "AKS cluster is not in 'Stopped' state (current: $AKS_STATE), skipping start."
fi

wait
echo "All start operations completed."
