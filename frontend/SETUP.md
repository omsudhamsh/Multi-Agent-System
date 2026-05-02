# Frontend Setup Guide

Complete setup instructions for the AgentOS Frontend.

## Prerequisites

- Node.js 18 or higher
- npm, pnpm, or yarn
- Backend running on http://localhost:8000

## Quick Setup (3 minutes)

### 1. Install Node.js

Check if Node.js is installed:

```bash
node --version
```

If not installed, download from [nodejs.org](https://nodejs.org/)

### 2. Install Dependencies

```bash
cd frontend

# Using npm
npm install

# Using pnpm (faster)
pnpm install

# Using yarn
yarn install
```

This will install all required packages (~500MB).

### 3. Configure Environment

Create `.env.local` file:

```bash
# Copy example file
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Start Development Server

```bash
# Using npm
npm run dev

# Using pnpm
pnpm dev

# Using yarn
yarn dev
```

You should see:

```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in 2.5s
```

### 5. Open in Browser

Visit http://localhost:3000

You should see the AgentOS dashboard!

## Detailed Setup

### Package Manager Choice

**npm** (comes with Node.js):
```bash
npm install
npm run dev
```

**pnpm** (faster, recommended):
```bash
npm install -g pnpm
pnpm install
pnpm dev
```

**yarn** (alternative):
```bash
npm install -g yarn
yarn install
yarn dev
```

### Environment Configuration

The frontend needs to know where the backend is running.

**Development** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Production** (`.env.production`):
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### Verify Setup

1. **Check backend is running**:
   ```bash
   curl http://localhost:8000/health
   ```

2. **Check frontend is running**:
   - Visit http://localhost:3000
   - Should see dashboard

3. **Check API connection**:
   - Open browser console (F12)
   - Look for any errors
   - Try creating a task

## Development Workflow

### Daily Usage

```bash
cd frontend
npm run dev
```

Keep this terminal open while developing.

### Making Changes

1. Edit files in `app/`, `components/`, or `lib/`
2. Save the file
3. Browser auto-refreshes
4. Check for errors in terminal or browser console

### Building for Production

```bash
npm run build
```

This creates an optimized build in `.next/` directory.

### Running Production Build Locally

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                    # Pages (Next.js App Router)
│   ├── page.tsx           # Dashboard (/)
│   ├── agents/page.tsx    # Agents page (/agents)
│   ├── tasks/page.tsx     # Tasks page (/tasks)
│   ├── plugins/page.tsx   # Plugins page (/plugins)
│   ├── logs/page.tsx      # Logs page (/logs)
│   └── settings/page.tsx  # Settings page (/settings)
│
├── components/            # React components
│   ├── dashboard/         # Dashboard components
│   ├── agents/            # Agent components
│   ├── plugins/           # Plugin components
│   └── ui/                # UI components (shadcn)
│
├── lib/                   # Utilities
│   ├── api.ts            # API client
│   ├── mock-data.ts      # Mock data
│   └── utils.ts          # Helpers
│
├── hooks/                 # Custom hooks
├── public/                # Static files
└── styles/                # CSS files
```

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Clear cache
rm -rf .next node_modules
npm install
```

## Troubleshooting

### Port 3000 already in use

**Solution 1**: Use different port
```bash
PORT=3001 npm run dev
```

**Solution 2**: Kill process on port 3000
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Module not found errors

```bash
# Clear and reinstall
rm -rf node_modules .next
npm install
```

### API connection errors

1. Check backend is running: `curl http://localhost:8000/health`
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check CORS in backend `.env`
4. Look at browser console for errors

### Build errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Slow installation

Use pnpm for faster installs:
```bash
npm install -g pnpm
pnpm install
```

### TypeScript errors

```bash
# Check TypeScript
npx tsc --noEmit

# Fix common issues
npm install --save-dev @types/node @types/react
```

## IDE Setup

### VS Code (Recommended)

Install extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

### Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Testing the Frontend

### Manual Testing

1. **Dashboard**:
   - Visit http://localhost:3000
   - Check all components load
   - Try creating a task

2. **Agents Page**:
   - Visit http://localhost:3000/agents
   - Check agents display
   - Verify status updates

3. **Tasks Page**:
   - Visit http://localhost:3000/tasks
   - Check task list
   - Try filtering

4. **Plugins Page**:
   - Visit http://localhost:3000/plugins
   - Check plugin cards
   - Try toggling plugins

5. **Logs Page**:
   - Visit http://localhost:3000/logs
   - Check logs display
   - Try filtering by level

6. **Settings Page**:
   - Visit http://localhost:3000/settings
   - Check all settings
   - Try changing theme

### Browser Console

Open DevTools (F12) and check:
- No errors in Console tab
- Network requests succeed
- No CORS errors

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

### Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy `.next` folder to Netlify

3. Set environment variables in Netlify dashboard

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t agentos-frontend .
docker run -p 3000:3000 agentos-frontend
```

## Performance Tips

### Optimize Images

Use `next/image`:
```tsx
import Image from 'next/image';

<Image src="/logo.png" width={200} height={200} alt="Logo" />
```

### Code Splitting

Use dynamic imports:
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```

### Reduce Bundle Size

```bash
# Analyze bundle
npm run build
# Check .next/analyze/
```

## Next Steps

1. ✅ Frontend is set up
2. ✅ Development server running
3. 🔄 Connect to backend (see [INTEGRATION.md](../INTEGRATION.md))
4. 🔄 Test all features
5. 🔄 Customize as needed

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

## Support

For issues:
- Check this guide
- Review error messages
- Check browser console
- Verify backend is running
- See [INTEGRATION.md](../INTEGRATION.md)
