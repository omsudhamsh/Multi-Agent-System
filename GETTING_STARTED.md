# Getting Started with AgentOS

Complete step-by-step guide to get AgentOS running in under 10 minutes.

## Prerequisites Checklist

Before starting, make sure you have:

- [ ] **Node.js 18+** installed ([Download](https://nodejs.org/))
- [ ] **Python 3.10+** installed ([Download](https://www.python.org/downloads/))
- [ ] **Google Gemini API Key** ([Get one free](https://makersuite.google.com/app/apikey))
- [ ] **Git** installed (optional, for cloning)
- [ ] **Terminal/Command Prompt** access

## Step-by-Step Setup

### Step 1: Get Your Gemini API Key (2 minutes)

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (starts with `AIza...`)
5. Keep it safe - you'll need it in Step 3

### Step 2: Setup Backend (3 minutes)

#### Option A: Automated Setup (Recommended)

**Windows:**
```bash
cd backend
setup.bat
```

**macOS/Linux:**
```bash
cd backend
chmod +x setup.sh
./setup.sh
```

#### Option B: Manual Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

### Step 3: Configure Backend (1 minute)

Edit `backend/.env` and add your API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Full configuration:**
```env
GEMINI_API_KEY=AIzaSy...your_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
HOST=0.0.0.0
PORT=8000
DEBUG=True
CORS_ORIGINS=http://localhost:3000
MEMORY_ENABLED=True
MAX_MEMORY_ITEMS=100
LOG_LEVEL=INFO
```

### Step 4: Start Backend (30 seconds)

#### Option A: Using Start Script

**Windows:**
```bash
start.bat
```

**macOS/Linux:**
```bash
./start.sh
```

#### Option B: Manual Start

```bash
# Make sure virtual environment is activated
python -m app.main
```

You should see:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ **Backend is running!** Keep this terminal open.

### Step 5: Setup Frontend (2 minutes)

Open a **new terminal** window:

```bash
# Go to frontend directory
cd frontend

# Install dependencies
npm install
# or
pnpm install
# or
yarn install
```

### Step 6: Start Frontend (30 seconds)

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

✅ **Frontend is running!**

### Step 7: Test the System (1 minute)

1. **Open your browser** to http://localhost:3000

2. **Check backend health**:
   - Visit http://localhost:8000/health
   - Should see: `{"status": "healthy", ...}`

3. **View API docs**:
   - Visit http://localhost:8000/docs
   - Interactive API documentation

4. **Create your first task**:
   - In the dashboard, enter: "Create a simple calculator function"
   - Click "Start Task"
   - Watch the agents work!

## Verification Checklist

After setup, verify everything works:

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] Health check returns `{"status": "healthy"}`
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] Dashboard loads without errors
- [ ] Can create a task
- [ ] Agents show status updates
- [ ] No CORS errors in browser console

## Quick Test Commands

### Test Backend API

```bash
# Health check
curl http://localhost:8000/health

# Create a task
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a hello world function"}'

# Get all agents
curl http://localhost:8000/api/agents

# Get all tasks
curl http://localhost:8000/api/tasks
```

### Test in Browser

1. **Dashboard**: http://localhost:3000
2. **Agents Page**: http://localhost:3000/agents
3. **Tasks Page**: http://localhost:3000/tasks
4. **Plugins Page**: http://localhost:3000/plugins
5. **Logs Page**: http://localhost:3000/logs
6. **Settings Page**: http://localhost:3000/settings

## Common Issues & Solutions

### Issue: "Python not found"

**Solution:**
- Install Python 3.10+ from python.org
- Make sure it's added to PATH
- Restart terminal after installation

### Issue: "GEMINI_API_KEY not found"

**Solution:**
- Check `.env` file exists in `backend/` directory
- Verify API key is set correctly
- No quotes needed around the key
- Restart backend after changing `.env`

### Issue: "Port 8000 already in use"

**Solution:**
```bash
# Find and kill process using port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:8000 | xargs kill -9
```

Or use a different port:
```bash
uvicorn app.main:app --port 8080
```

### Issue: "Module not found"

**Solution:**
```bash
# Make sure virtual environment is activated
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: CORS errors in browser

**Solution:**
- Check `CORS_ORIGINS` in `backend/.env`
- Should include your frontend URL
- Restart backend after changing

### Issue: Frontend can't connect to backend

**Solution:**
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check frontend API URL in `.env.local`
3. Look for errors in browser console
4. Check network tab in browser DevTools

## Next Steps

Now that everything is running:

### 1. Try Different Tasks

```
"Build a login page with email and password"
"Create a REST API for a todo app"
"Write unit tests for a calculator function"
"Refactor this code to use async/await"
"Explain how React hooks work"
```

### 2. Explore the Dashboard

- **Dashboard**: Overview of all agents and tasks
- **Agents**: Detailed view of each agent's status
- **Tasks**: History of all tasks
- **Plugins**: Enable/disable plugins
- **Logs**: View detailed execution logs
- **Settings**: Configure API and preferences

### 3. Monitor Agent Activity

Watch how agents collaborate:
1. Planner breaks down the task
2. Researcher gathers information
3. Developer implements solution
4. Tester validates output
5. Reviewer provides summary
6. Memory stores context

### 4. Check the Logs

Visit the Logs page to see:
- Agent actions
- API calls
- Errors and warnings
- Timeline of events

### 5. Customize Settings

Visit Settings page to:
- Change Gemini model
- Toggle notifications
- Adjust theme
- Export data

## Development Workflow

### Daily Usage

1. **Start backend**:
   ```bash
   cd backend
   ./start.sh  # or start.bat on Windows
   ```

2. **Start frontend** (new terminal):
   ```bash
   npm run dev
   ```

3. **Work on your tasks**

4. **Stop servers**: Press `Ctrl+C` in each terminal

### Making Changes

**Backend changes:**
- Edit files in `backend/app/`
- Server auto-reloads in debug mode
- Check logs for errors

**Frontend changes:**
- Edit files in `app/` or `components/`
- Next.js auto-reloads
- Check browser console for errors

## Learning Resources

### Documentation
- [Backend README](backend/README.md) - Architecture details
- [Backend Setup](backend/SETUP.md) - Detailed setup
- [Integration Guide](INTEGRATION.md) - Connect frontend/backend
- [Project Summary](PROJECT_SUMMARY.md) - Complete overview

### API Documentation
- Interactive docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### External Resources
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Gemini API Docs](https://ai.google.dev/docs)

## Tips & Best Practices

### Performance
- Use specific, clear task descriptions
- Monitor agent progress in real-time
- Check logs for optimization opportunities

### Cost Management
- Gemini has a free tier with generous limits
- Monitor API usage in settings
- Use shorter prompts when possible

### Debugging
- Check backend logs first
- Use browser DevTools for frontend issues
- Test API endpoints directly at `/docs`
- Review agent output snippets

### Customization
- Add new agents in `backend/app/agents/`
- Create custom plugins in `backend/app/tools/`
- Modify frontend components in `components/`

## Getting Help

### Self-Help
1. Check this guide
2. Review error messages
3. Check browser console
4. Review backend logs
5. Test API endpoints at `/docs`

### Documentation
- [README.md](README.md) - Project overview
- [backend/README.md](backend/README.md) - Backend details
- [INTEGRATION.md](INTEGRATION.md) - Integration guide

### Troubleshooting
- Review "Common Issues" section above
- Check environment variables
- Verify all dependencies installed
- Ensure ports are not blocked

## Success Checklist

You're ready to go when:

- [x] Backend starts without errors
- [x] Frontend loads successfully
- [x] Can create and execute tasks
- [x] Agents show real-time updates
- [x] Logs display correctly
- [x] No console errors
- [x] API documentation accessible
- [x] Health check passes

## What's Next?

### Immediate
1. ✅ System is running
2. 🎯 Create your first real task
3. 📊 Monitor agent collaboration
4. 🔍 Explore the dashboard features

### Short Term
- Experiment with different task types
- Enable/disable plugins
- Review execution logs
- Customize settings

### Long Term
- Add custom agents
- Create new plugins
- Integrate with your workflow
- Deploy to production

---

**Congratulations! 🎉**

You now have a fully functional Multi-Agent AI System. Start creating tasks and watch your AI agents collaborate!

**Need help?** Check the documentation or review the troubleshooting section above.
