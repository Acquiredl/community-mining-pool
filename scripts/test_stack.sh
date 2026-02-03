#!/bin/bash

echo "========================================"
echo "      MINING POOL STACK DIAGNOSTIC      "
echo "========================================"

# Function to test a port/service
check_service() {
    local service_name=$1
    local url=$2
    local payload=$3
    
    echo -n "Testing $service_name... "

    if [ -z "$payload" ]; then
        # Simple GET request
        response=$(curl --write-out %{http_code} --silent --output /dev/null "$url")
    else
        # JSON POST request (for RPCs)
        response=$(curl --write-out %{http_code} --silent --output /dev/null -X POST "$url" -d "$payload")
    fi

    if [ "$response" -eq 200 ]; then
        echo -e "\e[32mPASS\e[0m (HTTP 200)"
    else
        echo -e "\e[31mFAIL\e[0m (HTTP $response)"
    fi
}

# 1. Test MiningCore API (The "Brain")
check_service "MiningCore API" "http://127.0.0.1:4000/api/pools"

# 2. Test Monero Node (The "Heart")
# We ask for 'get_info' to prove it's actually responding, not just open.
check_service "Monero Node" "http://127.0.0.1:18081/json_rpc" '{"jsonrpc":"2.0","id":"0","method":"get_info"}'

# 3. Test Monero Wallet (The "Bank")
# We ask for 'get_version' to prove RPC authentication is working (or disabled).
check_service "Monero Wallet" "http://127.0.0.1:18083/json_rpc" '{"jsonrpc":"2.0","id":"0","method":"get_version"}'

# 4. Test Mining Port (The "Entrance")
echo -n "Testing Stratum Port (3333)... "
# Timeout after 1 second to avoid hanging
if timeout 1s bash -c '</dev/tcp/127.0.0.1/3333' &>/dev/null; then
    echo -e "\e[32mPASS\e[0m (Port Open)"
else
    echo -e "\e[31mFAIL\e[0m (Connection Refused)"
fi

echo "========================================"
echo "Diagnostic Complete."