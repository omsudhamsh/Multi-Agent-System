@echo off
REM AgentOS Backend Start Script for Windows

echo ==================================
echo   AgentOS Backend Startup
echo ==================================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo X Virtual environment not found!
    echo Please run setup first:
    echo   python -m venv venv
    echo   venv\Scripts\activate
    echo   pip install -r requirements.txt
    exit /b 1
)

REM Check if .env exists
if not exist ".env" (
    echo X .env file not found!
    echo Please create .env file:
    echo   copy .env.example .env
    echo   REM Then edit .env and add your GEMINI_API_KEY
    exit /b 1
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Start the server
echo Starting AgentOS Backend...
echo.
echo Backend will be available at:
echo   - API: http://localhost:8000
echo   - Docs: http://localhost:8000/docs
echo   - Health: http://localhost:8000/health
echo.
echo Press Ctrl+C to stop
echo.

python -m app.main
