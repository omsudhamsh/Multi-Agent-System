export type AgentStatus = 'idle' | 'working' | 'waiting' | 'error' | 'completed'

export interface Agent {
  id: string
  name: string
  role: string
  status: AgentStatus
  progress: number
  lastAction: string
  outputSnippet: string
  icon: string
}

export interface Task {
  id: string
  prompt: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  confidenceScore: number
  createdAt: string
  completedAt?: string
  agents: string[]
}

export interface Plugin {
  id: string
  name: string
  description: string
  icon: string
  category: string
  enabled: boolean
  connected: boolean
}

export interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'debug'
  agent: string
  message: string
}

export interface TimelineEvent {
  id: string
  agentId: string
  agentName: string
  action: string
  timestamp: string
  status: 'completed' | 'running' | 'pending'
}

export const agents: Agent[] = [
  {
    id: 'planner',
    name: 'Planner',
    role: 'Breaks tasks into steps',
    status: 'completed',
    progress: 100,
    lastAction: 'Created execution plan with 5 steps',
    outputSnippet: 'Step 1: Analyze requirements\nStep 2: Design architecture...',
    icon: 'ClipboardList'
  },
  {
    id: 'developer',
    name: 'Developer',
    role: 'Writes or improves code',
    status: 'working',
    progress: 65,
    lastAction: 'Implementing login component',
    outputSnippet: 'export function LoginForm() {\n  const [email, setEmail] = useState("")...',
    icon: 'Code2'
  },
  {
    id: 'tester',
    name: 'Tester',
    role: 'Checks for bugs and validates',
    status: 'waiting',
    progress: 0,
    lastAction: 'Waiting for Developer to complete',
    outputSnippet: 'Pending test execution...',
    icon: 'TestTube2'
  },
  {
    id: 'researcher',
    name: 'Researcher',
    role: 'Gathers useful information',
    status: 'completed',
    progress: 100,
    lastAction: 'Found 12 relevant resources',
    outputSnippet: 'Best practices for authentication:\n1. Use secure session tokens...',
    icon: 'Search'
  },
  {
    id: 'reviewer',
    name: 'Reviewer',
    role: 'Summarizes and validates results',
    status: 'idle',
    progress: 0,
    lastAction: 'Standing by',
    outputSnippet: 'No output yet',
    icon: 'CheckCircle2'
  },
  {
    id: 'memory',
    name: 'Memory',
    role: 'Stores project context',
    status: 'working',
    progress: 45,
    lastAction: 'Indexing project files',
    outputSnippet: 'Stored 23 context entries\nProject type: Next.js...',
    icon: 'Brain'
  },
  {
    id: 'tools',
    name: 'Tools',
    role: 'Connects plugins and actions',
    status: 'idle',
    progress: 0,
    lastAction: 'Ready to execute tools',
    outputSnippet: '5 plugins available',
    icon: 'Wrench'
  }
]

export const plugins: Plugin[] = [
  {
    id: 'web-search',
    name: 'Web Search',
    description: 'Search the web for real-time information and documentation',
    icon: 'Globe',
    category: 'Research',
    enabled: true,
    connected: true
  },
  {
    id: 'file-reader',
    name: 'File Reader',
    description: 'Read and parse files from your local filesystem',
    icon: 'FileText',
    category: 'Files',
    enabled: true,
    connected: true
  },
  {
    id: 'code-runner',
    name: 'Code Runner',
    description: 'Execute code snippets in isolated sandboxes',
    icon: 'Play',
    category: 'Development',
    enabled: true,
    connected: true
  },
  {
    id: 'github-sync',
    name: 'GitHub Sync',
    description: 'Push, pull, and manage repositories',
    icon: 'Github',
    category: 'Development',
    enabled: true,
    connected: false
  },
  {
    id: 'browser-automation',
    name: 'Browser Automation',
    description: 'Automate web interactions and scraping',
    icon: 'Monitor',
    category: 'Automation',
    enabled: false,
    connected: false
  },
  {
    id: 'database-connector',
    name: 'Database Connector',
    description: 'Connect to SQL and NoSQL databases',
    icon: 'Database',
    category: 'Data',
    enabled: true,
    connected: true
  },
  {
    id: 'pdf-parser',
    name: 'PDF Parser',
    description: 'Extract text and data from PDF documents',
    icon: 'FileType',
    category: 'Files',
    enabled: true,
    connected: true
  },
  {
    id: 'email-notifier',
    name: 'Email Notifier',
    description: 'Send email notifications and alerts',
    icon: 'Mail',
    category: 'Communication',
    enabled: false,
    connected: false
  },
  {
    id: 'calendar-integration',
    name: 'Calendar Integration',
    description: 'Sync with Google Calendar and Outlook',
    icon: 'Calendar',
    category: 'Productivity',
    enabled: false,
    connected: false
  },
  {
    id: 'image-generator',
    name: 'Image Generator',
    description: 'Generate images using AI models',
    icon: 'Image',
    category: 'AI',
    enabled: true,
    connected: true
  },
  {
    id: 'document-summarizer',
    name: 'Document Summarizer',
    description: 'Summarize long documents and articles',
    icon: 'FileSearch',
    category: 'AI',
    enabled: true,
    connected: true
  }
]

export const recentTasks: Task[] = [
  {
    id: 'task-1',
    prompt: 'Build a login page with email and password authentication',
    status: 'running',
    progress: 65,
    confidenceScore: 87,
    createdAt: '2024-01-15T10:30:00Z',
    agents: ['planner', 'developer', 'researcher']
  },
  {
    id: 'task-2',
    prompt: 'Refactor the API endpoints to use proper error handling',
    status: 'completed',
    progress: 100,
    confidenceScore: 94,
    createdAt: '2024-01-15T09:15:00Z',
    completedAt: '2024-01-15T09:45:00Z',
    agents: ['planner', 'developer', 'tester', 'reviewer']
  },
  {
    id: 'task-3',
    prompt: 'Test the payment integration with Stripe',
    status: 'completed',
    progress: 100,
    confidenceScore: 91,
    createdAt: '2024-01-14T16:00:00Z',
    completedAt: '2024-01-14T16:30:00Z',
    agents: ['tester', 'developer']
  },
  {
    id: 'task-4',
    prompt: 'Summarize the research paper on machine learning',
    status: 'failed',
    progress: 35,
    confidenceScore: 0,
    createdAt: '2024-01-14T14:00:00Z',
    agents: ['researcher', 'reviewer']
  }
]

export const logs: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2024-01-15T10:35:22Z',
    level: 'info',
    agent: 'Planner',
    message: 'Task analysis complete. Identified 5 execution steps.'
  },
  {
    id: 'log-2',
    timestamp: '2024-01-15T10:35:45Z',
    level: 'info',
    agent: 'Researcher',
    message: 'Found 12 relevant resources for authentication best practices.'
  },
  {
    id: 'log-3',
    timestamp: '2024-01-15T10:36:10Z',
    level: 'debug',
    agent: 'Developer',
    message: 'Starting implementation of LoginForm component.'
  },
  {
    id: 'log-4',
    timestamp: '2024-01-15T10:37:00Z',
    level: 'warning',
    agent: 'Developer',
    message: 'Consider adding rate limiting to prevent brute force attacks.'
  },
  {
    id: 'log-5',
    timestamp: '2024-01-15T10:38:15Z',
    level: 'info',
    agent: 'Memory',
    message: 'Stored project context: Next.js 14, TypeScript, Tailwind CSS.'
  },
  {
    id: 'log-6',
    timestamp: '2024-01-15T10:39:00Z',
    level: 'error',
    agent: 'Tools',
    message: 'GitHub Sync plugin not connected. Unable to push changes.'
  },
  {
    id: 'log-7',
    timestamp: '2024-01-15T10:40:30Z',
    level: 'info',
    agent: 'Developer',
    message: 'LoginForm component implementation 65% complete.'
  }
]

export const timeline: TimelineEvent[] = [
  {
    id: 'event-1',
    agentId: 'planner',
    agentName: 'Planner',
    action: 'Analyzed task requirements',
    timestamp: '10:30:15',
    status: 'completed'
  },
  {
    id: 'event-2',
    agentId: 'planner',
    agentName: 'Planner',
    action: 'Created execution plan',
    timestamp: '10:31:22',
    status: 'completed'
  },
  {
    id: 'event-3',
    agentId: 'researcher',
    agentName: 'Researcher',
    action: 'Searched for best practices',
    timestamp: '10:32:00',
    status: 'completed'
  },
  {
    id: 'event-4',
    agentId: 'researcher',
    agentName: 'Researcher',
    action: 'Compiled research findings',
    timestamp: '10:35:45',
    status: 'completed'
  },
  {
    id: 'event-5',
    agentId: 'developer',
    agentName: 'Developer',
    action: 'Started code implementation',
    timestamp: '10:36:10',
    status: 'completed'
  },
  {
    id: 'event-6',
    agentId: 'developer',
    agentName: 'Developer',
    action: 'Implementing LoginForm component',
    timestamp: '10:40:30',
    status: 'running'
  },
  {
    id: 'event-7',
    agentId: 'memory',
    agentName: 'Memory',
    action: 'Indexing project context',
    timestamp: '10:38:15',
    status: 'running'
  },
  {
    id: 'event-8',
    agentId: 'tester',
    agentName: 'Tester',
    action: 'Preparing test cases',
    timestamp: '10:41:00',
    status: 'pending'
  }
]

export const promptExamples = [
  'Build a login page',
  'Refactor this code',
  'Test my API',
  'Summarize this research',
  'Create a dashboard',
  'Debug this function'
]
