# Frontend Troubleshooting Guide

Common issues and solutions for the AgentOS frontend.

## TypeScript Errors

### "Cannot find name 'process'"

**Error:**
```
Cannot find name 'process'. Do you need to install type definitions for node?
Try `npm i --save-dev @types/node`.
```

**Solution:**

1. Install Node.js type definitions:
   ```bash
   npm install --save-dev @types/node
   ```

2. Verify `tsconfig.json` includes Node types (already configured):
   ```json
   {
     "compilerOptions": {
       "types": ["node"]
     }
   }
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

**Why this happens:**
- TypeScript doesn't recognize Node.js globals like `process` without type definitions
- Next.js uses `process.env` for environment variables
- The `@types/node` package provides TypeScript definitions for Node.js

---

## Module Not Found Errors

### "Module not found: Can't resolve '@/...'"

**Solution:**

1. Check `tsconfig.json` has the correct path alias:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```

2. Restart the development server

---

## Environment Variable Issues

### Environment variables are undefined

**Problem:** `process.env.NEXT_PUBLIC_API_URL` returns `undefined`

**Solution:**

1. Create `.env.local` file in the `frontend/` directory:
   ```bash
   cp .env.example .env.local
   ```

2. Add your variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Important:** Environment variables must start with `NEXT_PUBLIC_` to be accessible in the browser

4. Restart the development server (required after changing env files)

---

## API Connection Errors

### "Network error. Please check your connection"

**Causes:**
1. Backend is not running
2. Wrong API URL
3. CORS issues

**Solutions:**

1. **Check backend is running:**
   ```bash
   curl http://localhost:8000/health
   ```
   Should return: `{"status": "healthy", ...}`

2. **Verify API URL in `.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Check CORS in backend `.env`:**
   ```env
   CORS_ORIGINS=http://localhost:3000
   ```

4. **Check browser console** for specific error messages

---

## Build Errors

### "Error: Failed to compile"

**Solution:**

1. Clear Next.js cache:
   ```bash
   rm -rf .next
   ```

2. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

3. Check for TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```

---

## Port Already in Use

### "Port 3000 is already in use"

**Solution:**

**Option 1:** Use a different port
```bash
PORT=3001 npm run dev
```

**Option 2:** Kill the process using port 3000

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

---

## Dependency Issues

### "Cannot find module" after installing packages

**Solution:**

1. Clear package manager cache:
   ```bash
   npm cache clean --force
   ```

2. Delete and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. If using pnpm:
   ```bash
   pnpm store prune
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

---

## Hot Reload Not Working

### Changes not reflecting in browser

**Solution:**

1. Check if you're editing the correct file (should be in `frontend/` directory)

2. Hard refresh the browser:
   - Windows/Linux: `Ctrl + Shift + R`
   - macOS: `Cmd + Shift + R`

3. Restart the development server

4. Clear browser cache

---

## Styling Issues

### Tailwind classes not working

**Solution:**

1. Check `tailwind.config.ts` includes your files:
   ```typescript
   content: [
     "./app/**/*.{js,ts,jsx,tsx,mdx}",
     "./components/**/*.{js,ts,jsx,tsx,mdx}",
   ]
   ```

2. Restart development server

3. Check if PostCSS is configured (`postcss.config.mjs`)

---

## Performance Issues

### Slow page loads or builds

**Solutions:**

1. **Optimize images:**
   - Use `next/image` component
   - Compress images before adding

2. **Reduce bundle size:**
   ```bash
   npm run build
   # Check .next/analyze/ for bundle analysis
   ```

3. **Use dynamic imports:**
   ```typescript
   import dynamic from 'next/dynamic';
   const HeavyComponent = dynamic(() => import('./HeavyComponent'));
   ```

4. **Clear cache:**
   ```bash
   rm -rf .next node_modules
   npm install
   ```

---

## IDE Issues

### VS Code not recognizing imports

**Solution:**

1. Reload VS Code window:
   - Press `Ctrl/Cmd + Shift + P`
   - Type "Reload Window"

2. Check TypeScript version:
   - Open any `.ts` file
   - Click TypeScript version in bottom right
   - Select "Use Workspace Version"

3. Install recommended extensions:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense

---

## Common Mistakes

### 1. Wrong directory

**Problem:** Running commands in wrong directory

**Solution:** Always run frontend commands from `frontend/` directory:
```bash
cd frontend
npm run dev
```

### 2. Missing environment file

**Problem:** `.env.local` doesn't exist

**Solution:**
```bash
cp .env.example .env.local
```

### 3. Backend not running

**Problem:** Frontend can't connect to API

**Solution:** Start backend first:
```bash
cd backend
python -m app.main
```

### 4. Outdated dependencies

**Problem:** Using old package versions

**Solution:**
```bash
npm update
# or
npm install <package>@latest
```

---

## Getting Help

If you're still stuck:

1. **Check error messages carefully** - They usually tell you what's wrong

2. **Check browser console** (F12) - Look for errors and warnings

3. **Check terminal output** - Development server shows errors

4. **Review documentation:**
   - [Frontend README](README.md)
   - [Setup Guide](SETUP.md)
   - [Integration Guide](../INTEGRATION.md)

5. **Verify backend is working:**
   ```bash
   curl http://localhost:8000/health
   ```

6. **Check versions:**
   ```bash
   node --version  # Should be 18+
   npm --version
   ```

---

## Quick Fixes Checklist

When something goes wrong, try these in order:

- [ ] Restart development server
- [ ] Hard refresh browser (Ctrl/Cmd + Shift + R)
- [ ] Check backend is running
- [ ] Verify `.env.local` exists and is correct
- [ ] Clear Next.js cache: `rm -rf .next`
- [ ] Reinstall dependencies: `rm -rf node_modules && npm install`
- [ ] Check for TypeScript errors: `npx tsc --noEmit`
- [ ] Review error messages in terminal and browser console

---

## Prevention Tips

1. **Always use the correct directory:**
   - Frontend commands: `cd frontend`
   - Backend commands: `cd backend`

2. **Keep dependencies updated:**
   ```bash
   npm update
   ```

3. **Use environment variables properly:**
   - Browser: `NEXT_PUBLIC_*`
   - Server: Any name

4. **Restart after config changes:**
   - `.env.local` changes
   - `tsconfig.json` changes
   - `next.config.mjs` changes

5. **Check backend first:**
   - Always ensure backend is running
   - Test with `curl http://localhost:8000/health`
