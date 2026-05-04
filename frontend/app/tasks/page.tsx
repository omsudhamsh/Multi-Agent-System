"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Search, Filter, CheckCircle2, XCircle, Loader2, Clock } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { getTasks, type Task } from "@/lib/api"
import { useRouter } from "next/navigation"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const statusConfig = {
  pending: {
    icon: Clock,
    label: 'Pending',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    animate: false
  },
  running: {
    icon: Loader2,
    label: 'Running',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    animate: true
  },
  completed: {
    icon: CheckCircle2,
    label: 'Completed',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    animate: false
  },
  failed: {
    icon: XCircle,
    label: 'Failed',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    animate: false
  }
}


export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilters, setStatusFilters] = useState<Set<string>>(new Set(['pending', 'running', 'completed', 'failed']))
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    try {
      const fetched = await getTasks()
      setTasks(fetched || [])
    } catch {
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
    const interval = setInterval(fetchTasks, 5000)
    return () => clearInterval(interval)
  }, [fetchTasks])

  const allTasks = tasks || []

  const filteredTasks = allTasks.filter(t => {
    const matchesSearch = t.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilters.has(t.status)
    return matchesSearch && matchesStatus
  })

  const toggleStatus = (status: string) => {
    setStatusFilters(prev => {
      const next = new Set(prev)
      if (next.has(status)) next.delete(status)
      else next.add(status)
      return next
    })
  }

  const runningCount = allTasks.filter(t => t.status === 'running').length
  const completedCount = allTasks.filter(t => t.status === 'completed').length
  const failedCount = allTasks.filter(t => t.status === 'failed').length

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              Tasks
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center justify-center size-5 rounded-full bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mt-1">
                      <span className="sr-only">Info</span>
                      <i className="text-xs font-serif font-bold italic">i</i>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Manage and filter all tasks executed by the agents.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage all your AI task executions
            </p>
          </div>
          <Button className="gap-2" onClick={() => router.push("/")}>
            <Plus className="size-4" />
            New Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-2xl font-bold">{allTasks.length}</p>
            <p className="text-xs text-muted-foreground">Total Tasks</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Loader2 className="size-4 text-primary animate-spin" />
              <p className="text-2xl font-bold">{runningCount}</p>
            </div>
            <p className="text-xs text-muted-foreground">Running</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-500" />
              <p className="text-2xl font-bold">{completedCount}</p>
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <XCircle className="size-4 text-destructive" />
              <p className="text-2xl font-bold">{failedCount}</p>
            </div>
            <p className="text-xs text-muted-foreground">Failed</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-9 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center size-5 rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-help">
                      <span className="sr-only">Info</span>
                      <i className="text-xs font-serif font-bold italic">i</i>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search tasks by prompt or description.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 sm:w-auto">
                <Filter className="size-4" />
                Filters
                {statusFilters.size < 4 && (
                  <Badge variant="secondary" className="ml-1 size-5 p-0 flex items-center justify-center text-[10px]">
                    {statusFilters.size}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['pending', 'running', 'completed', 'failed'].map(status => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilters.has(status)}
                  onCheckedChange={() => toggleStatus(status)}
                  className="capitalize"
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tasks List */}
        <div className="rounded-xl border border-border bg-card">
          <ScrollArea className="h-[500px]">
            <div className="divide-y divide-border">
              {filteredTasks.map((task) => {
                const config = statusConfig[task.status]
                const StatusIcon = config.icon

                return (
                  <div key={task.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "flex items-center justify-center size-10 rounded-lg shrink-0",
                        config.bgColor
                      )}>
                        <StatusIcon className={cn(
                          "size-5",
                          config.color,
                          config.animate && "animate-spin"
                        )} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <p className="font-medium">{task.prompt}</p>
                          <Badge variant="outline" className="shrink-0">
                            {config.label}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span suppressHydrationWarning>
                            {new Date(task.createdAt).toLocaleDateString()} at{' '}
                            {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {task.confidenceScore > 0 && (
                            <span>Confidence: {task.confidenceScore}%</span>
                          )}
                          <span>{task.agents.length} agents involved</span>
                        </div>

                        {task.status === 'running' && (
                          <div className="mt-3">
                            <Progress value={task.progress} className="h-1.5" />
                            <span className="text-xs text-muted-foreground mt-1 block">
                              {task.progress}% complete
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              {filteredTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Search className="size-10 mb-4 text-muted-foreground opacity-30" />
                  <p className="text-muted-foreground">No tasks match your search or filters</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </DashboardLayout>
  )
}
