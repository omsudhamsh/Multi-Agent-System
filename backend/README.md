# AgentOS Backend

A production-ready Python backend for a Multi-Agent AI System powered by Google Gemini API.

## Overview

AgentOS Backend orchestrates multiple specialized AI agents to collaborate on tasks instead of using a single general-purpose model. Each agent has a specific responsibility:

- **Planner Agent**: Breaks user requests into actionable steps
- **Research Agent**: Gathers relevant information and best practices
- **Developer Agent**: Writes or improves code
- **Tester Agent**: Validates logic, checks for errors and edge cases
- **Reviewer Agent**: Summarizes results and provides final validation
- **Memory Agent**: Stores context and task history
- **Tool Agent**: Connects external tools and plugins

## Architecture

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── api/                 # API routes and endpoints
│   │   ├── routes/          # Route modules (tasks, agents, plugins, logs)
│   │   └── dependencies.py  # Dependency injection
│   ├── agents/              # Agent implementations
│   │   ├── base.py          # Base agent class
│   │   ├── planner.py       # Planner agent
│   │   ├── developer.py     # Developer agent
│   │   ├── researcher.py    # Researcher agent
│   │   ├── tester.py        # Tester agent
│   │   ├── reviewer.py      # Reviewer agent
│   │   ├── memory.py        # Memory agent
│   │   └── tools.py         # Tool agent
│   ├── core/                # Core configuration
│   │   ├── config.py        # Settings and environment variables
│   │   └── logging.py       # Logging configuration
│   ├── memory/              # Memory storage
│   │   └── store.py         # In-memory storage implementation
│   ├── schemas/             # Pydantic models
│   │   ├── agent.py         # Agent schemas
│   │   ├── task.py          # Task schemas
│   │   ├── plugin.py        # Plugin schemas
│   │   ├── log.py           # Log schemas
│   │   └── settings.py      # Settings schemas
│   ├── services/            # Business logic services
│   │   ├── gemini.py        # Gemini API integration
│   │   ├── task_manager.py  # Task lifecycle management
│   │   ├── task_executor.py # Multi-agent orchestration
│   │   ├── plugin_manager.py# Plugin management
│   │   └── log_service.py   # Logging service
│   ├── tools/               # Tool/plugin system
│   │   └── registry.py      # Tool registry
│   └── utils/               # Utility functions
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── requirements.txt         # Python dependencies
└── README.md                # This file
```

## Features

- ✅ **Multi-Agent Orchestration**: Specialized agents work together on complex tasks
- ✅ **Gemini Integration**: Powered by Google's Gemini API
- ✅ **RESTful API**: Clean, well-documented endpoints
- ✅ **Real-time Updates**: Server-Sent Events for task streaming
- ✅ **Plugin System**: Extensible tool/plugin architecture
- ✅ **Memory Management**: Context storage and retrieval
- ✅ **Comprehensive Logging**: Detailed logs and timeline events
- ✅ **CORS Support**: Ready for frontend integration
- ✅ **Type Safety**: Full Pydantic validation
- ✅ **Production Ready**: Proper error handling and logging

## Prerequisites

- Python 3.10 or higher
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## Installation

1. **Clone the repository** (if not already done)

2. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

3. **Create virtual environment**:
   ```bash
   python -m venv venv
   ```

4. **Activate virtual environment**:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

5. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

6. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## Running the Backend

### Development Mode

```bash
python -m app.main
```

Or using uvicorn directly:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will start on `http://localhost:8000`

### Production Mode

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Health Check
- `GET /health` - Check service health

### Tasks
- `POST /api/tasks` - Create and start a new task
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/{id}` - Get task details
- `GET /api/tasks/{id}/result` - Get task execution results
- `GET /api/tasks/{id}/stream` - Stream task updates (SSE)
- `DELETE /api/tasks/{id}` - Delete a task

### Agents
- `GET /api/agents` - List all agents and their status
- `GET /api/agents/{id}` - Get specific agent status

### Plugins
- `GET /api/plugins` - List all plugins
- `GET /api/plugins/{id}` - Get plugin details
- `PUT /api/plugins/{id}/toggle` - Enable/disable plugin
- `POST /api/plugins/{id}/connect` - Connect a plugin

### Logs
- `GET /api/logs` - Get logs (with filtering)
- `GET /api/logs/timeline` - Get timeline events
- `DELETE /api/logs` - Clear logs
- `DELETE /api/logs/timeline` - Clear timeline

## Example Usage

### Create a Task

```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Build a login page with email and password authentication"}'
```

### Get All Agents

```bash
curl http://localhost:8000/api/agents
```

### Stream Task Updates

```bash
curl -N http://localhost:8000/api/tasks/task-abc123/stream
```

## Configuration

All configuration is done through environment variables in `.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `GEMINI_MODEL` | Gemini model to use | `gemini-2.0-flash-exp` |
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `8000` |
| `DEBUG` | Debug mode | `True` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000` |
| `MEMORY_ENABLED` | Enable memory storage | `True` |
| `MAX_MEMORY_ITEMS` | Max memory entries | `100` |
| `LOG_LEVEL` | Logging level | `INFO` |

## Multi-Agent Workflow

When a user submits a task:

1. **Planner Agent** analyzes the request and creates a task plan
2. **Research Agent** gathers context and best practices
3. **Developer Agent** performs code generation or task execution
4. **Tester Agent** validates output and checks for issues
5. **Reviewer Agent** produces the final response with confidence score
6. **Memory Agent** stores reusable context
7. **Tool Agent** calls available plugins if needed

## Adding New Plugins

To add a new plugin:

1. Register it in `app/services/plugin_manager.py`
2. Implement the tool in `app/tools/registry.py`
3. The plugin will automatically appear in the frontend

## Development

### Project Structure

- **Agents**: Each agent is a separate class inheriting from `BaseAgent`
- **Services**: Business logic separated from API routes
- **Schemas**: Pydantic models for request/response validation
- **Dependencies**: Singleton pattern for service instances

### Adding a New Agent

1. Create a new file in `app/agents/`
2. Inherit from `BaseAgent`
3. Implement the `execute()` method
4. Register in `app/agents/__init__.py`
5. Add to `TaskExecutor` in `app/services/task_executor.py`

### Code Quality

- Type hints throughout
- Pydantic validation
- Comprehensive logging
- Error handling
- Clean separation of concerns

## Troubleshooting

### "GEMINI_API_KEY not found"
- Make sure you've created `.env` file
- Verify the API key is correct
- Check the file is in the `backend/` directory

### "Module not found"
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt`

### CORS errors
- Check `CORS_ORIGINS` in `.env`
- Add your frontend URL to the list

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
