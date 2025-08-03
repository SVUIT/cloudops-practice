#!/bin/bash
set -e

echo "Stop services..."
az postgres flexible-server start \
  --name roadmap-maker-southeastasia-psql \
  --resource-group roadmap-maker-southeastasia-rg

az aks stop \
  --resource-group roadmap-maker-southeastasia-rg \
  --name roadmap-maker-primary-aks
