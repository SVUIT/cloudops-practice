#!/bin/bash
#! set -e cancel when command fail
set -e

echo "Starting services..."
az postgres flexible-server start \
  --name roadmap-maker-southeastasia-psql \
  --resource-group roadmap-maker-southeastasia-rg
