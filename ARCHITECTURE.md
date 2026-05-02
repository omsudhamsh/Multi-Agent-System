# AgentOS Architecture

Detailed architecture documentation for the Multi-Agent AI System.

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER LAYER                                 │
│                                                                      │
│  Browser → Next.js Frontend (React, TypeScript, Tailwind)          │
│  Port: 3000                                                         │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTP/REST + SSE
                             │ JSON Data
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY LAYER                             │
│                                                                      │
│  FastAPI (Python) - ASGI Server (Uvicorn)                          │
│  Port: 8000                                                         │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  API Routes                                                   │  │
│  │  /api/tasks | /api/agents | /api/plugins | /api/logs        │  │
│  └─────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                                  │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ Task Manager │  │Plugin Manager│  │ Log Service  │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │              Task Executor (Orchestrator)                   │   │
│  │  Coordinates multi-agent workflow                           │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       AGENT LAYER                                    │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Planner  │→ │Researcher│→ │Developer │→ │  Tester  │          │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘          │
│                                      ↓                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                         │
│  │ Reviewer │← │  Memory  │  │  Tools   │                         │
│  └──────────┘  └──────────┘  └──────────┘                         │
│                                                                      │
│  Each agent: Status, Progress, Actions, Output                     │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      STORAGE LAYER                                   │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ Memory Store │  │ Task Results │  │  Log Store   │            │
│  │ (In-Memory)  │  │ (In-Memory)  │  │ (In-Memory)  │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                               │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │              Google Gemini API                              │   │
│  │  AI Model: gemini-2.0-flash-exp                            │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend Layer

**Technology**: Next.js 14, React, TypeScript, Tailwind CSS

**Components**:
- `app/page.tsx` - Main dashboard
- `app/agents/page.tsx` - Agent monitoring
- `app/tasks/page.tsx` - Task management
- `app/plugins/page.tsx` - Plugin marketplace
- `app/logs/page.tsx` - Log viewer
- `app/settings/page.tsx` - Configuration

**Features**:
- Real-time UI updates
- Responsive design
- Dark mode support
- Interactive charts
- SSE streaming support

### API Gateway Layer

**Technology**: FastAPI, Uvicorn

**Endpoints**:

```
Health & Info:
  GET  /health              - Health check
  GET  /                    - Root info

Tasks:
  POST   /api/tasks         - Create task
  GET    /api/tasks         - List tasks
  GET    /api/tasks/{id}    - Get task
  GET    /api/tasks/{id}/result - Get result
  GET    /api/tasks/{id}/stream - Stream updates
  DELETE /api/tasks/{id}    - Delete task

Agents:
  GET  /api/agents          - List agents
  GET  /api/agents/{id}     - Get agent

Plugins:
  GET  /api/plugins         - List plugins
  GET  /api/plugins/{id}    - Get plugin
  PUT  /api/plugins/{id}/toggle - Toggle plugin
  POST /api/plugins/{id}/connect - Connect plugin

Logs:
  GET    /api/logs          - Get logs
  GET    /api/logs/timeline - Get timeline
  DELETE /api/logs          - Clear logs
  DELETE /api/logs/timeline - Clear timeline
```

**Features**:
- CORS middleware
- Request validation
- Error handling
- Background tasks
- SSE streaming

### Service Layer

#### Task Manager
**Responsibility**: Task lifecycle management

**Methods**:
- `create_task()` - Create new task
- `get_task()` - Retrieve task
- `update_task()` - Update status
- `store_task_result()` - Store results
- `delete_task()` - Remove task

#### Task Executor
**Responsibility**: Multi-agent orchestration

**Workflow**:
1. Initialize context
2. Execute agents sequentially
3. Pass context between agents
4. Collect results
5. Update task status
6. Log all activities

#### Plugin Manager
**Responsibility**: Plugin lifecycle

**Methods**:
- `get_all_plugins()` - List plugins
- `toggle_plugin()` - Enable/disable
- `connect_plugin()` - Connect plugin

#### Log Service
**Responsibility**: Logging and timeline

**Methods**:
- `add_log()` - Add log entry
- `get_logs()` - Retrieve logs
- `add_timeline_event()` - Add event
- `get_timeline()` - Get timeline

### Agent Layer

#### Base Agent
**Abstract class** for all agents

**Properties**:
- `id` - Unique identifier
- `name` - Display name
- `role` - Agent purpose
- `status` - Current state
- `progress` - Completion percentage
- `last_action` - Recent activity
- `output_snippet` - Output preview

**Methods**:
- `execute(context)` - Main execution
- `update_status()` - Update state
- `to_dict()` - Serialize

#### Planner Agent
**Purpose**: Break tasks into steps

**Process**:
1. Analyze user request
2. Create execution plan
3. Identify required agents
4. Generate step list

**Output**: Plan text + steps array

#### Researcher Agent
**Purpose**: Gather information

**Process**:
1. Understand requirements
2. Research best practices
3. Find relevant resources
4. Compile findings

**Output**: Research text + key points

#### Developer Agent
**Purpose**: Generate code

**Process**:
1. Review plan and research
2. Design solution
3. Write implementation
4. Extract code blocks

**Output**: Implementation + code blocks

#### Tester Agent
**Purpose**: Validate output

**Process**:
1. Review implementation
2. Create test cases
3. Check for issues
4. Assess quality

**Output**: Test results + issues list

#### Reviewer Agent
**Purpose**: Final summary

**Process**:
1. Review all outputs
2. Assess quality
3. Generate summary
4. Calculate confidence

**Output**: Review + confidence score

#### Memory Agent
**Purpose**: Store context

**Process**:
1. Extract key information
2. Store in memory
3. Update index
4. Return stats

**Output**: Storage confirmation + stats

#### Tool Agent
**Purpose**: Execute plugins

**Process**:
1. Validate tool exists
2. Execute tool function
3. Process results
4. Return output

**Output**: Tool results

### Storage Layer

#### Memory Store
**Type**: In-memory dictionary

**Features**:
- Key-value storage
- Max items limit
- Search capability
- Statistics tracking

**Methods**:
- `store()` - Save data
- `retrieve()` - Get data
- `search()` - Find entries
- `get_stats()` - Get metrics

#### Task Results
**Type**: In-memory dictionary

**Storage**:
- Task ID → Results mapping
- Agent outputs
- Execution metadata

#### Log Store
**Type**: In-memory lists

**Storage**:
- Log entries (max 1000)
- Timeline events (max 100)
- Automatic rotation

### External Services

#### Gemini API
**Provider**: Google AI

**Configuration**:
- Model: `gemini-2.0-flash-exp`
- Temperature: 0.7
- Max tokens: 2048

**Usage**:
- Text generation
- Code generation
- Analysis and review

## Data Flow

### Task Creation Flow

```
1. User Input
   ↓
2. Frontend: createTask(prompt)
   ↓
3. API: POST /api/tasks
   ↓
4. Task Manager: create_task()
   ↓
5. Background: execute_task_background()
   ↓
6. Task Executor: execute_task()
   ↓
7. Agents: Sequential execution
   ↓
8. Results: Store and update
   ↓
9. Frontend: Poll/Stream updates
```

### Agent Execution Flow

```
Context = {prompt, ...}
   ↓
Planner.execute(context)
   → context.plan = result
   ↓
Researcher.execute(context)
   → context.research = result
   ↓
Developer.execute(context)
   → context.implementation = result
   ↓
Tester.execute(context)
   → context.testResults = result
   ↓
Reviewer.execute(context)
   → context.review = result
   ↓
Memory.execute(context)
   → Store context
   ↓
Return final results
```

### Real-time Updates Flow

```
Frontend
   ↓
SSE Connection: /api/tasks/{id}/stream
   ↓
Backend: event_generator()
   ↓
Loop:
  1. Get current task state
  2. Send as SSE event
  3. Check if complete
  4. Sleep 1 second
   ↓
Frontend: Update UI
```

## Security Architecture

### API Security
- Environment-based configuration
- CORS restrictions
- Input validation (Pydantic)
- Error message sanitization

### Data Security
- API keys in environment only
- No sensitive data in logs
- Secure error handling

### Frontend Security
- API URL from environment
- No API keys in frontend
- HTTPS in production

## Scalability Considerations

### Current Architecture
- In-memory storage
- Single server
- Synchronous agent execution

### Future Enhancements
- Database persistence (PostgreSQL)
- Redis for caching
- Message queue (RabbitMQ/Celery)
- Horizontal scaling
- Load balancing
- Microservices architecture

## Performance Optimization

### Backend
- Async/await for I/O
- Background task execution
- Connection pooling
- Memory limits

### Frontend
- Code splitting
- Lazy loading
- Optimistic updates
- Efficient polling

### API
- Response caching
- Pagination
- Field filtering
- Compression

## Monitoring & Observability

### Logging
- Structured logging
- Log levels (DEBUG, INFO, WARNING, ERROR)
- Agent activity tracking
- Timeline events

### Metrics (Future)
- Request latency
- Agent execution time
- API usage
- Error rates
- Memory usage

### Health Checks
- `/health` endpoint
- Service status
- Dependency checks

## Deployment Architecture

### Development
```
Local Machine
├── Frontend (localhost:3000)
└── Backend (localhost:8000)
    └── Gemini API (cloud)
```

### Production (Recommended)
```
Cloud Infrastructure
├── Frontend (Vercel/Netlify)
├── Backend (AWS/GCP/Azure)
│   ├── Load Balancer
│   ├── App Servers (multiple)
│   ├── Redis Cache
│   └── PostgreSQL Database
└── Gemini API (Google Cloud)
```

## Technology Choices

### Why FastAPI?
- Modern Python framework
- Automatic API documentation
- Type safety with Pydantic
- Async support
- High performance

### Why Next.js?
- React framework
- Server-side rendering
- File-based routing
- Built-in optimization
- Great developer experience

### Why Gemini?
- Powerful AI model
- Generous free tier
- Good for code generation
- Fast response times
- Easy integration

### Why In-Memory Storage?
- Simple to start
- No database setup
- Fast access
- Easy to replace later

## Extension Points

### Adding New Agents
1. Create agent class in `backend/app/agents/`
2. Inherit from `BaseAgent`
3. Implement `execute()` method
4. Register in `TaskExecutor`

### Adding New Plugins
1. Add to `PluginManager._initialize_plugins()`
2. Implement in `ToolRegistry`
3. Register tool function

### Adding New Endpoints
1. Create route in `backend/app/api/routes/`
2. Add to `api_router` in `__init__.py`
3. Update frontend API client

### Custom Storage
1. Implement storage interface
2. Replace in-memory store
3. Update dependencies

## Best Practices

### Code Organization
- Separation of concerns
- Single responsibility
- Dependency injection
- Type hints everywhere

### Error Handling
- Try-catch at boundaries
- Meaningful error messages
- Proper logging
- Graceful degradation

### Testing
- Unit tests for agents
- Integration tests for API
- E2E tests for workflows

### Documentation
- Code comments where needed
- API documentation
- Architecture docs
- Setup guides

---

This architecture is designed to be:
- **Modular**: Easy to modify components
- **Scalable**: Can grow with needs
- **Maintainable**: Clear structure
- **Extensible**: Easy to add features
