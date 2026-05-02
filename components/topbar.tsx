"use client"

import { useTheme } from "next-themes"
import { Search, Moon, Sun, Bell, ChevronDown, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"

const projects = [
  { id: '1', name: 'AgentOS Dashboard' },
  { id: '2', name: 'E-commerce App' },
  { id: '3', name: 'Portfolio Site' },
]

export function Topbar() {
  const { theme, setTheme } = useTheme()
  const isConnected = true // Mock API status

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <SidebarTrigger className="-ml-1" />
      
      {/* Project Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 font-medium">
            <span className="hidden sm:inline">AgentOS Dashboard</span>
            <span className="sm:hidden">Project</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {projects.map((project) => (
            <DropdownMenuItem key={project.id}>
              {project.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search */}
      <div className="relative flex-1 max-w-md hidden md:flex">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks, agents, logs..."
          className="pl-9 bg-secondary/50"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* API Status */}
        <Badge 
          variant={isConnected ? "default" : "destructive"} 
          className="gap-1.5 hidden sm:flex"
        >
          {isConnected ? (
            <>
              <Wifi className="size-3" />
              <span>API Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="size-3" />
              <span>Disconnected</span>
            </>
          )}
        </Badge>

        {/* Mobile Search */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="size-4" />
          <span className="sr-only">Search</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          <span className="sr-only">Notifications</span>
          <span className="absolute top-1 right-1 size-2 bg-primary rounded-full" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}
