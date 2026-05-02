@echo off
REM AgentOS Frontend Start Script for Windows

echo ==================================
echo   AgentOS Frontend Startup
echo ==================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo X Dependencies not installed!
    echo Please run: npm install
    exit /b 1
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo Warning: .env.local not found!
    echo Creating from .env.example...
    copy .env.example .env.local
    echo .env.local created
    echo.
)

REM Start the development server
echo Starting AgentOS Frontend...
echo.
echo Frontend will be available at:
echo   - Local: http://localhost:3000
echo.
echo Press Ctrl+C to stop
echo.

npm run dev
