#!/bin/bash
# ==============================================================================
# 🌐 FREE PUBLIC CLOUD TUNNEL (NO CREDIT CARD NEEDED)
# Generates a free, secure public HTTPS URL for university evaluation
# ==============================================================================

echo "======================================================================"
echo "⚡ Starting Free Public Cloud Tunnel for Student Project System..."
echo "======================================================================"

# Ensure server is running locally on port 3001
if ! nc -z localhost 3001 2>/dev/null; then
    echo "Starting local server in background..."
    PORT=3001 node server.js &
    sleep 2
fi

echo "Connecting to free public cloud edge..."
echo "Share the generated HTTPS URL with your professor/evaluator!"
echo "======================================================================"

# Run free untun / cloudflared tunnel
npx --yes untun@latest tunnel http://localhost:3001
