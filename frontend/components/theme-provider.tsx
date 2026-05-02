'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'

// Suppress the false-positive React 19 warning about script tags.
// next-themes intentionally injects an inline <script> during SSR
// to prevent theme flash (FOUC). React 19 warns about it but the
// script is correct and executes as intended. This is a known issue:
// https://github.com/pacocoursey/next-themes/issues/337
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const origConsoleError = console.error
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) {
      return // suppress this specific false positive
    }
    origConsoleError.apply(console, args)
  }
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
