# AgentOS - Multi-Agent AI System

A professional AI workbench where multiple specialized agents work together to plan, execute, test, and summarize tasks. Built with Next.js (frontend) and Python FastAPI (backend), powered by Google Gemini API.

## 🎯 Overview

AgentOS is a production-ready multi-agent system that orchestrates specialized AI agents to collaborate on complex tasks. Instead of using a single general-purpose AI model, AgentOS breaks down tasks and assigns them to specialized agents, each with a specific role and expertise.

## ✨ Features

- **🤖 Multi-Agent Architecture**: 7 specialized agents working together
- **⚡ Real-time Updates**: Live agent status and task progress
- **🔌 Plugin System**: Extensible tool/plugin architecture
- **📊 Comprehensive Dashboard**: Monitor all agents and tasks
- **🧠 Memory Management**: Context storage and retrieval
- **📝 Detailed Logging**: Complete audit trail of all operations
- **🎨 Modern UI**: Beautiful, responsive interface with dark mode
- **🔒 Type-Safe**: Full TypeScript and Pydantic validation
- **🚀 Production Ready**: Proper error handling, logging, and CORS

## 🏗️ Architecture

### Agents

1. **Planner Agent** - Breaks user requests into actionable steps
2. **Research Agent** - Gathers relevant information and best practices
3. **Developer Agent** - Writes or improves code
4. **Tester Agent** - Validates logic and checks for errors
5. **Reviewer Agent** - Summarizes results and provides final validation
6. **Memory Agent** - Stores context and task history
7. **Tool Agent** - Connects external tools and plugins

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts for visualizations

**Backend:**
- Python 3.10+
- FastAPI
- Google Gemini API
- Pydantic for validation
- Uvicorn ASGI server

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- Python 3.10+
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### 1. Clone the Repository

```bash
git clone https://github.com/omsudhamsh/Multi-Agent-System.git
cd Multi-Agent-System
```

### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run backend
python -m app.main
```

Backend will start on http://localhost:8000

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install
# or
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local if needed (default: http://localhost:8000)

# Run development server
npm run dev
# or
pnpm dev
```

Frontend will start on http://localhost:3000

### 4. Test the System

1. Visit http://localhost:3000
2. Enter a task like "Build a login page with email and password"
3. Click "Start Task"
4. Watch the agents collaborate in real-time!

## 📖 Documentation

- **[Backend Setup Guide](backend/SETUP.md)** - Detailed backend installation
- **[Backend README](backend/README.md)** - Backend architecture and API docs
- **[Integration Guide](INTEGRATION.md)** - Connect frontend to backend
- **[API Documentation](http://localhost:8000/docs)** - Interactive API docs (when running)

## 🎮 Usage

### Creating a Task

```typescript
import { createTask } from '@/lib/api';

const task = await createTask("Build a todo app with React");
console.log(`Task ${task.id} created`);
```

### Monitoring Agents

```typescript
import { getAgents } from '@/lib/api';

const agents = await getAgents();
agents.forEach(agent => {
  console.log(`${agent.name}: ${agent.status} (${agent.progress}%)`);
});
```

### Managing Plugins

```typescript
import { togglePlugin } from '@/lib/api';

await togglePlugin('web-search', true);
```

## 🔧 Configuration

### Backend Configuration

Edit `backend/.env`:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
HOST=0.0.0.0
PORT=8000
DEBUG=True
CORS_ORIGINS=http://localhost:3000
MEMORY_ENABLED=True
MAX_MEMORY_ITEMS=100
LOG_LEVEL=INFO
```

### Frontend Configuration

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📁 Project Structure

```
Multi-Agent-System/
├── frontend/              # Next.js frontend
│   ├── app/              # Next.js app directory
│   │   ├── agents/       # Agents page
│   │   ├── tasks/        # Tasks page
│   │   ├── plugins/      # Plugins page
│   │   ├── logs/         # Logs page
│   │   ├── settings/     # Settings page
│   │   └── page.tsx      # Dashboard
│   ├── components/       # React components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── agents/       # Agent components
│   │   ├── plugins/      # Plugin components
│   │   └── ui/           # UI components (shadcn)
│   ├── lib/              # Utilities and API client
│   ├── hooks/            # Custom React hooks
│   ├── public/           # Static assets
│   └── README.md         # Frontend documentation
├── backend/              # Python backend
│   ├── app/
│   │   ├── agents/        # Agent implementations
│   │   ├── api/           # API routes
│   │   ├── core/          # Core configuration
│   │   ├── memory/        # Memory storage
│   │   ├── schemas/       # Pydantic models
│   │   ├── services/      # Business logic
│   │   ├── tools/         # Tool/plugin system
│   │   └── main.py        # FastAPI app
│   ├── requirements.txt   # Python dependencies
│   └── .env.example       # Environment template
├── INTEGRATION.md         # Integration guide
└── README.md              # This file
```

## 🔌 Available Plugins

- **Web Search** - Search the web for information
- **File Reader** - Read and parse local files
- **Code Runner** - Execute code in sandboxes
- **GitHub Sync** - Manage repositories
- **Database Connector** - Connect to databases
- **PDF Parser** - Extract text from PDFs

## 🛠️ Development

### Adding a New Agent

1. Create agent file in `backend/app/agents/`
2. Inherit from `BaseAgent`
3. Implement `execute()` method
4. Register in `TaskExecutor`

Example:

```python
from app.agents.base import BaseAgent

class CustomAgent(BaseAgent):
    def __init__(self, gemini_service):
        super().__init__(
            agent_id="custom",
            name="Custom Agent",
            role="Does custom things",
            icon="Star"
        )
        self.gemini = gemini_service
    
    async def execute(self, context):
        # Your logic here
        return {"result": "success"}
```

### Adding a New Plugin

1. Register in `backend/app/services/plugin_manager.py`
2. Implement tool in `backend/app/tools/registry.py`
3. Plugin appears automatically in frontend

## 🧪 Testing

### Test Backend

```bash
cd backend
python -m pytest
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:8000/health

# Create task
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test task"}'

# Get agents
curl http://localhost:8000/api/agents
```

## 🚢 Deployment

### Backend Deployment

1. Set production environment variables
2. Use production ASGI server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

### Frontend Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy to Vercel, Netlify, or your preferred platform

3. Update `NEXT_PUBLIC_API_URL` to your backend URL

## 🐛 Troubleshooting

### Backend won't start

- Check Python version: `python --version` (need 3.10+)
- Verify virtual environment is activated
- Ensure `.env` file exists with valid `GEMINI_API_KEY`

### CORS errors

- Add your frontend URL to `CORS_ORIGINS` in backend `.env`
- Restart the backend after changing `.env`

### Agents not updating

- Check backend is running: `curl http://localhost:8000/health`
- Verify API URL in frontend `.env.local`
- Check browser console for errors

## 📝 API Endpoints

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - List tasks
- `GET /api/tasks/{id}` - Get task
- `GET /api/tasks/{id}/stream` - Stream updates

### Agents
- `GET /api/agents` - List agents
- `GET /api/agents/{id}` - Get agent

### Plugins
- `GET /api/plugins` - List plugins
- `PUT /api/plugins/{id}/toggle` - Toggle plugin

### Logs
- `GET /api/logs` - Get logs
- `GET /api/logs/timeline` - Get timeline

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Backend framework [FastAPI](https://fastapi.tiangolo.com/)

## 📧 Support

For issues or questions:
- Check the [documentation](backend/README.md)
- Review [troubleshooting guide](#-troubleshooting)
- Open an issue on GitHub

---

**Built with ❤️ for the AI community**

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
