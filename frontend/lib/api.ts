/**
 * API Client for AgentOS Backend
 * 
 * This module provides functions to interact with the FastAPI backend.
 * All API calls are made to the URL specified in NEXT_PUBLIC_API_URL.
 */

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '');
// ============================================================================
// Types
// ============================================================================

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

export interface TimelineEvent {
  id: string;
  agentId: string;
  agentName: string;
  action: string;
  timestamp: string;
  status: 'completed' | 'running' | 'pending';
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  service: string;
}

export interface User {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

export interface Settings {
  apiKey: string;
  model: string;
  theme: string;
  notifications: {
    taskComplete: boolean;
    errors: boolean;
    updates: boolean;
  };
}

export interface AuthStatus {
  authenticated: boolean;
  user?: User;
}

// ============================================================================
// Error Handling
// ============================================================================

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new APIError(
        response.status,
        `API Error: ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new Error('Network error. Please check your connection and ensure the backend is running.');
  }
}

// ============================================================================
// Health Check
// ============================================================================

export async function healthCheck(): Promise<HealthStatus> {
  return fetchAPI<HealthStatus>(`${API_BASE_URL}/health`);
}

// ============================================================================
// Tasks API
// ============================================================================

export async function createTask(prompt: string): Promise<Task> {
  return fetchAPI<Task>(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });
}

export async function getTasks(): Promise<Task[]> {
  return fetchAPI<Task[]>(`${API_BASE_URL}/tasks`);
}

export async function getTask(taskId: string): Promise<Task> {
  return fetchAPI<Task>(`${API_BASE_URL}/tasks/${taskId}`);
}

export async function getTaskResult(taskId: string): Promise<any> {
  return fetchAPI<any>(`${API_BASE_URL}/tasks/${taskId}/result`);
}

export async function deleteTask(taskId: string): Promise<{ message: string }> {
  return fetchAPI<{ message: string }>(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
  });
}

/**
 * Stream task updates using Server-Sent Events
 * 
 * @param taskId - The task ID to stream
 * @param onUpdate - Callback function called with each update
 * @param onError - Callback function called on error
 * @returns Function to close the stream
 */
export function streamTaskUpdates(
  taskId: string,
  onUpdate: (task: Task) => void,
  onError?: (error: Error) => void
): () => void {
  const eventSource = new EventSource(
    `${API_BASE_URL}/tasks/${taskId}/stream`
  );

  eventSource.onmessage = (event) => {
    try {
      const task = JSON.parse(event.data);
      onUpdate(task);
    } catch (error) {
      console.error('Failed to parse task update:', error);
    }
  };

  eventSource.onerror = (error) => {
    console.error('SSE error:', error);
    if (onError) {
      onError(new Error('Stream connection error'));
    }
    eventSource.close();
  };

  // Return cleanup function
  return () => {
    eventSource.close();
  };
}

// ============================================================================
// Agents API
// ============================================================================

export async function getAgents(): Promise<Agent[]> {
  return fetchAPI<Agent[]>(`${API_BASE_URL}/agents`);
}

export async function getAgent(agentId: string): Promise<Agent> {
  return fetchAPI<Agent>(`${API_BASE_URL}/agents/${agentId}`);
}

// ============================================================================
// Plugins API
// ============================================================================

export async function getPlugins(): Promise<Plugin[]> {
  return fetchAPI<Plugin[]>(`${API_BASE_URL}/plugins`);
}

export async function getPlugin(pluginId: string): Promise<Plugin> {
  return fetchAPI<Plugin>(`${API_BASE_URL}/plugins/${pluginId}`);
}

export async function togglePlugin(
  pluginId: string,
  enabled: boolean
): Promise<Plugin> {
  return fetchAPI<Plugin>(`${API_BASE_URL}/plugins/${pluginId}/toggle`, {
    method: 'PUT',
    body: JSON.stringify({ enabled }),
  });
}

export async function connectPlugin(pluginId: string): Promise<Plugin> {
  return fetchAPI<Plugin>(`${API_BASE_URL}/plugins/${pluginId}/connect`, {
    method: 'POST',
  });
}

// ============================================================================
// Logs API
// ============================================================================

export async function getLogs(
  level: string = 'all',
  limit: number = 100
): Promise<LogEntry[]> {
  return fetchAPI<LogEntry[]>(
    `${API_BASE_URL}/logs?level=${level}&limit=${limit}`
  );
}

export async function getTimeline(limit: number = 50): Promise<TimelineEvent[]> {
  return fetchAPI<TimelineEvent[]>(
    `${API_BASE_URL}/logs/timeline?limit=${limit}`
  );
}

export async function clearLogs(): Promise<{ message: string }> {
  return fetchAPI<{ message: string }>(`${API_BASE_URL}/logs`, {
    method: 'DELETE',
  });
}

export async function clearTimeline(): Promise<{ message: string }> {
  return fetchAPI<{ message: string }>(`${API_BASE_URL}/logs/timeline`, {
    method: 'DELETE',
  });
}

// ============================================================================
// Settings API
// ============================================================================

export async function getSettings(): Promise<Settings> {
  return fetchAPI<Settings>(`${API_BASE_URL}/settings`);
}

export async function updateSettings(settings: Partial<Settings>): Promise<Settings> {
  return fetchAPI<Settings>(`${API_BASE_URL}/settings`, {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

// ============================================================================
// Auth API
// ============================================================================

export async function getAuthStatus(): Promise<AuthStatus> {
  // Pass credentials for session cookie
  return fetchAPI<AuthStatus>(`${API_BASE_URL}/auth/me`, {
    credentials: 'include' as RequestCredentials
  });
}

export function getGoogleLoginUrl(): string {
  return `${API_BASE_URL}/auth/login/google`;
}

export function getLogoutUrl(): string {
  return `${API_BASE_URL}/auth/logout`;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if the backend is reachable
 */
export async function isBackendReachable(): Promise<boolean> {
  try {
    await healthCheck();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the API base URL
 */
export function getAPIBaseURL(): string {
  return API_BASE_URL;
}
