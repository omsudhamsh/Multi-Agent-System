# 🚀 Start AgentOS - Quick Guide

Follow these steps to get AgentOS running in under 5 minutes!

## ⚠️ IMPORTANT: Get Your Gemini API Key First

Before starting, you need a **free** Google Gemini API key:

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (starts with `AIza...`)
5. Keep it ready - you'll need it in Step 2

---

## Step 1: Setup Backend (2 minutes)

### Windows:

```powershell
cd backend

# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate

# Install dependencies (this takes ~1 minute)
pip install -r requirements.txt
```

### macOS/Linux:

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

## Step 2: Add Your API Key

Edit `backend/.env` file and replace `your_gemini_api_key_here` with your actual API key:

```env
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

**How to edit:**
- Open `backend/.env` in any text editor (Notepad, VS Code, etc.)
- Replace the placeholder with your key
- Save the file

---

## Step 3: Start Backend

Keep the terminal open and run:

```bash
# Make sure you're in backend directory and venv is activated
python -m app.main
```

You should see:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ **Backend is running!** Keep this terminal open.

---

## Step 4: Setup Frontend (1 minute)

Open a **NEW terminal** window:

```bash
cd frontend

# Install dependencies (this takes ~1 minute)
npm install
```

---

## Step 5: Start Frontend

In the same terminal:

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

✅ **Frontend is running!**

---

## Step 6: Open in Browser

Visit: **http://localhost:3000**

You should see the AgentOS dashboard! 🎉

---

## Quick Test

1. In the dashboard, enter a task like:
   ```
   Create a simple calculator function
   ```

2. Click **"Start Task"**

3. Watch the agents collaborate in real-time!

---

## Troubleshooting

### Backend won't start

**Error: "GEMINI_API_KEY not found"**
- Make sure you edited `backend/.env` with your real API key
- No quotes needed around the key
- Restart the backend after editing

**Error: "Module not found"**
- Make sure virtual environment is activated
- Run: `pip install -r requirements.txt`

**Error: "Port 8000 already in use"**
- Another process is using port 8000
- Kill it or use a different port

### Frontend won't start

**Error: "Cannot find module"**
- Run: `npm install` in the frontend directory

**Error: "Port 3000 already in use"**
- Run: `PORT=3001 npm run dev`

### Can't connect to backend

1. Check backend is running: `curl http://localhost:8000/health`
2. Should return: `{"status": "healthy", ...}`
3. If not, restart the backend

---

## Stopping the Servers

Press `Ctrl+C` in each terminal to stop the servers.

---

## Next Steps

Once everything is running:

1. ✅ Create tasks and watch agents work
2. ✅ Visit http://localhost:3000/agents to monitor agents
3. ✅ Visit http://localhost:3000/tasks to see task history
4. ✅ Visit http://localhost:3000/logs to view detailed logs
5. ✅ Visit http://localhost:8000/docs to see API documentation

---

## Need More Help?

- **Backend Setup**: See `backend/SETUP.md`
- **Frontend Setup**: See `frontend/SETUP.md`
- **Integration**: See `INTEGRATION.md`
- **Troubleshooting**: See `frontend/TROUBLESHOOTING.md`

---

## Summary

```
Terminal 1 (Backend):
cd backend
venv\Scripts\activate  # or source venv/bin/activate
python -m app.main

Terminal 2 (Frontend):
cd frontend
npm run dev

Browser:
http://localhost:3000
```

**That's it! You're ready to use AgentOS! 🚀**
