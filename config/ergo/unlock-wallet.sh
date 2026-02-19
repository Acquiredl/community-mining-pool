#!/bin/sh
echo "Waiting for Ergo node to be ready..."
until curl -sf http://localhost:9053/info > /dev/null 2>&1; do
  sleep 5
done

echo "Ergo node is up. Unlocking wallet..."
curl -X POST "http://localhost:9053/wallet/unlock" \
  -H "Content-Type: application/json" \
  -H "api_key: ergo_pool_api_key_2026" \
  -d '{"pass": "ergo_wallet_password"}'

echo "Wallet unlock complete."