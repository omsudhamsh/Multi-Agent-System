"use client"

import { CheckCircle2, XCircle, Loader2, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { recentTasks, type Task } from "@/lib/mock-data"

const statusConfig = {
  pending: {
    icon: Clock,
    label: 'Pending',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted'
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
    bgColor: 'bg-green-500/10'
  },
  failed: {
    icon: XCircle,
    label: 'Failed',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10'
  }
}

function TaskRow({ task }: { task: Task }) {
  const config = statusConfig[task.status]
  const StatusIcon = config.icon

  return (
    <div className="group flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
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
        <p className="font-medium text-sm line-clamp-1">{task.prompt}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {config.label}
          </Badge>
          {task.status === 'running' && (
            <span className="text-xs text-muted-foreground">{task.progress}%</span>
          )}
          {task.confidenceScore > 0 && (
            <span className="text-xs text-muted-foreground">
              Confidence: {task.confidenceScore}%
            </span>
          )}
        </div>
        {task.status === 'running' && (
          <Progress value={task.progress} className="h-1 mt-2" />
        )}
      </div>
      
      <div className="text-xs text-muted-foreground shrink-0">
        {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  )
}

export function RecentTasks() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Recent Tasks</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Your latest task executions</p>
        </div>
        <Badge variant="secondary">{recentTasks.length} tasks</Badge>
      </div>
      
      <ScrollArea className="h-[280px]">
        <div className="divide-y divide-border">
          {recentTasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
