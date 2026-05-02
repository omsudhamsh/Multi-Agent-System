#!/bin/bash

# AgentOS Frontend Start Script

echo "=================================="
echo "  AgentOS Frontend Startup"
echo "=================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Dependencies not installed!"
    echo "Please run: npm install"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found!"
    echo "Creating from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created"
    echo ""
fi

# Start the development server
echo "🚀 Starting AgentOS Frontend..."
echo ""
echo "Frontend will be available at:"
echo "  - Local: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm run dev
