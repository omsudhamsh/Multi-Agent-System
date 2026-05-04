"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Search, Moon, Sun, Bell, ChevronDown, Wifi, WifiOff, X, CheckCircle2, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/hooks/use-toast"

const projects = [
  { id: '1', name: 'AgentOS Dashboard' },
  { id: '2', name: 'E-commerce App' },
  { id: '3', name: 'Portfolio Site' },
]

interface Notification {
  id: string
  type: 'success' | 'warning' | 'info'
  title: string
  message: string
  time: string
}

const defaultNotifications: Notification[] = [
  { id: '1', type: 'success', title: 'Task Completed', message: 'Build a REST API executed successfully', time: '2 min ago' },
  { id: '2', type: 'info', title: 'System Update', message: 'AgentOS v1.1 is now available', time: '1 hour ago' },
  { id: '3', type: 'warning', title: 'API Rate Limit', message: 'Approaching Groq API rate limit (80%)', time: '3 hours ago' },
]

const notifIcons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
}

const notifColors = {
  success: 'text-green-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
}

export function Topbar() {
  const { theme, setTheme } = useTheme()
  const isConnected = true
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications)
  const [notifOpen, setNotifOpen] = useState(false)
  const [activeProject, setActiveProject] = useState(projects[0])

  const handleProjectSelect = (project: typeof projects[0]) => {
    setActiveProject(project)
    toast({
      title: "Project Switched",
      description: `You are now viewing ${project.name}.`,
    })
  }

  const dismissNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
    setNotifOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <SidebarTrigger className="-ml-1" />
      
      {/* Project Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 font-medium">
            <span className="hidden sm:inline">{activeProject.name}</span>
            <span className="sm:hidden">Project</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {projects.map((project) => (
            <DropdownMenuItem 
              key={project.id}
              onClick={() => handleProjectSelect(project)}
              className={project.id === activeProject.id ? "bg-muted" : ""}
            >
              {project.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search */}
      <div className="relative flex-1 max-w-md hidden md:flex items-center">
        <Search className="absolute left-3 size-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks, agents, logs..."
          className="pl-9 pr-10 bg-secondary/50"
        />
        <div className="absolute right-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center size-5 rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-help">
                  <span className="sr-only">Info</span>
                  <i className="text-xs font-serif font-bold italic">i</i>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quick search across all tasks, agents, and logs.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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

        {/* Notifications */}
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-4" />
              <span className="sr-only">Notifications</span>
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 size-4 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center font-medium">
                  {notifications.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h4 className="font-semibold text-sm">Notifications</h4>
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" className="text-xs h-6" onClick={clearAll}>
                  Clear all
                </Button>
              )}
            </div>
            <ScrollArea className="max-h-[300px]">
              {notifications.length > 0 ? (
                <div className="p-1">
                  {notifications.map((notif) => {
                    const NotifIcon = notifIcons[notif.type]
                    return (
                      <div key={notif.id} className="flex items-start gap-3 p-3 rounded-md hover:bg-muted/50 group">
                        <NotifIcon className={`size-4 mt-0.5 shrink-0 ${notifColors[notif.type]}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                        </div>
                        <button
                          onClick={() => dismissNotif(notif.id)}
                          className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="size-8 mx-auto mb-2 text-muted-foreground opacity-30" />
                  <p className="text-sm text-muted-foreground">All caught up!</p>
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>

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

