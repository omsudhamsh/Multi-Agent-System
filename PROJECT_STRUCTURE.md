# AgentOS - Complete Project Structure

Detailed overview of the entire project organization.

## Root Directory

```
Multi-Agent-System/
├── frontend/              # Next.js frontend application
├── backend/               # Python FastAPI backend
├── .gitignore            # Git ignore rules
├── README.md             # Main project documentation
├── GETTING_STARTED.md    # Quick start guide
├── INTEGRATION.md        # Frontend-Backend integration
├── ARCHITECTURE.md       # System architecture
├── PROJECT_SUMMARY.md    # Project overview
└── PROJECT_STRUCTURE.md  # This file
```

## Frontend Structure

```
frontend/
├── app/                           # Next.js App Router (Pages)
│   ├── agents/
│   │   └── page.tsx              # Agents monitoring page
│   ├── logs/
│   │   └── page.tsx              # Logs viewer page
│   ├── plugins/
│   │   └── page.tsx              # Plugin marketplace page
│   ├── projects/
│   │   └── page.tsx              # Projects management page
│   ├── settings/
│   │   └── page.tsx              # Settings page
│   ├── tasks/
│   │   └── page.tsx              # Task management page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Dashboard (home page)
│
├── components/                    # React Components
│   ├── agents/
│   │   ├── agent-performance-chart.tsx
│   │   └── agent-stats.tsx
│   ├── dashboard/
│   │   ├── agent-card.tsx        # Agent status card
│   │   ├── execution-timeline.tsx # Timeline component
│   │   ├── progress-overview.tsx  # Progress charts
│   │   ├── recent-tasks.tsx      # Recent tasks list
│   │   └── task-input.tsx        # Task creation input
│   ├── plugins/
│   │   └── plugin-card.tsx       # Plugin card component
│   ├── ui/                        # shadcn/ui components (57 files)
│   │   ├── accordion.tsx
│   │   ├── alert.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── switch.tsx
│   │   ├── textarea.tsx
│   │   └── ... (48 more components)
│   ├── app-sidebar.tsx           # Application sidebar
│   ├── dashboard-layout.tsx      # Dashboard layout wrapper
│   ├── theme-provider.tsx        # Theme context provider
│   └── topbar.tsx                # Top navigation bar
│
├── hooks/                         # Custom React Hooks
│   ├── use-mobile.ts             # Mobile detection
│   └── use-toast.ts              # Toast notifications
│
├── lib/                           # Utilities
│   ├── api.ts                    # API client for backend
│   ├── mock-data.ts              # Mock data for development
│   └── utils.ts                  # Helper functions
│
├── public/                        # Static Assets
│   ├── apple-icon.png
│   ├── icon-dark-32x32.png
│   ├── icon-light-32x32.png
│   ├── icon.svg
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
│
├── styles/                        # Additional Styles
│   └── globals.css
│
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── components.json                # shadcn/ui configuration
├── next-env.d.ts                  # Next.js TypeScript declarations
├── next.config.mjs                # Next.js configuration
├── package.json                   # Dependencies and scripts
├── pnpm-lock.yaml                 # Package lock file
├── postcss.config.mjs             # PostCSS configuration
├── README.md                      # Frontend documentation
├── SETUP.md                       # Frontend setup guide
├── start.bat                      # Windows start script
├── start.sh                       # Unix start script
├── tsconfig.json                  # TypeScript configuration
└── tsconfig.tsbuildinfo           # TypeScript build info
```

## Backend Structure

```
backend/
├── app/                           # Main Application
│   ├── agents/                    # AI Agents
│   │   ├── __init__.py
│   │   ├── base.py               # Base agent class
│   │   ├── developer.py          # Code generation agent
│   │   ├── memory.py             # Context storage agent
│   │   ├── planner.py            # Task planning agent
│   │   ├── researcher.py         # Information gathering agent
│   │   ├── reviewer.py           # Final review agent
│   │   ├── tester.py             # Validation agent
│   │   └── tools.py              # Plugin execution agent
│   │
│   ├── api/                       # API Layer
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── agents.py         # Agent endpoints
│   │   │   ├── health.py         # Health check
│   │   │   ├── logs.py           # Log endpoints
│   │   │   ├── plugins.py        # Plugin endpoints
│   │   │   └── tasks.py          # Task endpoints
│   │   ├── __init__.py
│   │   └── dependencies.py       # Dependency injection
│   │
│   ├── core/                      # Core Configuration
│   │   ├── __init__.py
│   │   ├── config.py             # Settings
│   │   └── logging.py            # Logging setup
│   │
│   ├── memory/                    # Memory Storage
│   │   ├── __init__.py
│   │   └── store.py              # In-memory store
│   │
│   ├── schemas/                   # Data Models
│   │   ├── __init__.py
│   │   ├── agent.py              # Agent schemas
│   │   ├── log.py                # Log schemas
│   │   ├── plugin.py             # Plugin schemas
│   │   ├── settings.py           # Settings schemas
│   │   └── task.py               # Task schemas
│   │
│   ├── services/                  # Business Logic
│   │   ├── __init__.py
│   │   ├── gemini.py             # Gemini API client
│   │   ├── log_service.py        # Logging service
│   │   ├── plugin_manager.py     # Plugin management
│   │   ├── task_executor.py      # Agent orchestration
│   │   └── task_manager.py       # Task lifecycle
│   │
│   ├── tools/                     # Plugin System
│   │   ├── __init__.py
│   │   └── registry.py           # Tool registry
│   │
│   ├── utils/                     # Utilities
│   │   └── __init__.py
│   │
│   ├── __init__.py
│   └── main.py                    # FastAPI application
│
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── README.md                      # Backend documentation
├── requirements.txt               # Python dependencies
├── setup.bat                      # Windows setup script
├── setup.sh                       # Unix setup script
├── SETUP.md                       # Backend setup guide
├── start.bat                      # Windows start script
└── start.sh                       # Unix start script
```

## Documentation Files

```
Documentation/
├── README.md                      # Main project overview
├── GETTING_STARTED.md             # Quick start guide (10 min)
├── INTEGRATION.md                 # Frontend-Backend integration
├── ARCHITECTURE.md                # System architecture details
├── PROJECT_SUMMARY.md             # Complete project summary
├── PROJECT_STRUCTURE.md           # This file
├── frontend/
│   ├── README.md                  # Frontend documentation
│   └── SETUP.md                   # Frontend setup guide
└── backend/
    ├── README.md                  # Backend documentation
    └── SETUP.md                   # Backend setup guide
```

## Configuration Files

### Frontend Configuration

```
frontend/
├── .env.example                   # Environment template
├── .env.local                     # Local environment (not in git)
├── components.json                # shadcn/ui config
├── next.config.mjs                # Next.js config
├── postcss.config.mjs             # PostCSS config
├── tailwind.config.ts             # Tailwind CSS config
└── tsconfig.json                  # TypeScript config
```

### Backend Configuration

```
backend/
├── .env.example                   # Environment template
├── .env                           # Local environment (not in git)
└── requirements.txt               # Python dependencies
```

## Key Files by Purpose

### Entry Points

- `frontend/app/page.tsx` - Frontend entry (Dashboard)
- `backend/app/main.py` - Backend entry (FastAPI app)

### API Integration

- `frontend/lib/api.ts` - API client
- `backend/app/api/routes/` - API endpoints

### Agent System

- `backend/app/agents/` - All agent implementations
- `backend/app/services/task_executor.py` - Agent orchestration

### UI Components

- `frontend/components/dashboard/` - Dashboard components
- `frontend/components/ui/` - Reusable UI components

### Configuration

- `frontend/.env.local` - Frontend environment
- `backend/.env` - Backend environment
- `backend/app/core/config.py` - Backend settings

### Documentation

- `README.md` - Main documentation
- `GETTING_STARTED.md` - Quick start
- `INTEGRATION.md` - Integration guide

## File Count Summary

```
Frontend:
- Pages: 7
- Components: 70+
- Hooks: 2
- Utilities: 3
- Assets: 9
- Config files: 7
Total: ~100 files

Backend:
- Agents: 7
- API routes: 5
- Services: 5
- Schemas: 5
- Core files: 3
- Config files: 4
Total: ~40 files

Documentation:
- Main docs: 6
- Frontend docs: 2
- Backend docs: 2
Total: 10 files

Grand Total: ~150 files
```

## Technology Stack by Layer

### Frontend Layer
```
UI Framework:     Next.js 14
Language:         TypeScript
Styling:          Tailwind CSS
Components:       shadcn/ui (Radix UI)
Charts:           Recharts
Icons:            Lucide React
State:            React Hooks
Theme:            next-themes
```

### Backend Layer
```
Framework:        FastAPI
Language:         Python 3.10+
Server:           Uvicorn (ASGI)
Validation:       Pydantic
AI Model:         Google Gemini
HTTP Client:      httpx
```

### Development Tools
```
Package Manager:  npm/pnpm (frontend), pip (backend)
Version Control:  Git
Code Quality:     ESLint, TypeScript, Python type hints
```

## Data Flow Through Structure

### Task Creation Flow
```
1. frontend/components/dashboard/task-input.tsx
   ↓ (User input)
2. frontend/lib/api.ts (createTask)
   ↓ (HTTP POST)
3. backend/app/api/routes/tasks.py
   ↓ (Route handler)
4. backend/app/services/task_manager.py
   ↓ (Create task)
5. backend/app/services/task_executor.py
   ↓ (Execute agents)
6. backend/app/agents/*.py
   ↓ (Agent execution)
7. backend/app/services/gemini.py
   ↓ (AI generation)
8. Results stored and returned
```

### Real-time Updates Flow
```
1. frontend/app/agents/page.tsx
   ↓ (Poll/Stream)
2. frontend/lib/api.ts (getAgents)
   ↓ (HTTP GET)
3. backend/app/api/routes/agents.py
   ↓ (Route handler)
4. backend/app/services/task_executor.py
   ↓ (Get agent states)
5. Agent states returned
   ↓ (JSON response)
6. frontend/components/dashboard/agent-card.tsx
   ↓ (Display update)
```

## Module Dependencies

### Frontend Dependencies
```
Core:
- next (React framework)
- react, react-dom (UI library)
- typescript (Type safety)

UI:
- tailwindcss (Styling)
- @radix-ui/* (UI primitives)
- lucide-react (Icons)
- recharts (Charts)

Utilities:
- clsx, tailwind-merge (Class utilities)
- next-themes (Theme management)
```

### Backend Dependencies
```
Core:
- fastapi (Web framework)
- uvicorn (ASGI server)
- pydantic (Validation)

AI:
- google-generativeai (Gemini API)

Utilities:
- python-dotenv (Environment)
- httpx (HTTP client)
- aiofiles (Async file I/O)
```

## Build Outputs

### Frontend Build
```
frontend/.next/
├── cache/              # Build cache
├── server/             # Server-side code
├── static/             # Static assets
└── trace               # Performance traces
```

### Backend Runtime
```
backend/
├── __pycache__/        # Python bytecode
└── venv/               # Virtual environment
```

## Environment Files

### Frontend Environment
```
.env.example            # Template (in git)
.env.local              # Local config (not in git)
.env.production         # Production config (not in git)
```

### Backend Environment
```
.env.example            # Template (in git)
.env                    # Local config (not in git)
```

## Scripts and Automation

### Frontend Scripts
```
npm run dev             # Development server
npm run build           # Production build
npm start               # Production server
npm run lint            # Run linter
```

### Backend Scripts
```
python -m app.main      # Start server
./setup.sh              # Setup (Unix)
./start.sh              # Start (Unix)
setup.bat               # Setup (Windows)
start.bat               # Start (Windows)
```

## Navigation Map

### User Journey Through Files

**Creating a Task:**
1. User visits `frontend/app/page.tsx` (Dashboard)
2. Interacts with `frontend/components/dashboard/task-input.tsx`
3. Calls `frontend/lib/api.ts` → `createTask()`
4. Hits `backend/app/api/routes/tasks.py` → `POST /api/tasks`
5. Processed by `backend/app/services/task_manager.py`
6. Executed by `backend/app/services/task_executor.py`
7. Agents in `backend/app/agents/` collaborate
8. Results displayed in `frontend/components/dashboard/recent-tasks.tsx`

**Monitoring Agents:**
1. User visits `frontend/app/agents/page.tsx`
2. Calls `frontend/lib/api.ts` → `getAgents()`
3. Hits `backend/app/api/routes/agents.py` → `GET /api/agents`
4. Returns data from `backend/app/services/task_executor.py`
5. Displayed in `frontend/components/dashboard/agent-card.tsx`

## Extension Points

### Adding New Pages
- Create `frontend/app/new-page/page.tsx`
- Add route to `frontend/components/app-sidebar.tsx`

### Adding New Agents
- Create `backend/app/agents/new_agent.py`
- Register in `backend/app/services/task_executor.py`

### Adding New API Endpoints
- Create route in `backend/app/api/routes/`
- Add to `backend/app/api/__init__.py`
- Add client function in `frontend/lib/api.ts`

### Adding New Components
- Create in `frontend/components/`
- Import and use in pages

---

This structure is designed for:
- **Clarity**: Easy to find files
- **Scalability**: Easy to add features
- **Maintainability**: Clear separation of concerns
- **Developer Experience**: Logical organization
