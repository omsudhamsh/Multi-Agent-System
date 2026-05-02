# AgentOS Backend - Setup Guide

Complete setup instructions for the AgentOS Backend.

## Quick Start (5 minutes)

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)

### 2. Install Python

Make sure you have Python 3.10 or higher:

```bash
python --version
```

If not installed, download from [python.org](https://www.python.org/downloads/)

### 3. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

### 4. Configure Environment

Edit `.env` file and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
HOST=0.0.0.0
PORT=8000
DEBUG=True
CORS_ORIGINS=http://localhost:3000
```

### 5. Run the Backend

```bash
python -m app.main
```

You should see:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 6. Test the Backend

Open your browser and visit:
- http://localhost:8000 - Root endpoint
- http://localhost:8000/docs - API documentation
- http://localhost:8000/health - Health check

## Detailed Setup

### Virtual Environment

A virtual environment isolates your Python dependencies:

**Create:**
```bash
python -m venv venv
```

**Activate:**
- Windows (CMD): `venv\Scripts\activate.bat`
- Windows (PowerShell): `venv\Scripts\Activate.ps1`
- macOS/Linux: `source venv/bin/activate`

**Deactivate:**
```bash
deactivate
```

### Dependencies

Install all required packages:

```bash
pip install -r requirements.txt
```

**Core dependencies:**
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `pydantic` - Data validation
- `google-generativeai` - Gemini API client
- `python-dotenv` - Environment variables

### Environment Variables

Copy the example file:
```bash
cp .env.example .env
```

**Required variables:**
- `GEMINI_API_KEY` - Your Gemini API key (required)

**Optional variables:**
- `GEMINI_MODEL` - Model to use (default: gemini-2.0-flash-exp)
- `HOST` - Server host (default: 0.0.0.0)
- `PORT` - Server port (default: 8000)
- `DEBUG` - Debug mode (default: True)
- `CORS_ORIGINS` - Allowed origins (default: http://localhost:3000)
- `MEMORY_ENABLED` - Enable memory (default: True)
- `MAX_MEMORY_ITEMS` - Max memory entries (default: 100)
- `LOG_LEVEL` - Logging level (default: INFO)

## Running the Backend

### Development Mode

With auto-reload on code changes:

```bash
python -m app.main
```

Or:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode

With multiple workers:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Custom Port

```bash
uvicorn app.main:app --port 8080
```

## Testing the API

### Using cURL

**Health check:**
```bash
curl http://localhost:8000/health
```

**Create a task:**
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a simple calculator function"}'
```

**Get all agents:**
```bash
curl http://localhost:8000/api/agents
```

**Get all tasks:**
```bash
curl http://localhost:8000/api/tasks
```

### Using Python

```python
import requests

# Create a task
response = requests.post(
    "http://localhost:8000/api/tasks",
    json={"prompt": "Build a login page"}
)
task = response.json()
print(f"Task created: {task['id']}")

# Get task status
response = requests.get(f"http://localhost:8000/api/tasks/{task['id']}")
print(response.json())
```

### Using the API Docs

Visit http://localhost:8000/docs for interactive API documentation where you can test all endpoints.

## Connecting to Frontend

### Update Frontend API URL

In your Next.js frontend, create or update the API configuration:

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function createTask(prompt: string) {
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  return response.json();
}
```

### Update CORS Settings

If your frontend runs on a different port, update `.env`:

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Troubleshooting

### "No module named 'app'"

Make sure you're running from the `backend/` directory and the virtual environment is activated.

### "GEMINI_API_KEY not found"

1. Check `.env` file exists in `backend/` directory
2. Verify the API key is set correctly
3. Restart the server after changing `.env`

### "Address already in use"

Port 8000 is already taken. Either:
- Stop the other process using port 8000
- Use a different port: `uvicorn app.main:app --port 8080`

### CORS Errors

Add your frontend URL to `CORS_ORIGINS` in `.env`:
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Import Errors

Reinstall dependencies:
```bash
pip install --upgrade -r requirements.txt
```

### Gemini API Errors

1. Verify your API key is valid
2. Check you have API quota remaining
3. Ensure you're using a supported model

## Development Tips

### Hot Reload

Use `--reload` flag for automatic restart on code changes:
```bash
uvicorn app.main:app --reload
```

### Debug Logging

Set log level to DEBUG in `.env`:
```env
LOG_LEVEL=DEBUG
```

### Testing Agents

Test individual agents:

```python
from app.services.gemini import GeminiService
from app.agents.planner import PlannerAgent

gemini = GeminiService()
planner = PlannerAgent(gemini)

result = await planner.execute({
    "prompt": "Build a todo app"
})
print(result)
```

## Next Steps

1. ✅ Backend is running
2. Connect your frontend to the API
3. Test task creation and execution
4. Monitor logs and agent activity
5. Add custom plugins as needed

## Support

- Check the main [README.md](README.md) for architecture details
- Visit http://localhost:8000/docs for API documentation
- Review logs for error messages

## Common Commands

```bash
# Activate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run development server
python -m app.main

# Run with custom settings
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload

# Check Python version
python --version

# List installed packages
pip list

# Deactivate virtual environment
deactivate
```
