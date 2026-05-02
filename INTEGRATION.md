# Frontend-Backend Integration Guide

Complete guide for connecting the Next.js frontend with the Python backend.

## Overview

This guide shows how to integrate the AgentOS frontend (Next.js) with the backend (FastAPI).

## Architecture

```
┌─────────────────┐         HTTP/REST         ┌─────────────────┐
│                 │ ◄────────────────────────► │                 │
│  Next.js        │                            │  FastAPI        │
│  Frontend       │         JSON Data          │  Backend        │
│  (Port 3000)    │ ◄────────────────────────► │  (Port 8000)    │
│                 │                            │                 │
└─────────────────┘                            └─────────────────┘
```

## Step 1: Start the Backend

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -m app.main
```

Backend should be running on http://localhost:8000

## Step 2: Create API Client

Create `lib/api.ts` in your frontend:

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Task {
  id: string;
  prompt: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  confidenceScore: number;
  createdAt: string;
  completedAt?: string;
  agents: string[];
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'working' | 'waiting' | 'error' | 'completed';
  progress: number;
  lastAction: string;
  outputSnippet: string;
  icon: string;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  enabled: boolean;
  connected: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  agent: string;
  message: string;
}

// Tasks API
export async function createTask(prompt: string): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  
  if (!response.ok) {
    throw new Error('Failed to create task');
  }
  
  return response.json();
}

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/api/tasks`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  
  return response.json();
}

export async function getTask(taskId: string): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch task');
  }
  
  return response.json();
}

export async function getTaskResult(taskId: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/result`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch task result');
  }
  
  return response.json();
}

// Agents API
export async function getAgents(): Promise<Agent[]> {
  const response = await fetch(`${API_BASE_URL}/api/agents`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch agents');
  }
  
  return response.json();
}

export async function getAgent(agentId: string): Promise<Agent> {
  const response = await fetch(`${API_BASE_URL}/api/agents/${agentId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch agent');
  }
  
  return response.json();
}

// Plugins API
export async function getPlugins(): Promise<Plugin[]> {
  const response = await fetch(`${API_BASE_URL}/api/plugins`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch plugins');
  }
  
  return response.json();
}

export async function togglePlugin(pluginId: string, enabled: boolean): Promise<Plugin> {
  const response = await fetch(`${API_BASE_URL}/api/plugins/${pluginId}/toggle`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled })
  });
  
  if (!response.ok) {
    throw new Error('Failed to toggle plugin');
  }
  
  return response.json();
}

// Logs API
export async function getLogs(level: string = 'all', limit: number = 100): Promise<LogEntry[]> {
  const response = await fetch(`${API_BASE_URL}/api/logs?level=${level}&limit=${limit}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch logs');
  }
  
  return response.json();
}

// Health Check
export async function healthCheck(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/health`);
  
  if (!response.ok) {
    throw new Error('Backend is not healthy');
  }
  
  return response.json();
}
```

## Step 3: Update Task Input Component

Update `components/dashboard/task-input.tsx`:

```typescript
"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createTask } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function TaskInput() {
  const [prompt, setPrompt] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!prompt.trim()) return
    
    setIsSubmitting(true)
    
    try {
      const task = await createTask(prompt)
      
      toast({
        title: "Task Created",
        description: `Task ${task.id} has been started`,
      })
      
      setPrompt("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-6">
      <div className="space-y-4">
        <Textarea
          placeholder="Describe your task in plain English..."
          className="min-h-[120px]"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        
        <Button
          onClick={handleSubmit}
          disabled={!prompt.trim() || isSubmitting}
          className="gap-2"
        >
          <Send className="size-4" />
          {isSubmitting ? "Starting..." : "Start Task"}
        </Button>
      </div>
    </div>
  )
}
```

## Step 4: Update Agents Page

Update `app/agents/page.tsx` to fetch real data:

```typescript
"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AgentCard } from "@/components/dashboard/agent-card"
import { getAgents, type Agent } from "@/lib/api"

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAgents() {
      try {
        const data = await getAgents()
        setAgents(data)
      } catch (error) {
        console.error("Failed to fetch agents:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
    
    // Poll every 2 seconds for updates
    const interval = setInterval(fetchAgents, 2000)
    
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <DashboardLayout><div>Loading...</div></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        <h1 className="text-2xl font-bold">Agents</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
```

## Step 5: Add Environment Variable

Create `.env.local` in your frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Step 6: Test the Integration

1. **Start Backend**:
   ```bash
   cd backend
   python -m app.main
   ```

2. **Start Frontend**:
   ```bash
   cd ..  # back to root
   npm run dev
   ```

3. **Test**:
   - Visit http://localhost:3000
   - Enter a task in the input
   - Click "Start Task"
   - Watch agents update in real-time

## Real-time Updates with SSE

For streaming task updates, create a hook:

```typescript
// hooks/use-task-stream.ts
import { useEffect, useState } from 'react';
import type { Task } from '@/lib/api';

export function useTaskStream(taskId: string | null) {
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!taskId) return;

    const eventSource = new EventSource(
      `http://localhost:8000/api/tasks/${taskId}/stream`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTask(data);
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [taskId]);

  return task;
}
```

## Polling for Updates

For simpler real-time updates, use polling:

```typescript
// hooks/use-agents-polling.ts
import { useEffect, useState } from 'react';
import { getAgents, type Agent } from '@/lib/api';

export function useAgentsPolling(interval: number = 2000) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const data = await getAgents();
        setAgents(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      }
    }

    fetchAgents();
    const timer = setInterval(fetchAgents, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return { agents, loading };
}
```

## Error Handling

Add global error handling:

```typescript
// lib/api.ts
class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new APIError(response.status, `API Error: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new Error('Network error. Please check your connection.');
  }
}
```

## Testing Checklist

- [ ] Backend is running on port 8000
- [ ] Frontend is running on port 3000
- [ ] Can create tasks
- [ ] Agents update in real-time
- [ ] Plugins can be toggled
- [ ] Logs are displayed
- [ ] Error messages show properly
- [ ] CORS is configured correctly

## Troubleshooting

### CORS Errors

Update backend `.env`:
```env
CORS_ORIGINS=http://localhost:3000
```

### Connection Refused

- Check backend is running: `curl http://localhost:8000/health`
- Verify port 8000 is not blocked
- Check firewall settings

### Data Not Updating

- Check browser console for errors
- Verify API endpoints are correct
- Test endpoints directly: http://localhost:8000/docs

## Production Deployment

For production, update the API URL:

```env
# Frontend .env.production
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

And update backend CORS:

```env
# Backend .env
CORS_ORIGINS=https://your-frontend-domain.com
```

## Next Steps

1. ✅ Integration complete
2. Add authentication if needed
3. Implement WebSocket for real-time updates
4. Add error boundaries
5. Optimize polling intervals
6. Add loading states
7. Implement retry logic
