#!/bin/bash
# Kemcrypt Password Generator - Unix/Mac Quick Start Script
# Run this script to start the development server: ./start.sh

echo ""
echo "============================================================"
echo "   Kemcrypt Password Generator - Development Server"
echo "============================================================"
echo ""

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ [ERROR] Python 3 is not installed"
    echo ""
    echo "Please install Python 3:"
    echo "  macOS: brew install python3"
    echo "  Linux: sudo apt-get install python3"
    echo ""
    exit 1
fi

echo "✅ Python 3 detected: $(python3 --version)"
echo ""
echo "Starting development server..."
echo ""

# Start the Python server
python3 dev-server.py
