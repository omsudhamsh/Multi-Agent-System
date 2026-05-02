@echo off
REM AgentOS Backend Setup Script for Windows

echo ==================================
echo   AgentOS Backend Setup
echo ==================================
echo.

REM Check Python version
echo Checking Python version...
python --version 2>nul
if errorlevel 1 (
    echo X Python is not installed or not in PATH
    echo Please install Python 3.10 or higher from python.org
    exit /b 1
)

echo Python found
echo.

REM Create virtual environment
if exist "venv\" (
    echo Virtual environment already exists
    set /p recreate="Do you want to recreate it? (y/N): "
    if /i "%recreate%"=="y" (
        echo Removing old virtual environment...
        rmdir /s /q venv
    ) else (
        echo Skipping virtual environment creation
        goto :skip_venv
    )
)

echo Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo X Failed to create virtual environment
    exit /b 1
)
echo Virtual environment created
:skip_venv

echo.

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

if errorlevel 1 (
    echo X Failed to install dependencies
    exit /b 1
)

echo Dependencies installed successfully
echo.

REM Setup .env file
if exist ".env" (
    echo .env file already exists
) else (
    echo Creating .env file...
    copy .env.example .env
    echo .env file created
    echo.
    echo IMPORTANT: Edit .env and add your GEMINI_API_KEY
    echo Get your API key from: https://makersuite.google.com/app/apikey
)

echo.
echo ==================================
echo   Setup Complete!
echo ==================================
echo.
echo Next steps:
echo 1. Edit .env and add your GEMINI_API_KEY
echo 2. Run: start.bat
echo.
echo Or manually:
echo 1. venv\Scripts\activate
echo 2. python -m app.main
echo.

pause
