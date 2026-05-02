# ⚠️ IMPORTANT: Add Your Gemini API Key

## Backend is 95% Ready! Just One More Step:

### 1. Get Your FREE Gemini API Key

Visit: **https://makersuite.google.com/app/apikey**

1. Sign in with your Google account
2. Click **"Create API Key"**
3. Copy the key (it starts with `AIza...`)

### 2. Add the Key to Backend

Open the file: **`backend/.env`**

Find this line:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace `your_gemini_api_key_here` with your actual key:
```env
GEMINI_API_KEY=AIzaSyAbc123...your_actual_key_here
```

**Save the file!**

---

## Then Start the Servers:

### Terminal 1 - Start Backend:

```powershell
cd backend
.\venv\Scripts\activate
python -m app.main
```

Wait for: `INFO: Uvicorn running on http://0.0.0.0:8000`

### Terminal 2 - Start Frontend:

```powershell
cd frontend
npm run dev
```

Wait for: `▲ Next.js 14.x.x - Local: http://localhost:3000`

---

## Open in Browser:

Visit: **http://localhost:3000**

You should see the AgentOS dashboard! 🎉

---

## Quick Test:

1. Enter a task: `"Create a simple calculator function"`
2. Click **"Start Task"**
3. Watch the agents work together!

---

**That's it! You're ready to use AgentOS!** 🚀
