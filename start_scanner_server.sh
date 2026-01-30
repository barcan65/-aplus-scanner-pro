#!/bin/bash
# A+ Scanner Local Server Launcher
# This starts a simple web server so scanners can access Polygon.io API

echo "========================================"
echo " A+ Scanner Local Server"
echo " ChartScript AI LLC"
echo "========================================"
echo ""
echo "Starting web server on http://localhost:8000"
echo ""
echo "Open your browser and go to:"
echo "  http://localhost:8000/aplus-polygon-scanner.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================"
echo ""

cd "$(dirname "$0")"

# Try Python 3 first, then Python 2
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m http.server 8000
else
    echo "ERROR: Python not found. Please install Python 3."
    exit 1
fi
