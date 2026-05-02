# AgentOS Frontend

Modern Next.js frontend for the AgentOS Multi-Agent AI System.

## Overview

The AgentOS frontend provides a beautiful, responsive dashboard for monitoring and managing multiple AI agents working together on tasks.

## Features

- 🎨 **Modern UI** - Built with Next.js 14, TypeScript, and Tailwind CSS
- 🌓 **Dark Mode** - Full dark mode support
- 📊 **Real-time Updates** - Live agent status and task progress
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎯 **Interactive Dashboard** - Monitor all agents and tasks
- 🔌 **Plugin Management** - Enable/disable plugins
- 📝 **Comprehensive Logging** - View detailed execution logs
- ⚙️ **Settings Panel** - Configure API and preferences

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React

## Prerequisites

- Node.js 18 or higher
- npm, pnpm, or yarn
- Backend running on http://localhost:8000

## Quick Start

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Configure Environment

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js app directory (routes)
│   ├── agents/            # Agents monitoring page
│   ├── tasks/             # Task management page
│   ├── plugins/           # Plugin marketplace page
│   ├── logs/              # Logs viewer page
│   ├── settings/          # Settings page
│   ├── projects/          # Projects page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard (home)
│   └── globals.css        # Global styles
│
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── task-input.tsx
│   │   ├── agent-card.tsx
│   │   ├── execution-timeline.tsx
│   │   ├── progress-overview.tsx
│   │   └── recent-tasks.tsx
│   ├── agents/            # Agent-specific components
│   │   ├── agent-stats.tsx
│   │   └── agent-performance-chart.tsx
│   ├── plugins/           # Plugin components
│   │   └── plugin-card.tsx
│   ├── ui/                # Reusable UI components (shadcn)
│   ├── app-sidebar.tsx    # Application sidebar
│   ├── topbar.tsx         # Top navigation bar
│   ├── dashboard-layout.tsx # Dashboard layout wrapper
│   └── theme-provider.tsx # Theme context provider
│
├── lib/                   # Utility functions
│   ├── api.ts            # API client (to be created)
│   ├── mock-data.ts      # Mock data for development
│   └── utils.ts          # Helper functions
│
├── hooks/                 # Custom React hooks
│   ├── use-mobile.ts     # Mobile detection hook
│   └── use-toast.ts      # Toast notification hook
│
├── public/                # Static assets
│   ├── icons/            # App icons
│   └── images/           # Images
│
├── styles/                # Additional styles
│   └── globals.css       # Global CSS
│
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── components.json       # shadcn/ui configuration
├── next.config.mjs       # Next.js configuration
├── package.json          # Dependencies
├── postcss.config.mjs    # PostCSS configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## Pages

### Dashboard (`/`)
- Overview of all agents and tasks
- Task input for creating new tasks
- Real-time agent status
- Execution timeline
- Recent tasks list

### Agents (`/agents`)
- Detailed view of all agents
- Agent performance charts
- Agent statistics
- Individual agent monitoring

### Tasks (`/tasks`)
- Complete task history
- Task filtering and search
- Task status tracking
- Task details and results

### Plugins (`/plugins`)
- Plugin marketplace
- Enable/disable plugins
- Plugin categories
- Connection status

### Logs (`/logs`)
- Detailed execution logs
- Log level filtering
- Timeline events
- Export functionality

### Settings (`/settings`)
- API configuration
- Theme preferences
- Notification settings
- Data management

## Development

### Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Environment Variables

Create `.env.local` in the frontend directory:

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### Connecting to Backend

The frontend expects the backend to be running on the URL specified in `NEXT_PUBLIC_API_URL`.

Make sure:
1. Backend is running (see `../backend/README.md`)
2. CORS is configured in backend `.env`
3. API URL is correct in frontend `.env.local`

## Building for Production

### Build

```bash
npm run build
```

This creates an optimized production build in `.next/` directory.

### Start Production Server

```bash
npm start
```

### Deploy

The frontend can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker**
- Any Node.js hosting

#### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Update environment variables in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## Customization

### Theme

Edit `app/globals.css` to customize colors:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  /* ... */
}
```

### Components

All UI components are in `components/ui/` and can be customized.

### Adding New Pages

1. Create a new folder in `app/`
2. Add `page.tsx` file
3. Use `DashboardLayout` wrapper
4. Add navigation link in `app-sidebar.tsx`

## API Integration

### Creating API Client

Create `lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function createTask(prompt: string) {
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  return response.json();
}

export async function getAgents() {
  const response = await fetch(`${API_BASE_URL}/api/agents`);
  return response.json();
}

// Add more API functions...
```

### Using API in Components

```typescript
"use client"

import { useEffect, useState } from 'react';
import { getAgents } from '@/lib/api';

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    async function fetchAgents() {
      const data = await getAgents();
      setAgents(data);
    }
    fetchAgents();
  }, []);

  return (
    <div>
      {agents.map(agent => (
        <div key={agent.id}>{agent.name}</div>
      ))}
    </div>
  );
}
```

## Troubleshooting

### "Module not found"

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### "API connection failed"

1. Check backend is running: `curl http://localhost:8000/health`
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check CORS settings in backend
4. Look for errors in browser console

### Build errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Port already in use

```bash
# Use different port
PORT=3001 npm run dev
```

## Performance

### Optimization Tips

- Use `next/image` for images
- Implement lazy loading
- Use React.memo for expensive components
- Optimize polling intervals
- Use SWR or React Query for data fetching

### Bundle Analysis

```bash
npm run build
# Check .next/analyze/ for bundle size
```

## Testing

### Unit Tests (Future)

```bash
npm test
```

### E2E Tests (Future)

```bash
npm run test:e2e
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

## Dependencies

### Core
- `next` - React framework
- `react` - UI library
- `typescript` - Type safety

### UI
- `tailwindcss` - Styling
- `@radix-ui/*` - UI primitives
- `lucide-react` - Icons
- `recharts` - Charts

### Utilities
- `clsx` - Class name utility
- `tailwind-merge` - Tailwind class merging
- `next-themes` - Theme management

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [TypeScript](https://www.typescriptlang.org/docs)

## Support

For issues or questions:
- Check the main [README](../README.md)
- Review [INTEGRATION.md](../INTEGRATION.md)
- Check backend is running properly

## License

MIT
