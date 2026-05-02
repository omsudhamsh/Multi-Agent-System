"use client"

import {
  ClipboardList,
  Code2,
  TestTube2,
  Search,
  CheckCircle2,
  Brain,
  Wrench,
  Pause,
  RotateCcw,
  Square,
  type LucideIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import type { Agent } from "@/lib/api"

type AgentStatus = Agent['status']

const iconMap: Record<string, LucideIcon> = {
  ClipboardList,
  Code2,
  TestTube2,
  Search,
  CheckCircle2,
  Brain,
  Wrench
}

const statusColors: Record<AgentStatus, string> = {
  idle: 'bg-muted-foreground',
  working: 'bg-primary animate-pulse',
  waiting: 'bg-yellow-500',
  error: 'bg-destructive',
  completed: 'bg-green-500'
}

const statusLabels: Record<AgentStatus, string> = {
  idle: 'Idle',
  working: 'Working',
  waiting: 'Waiting',
  error: 'Error',
  completed: 'Completed'
}

interface AgentCardProps {
  agent: Agent
  compact?: boolean
}

export function AgentCard({ agent, compact = false }: AgentCardProps) {
  const Icon = iconMap[agent.icon] || Brain

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
        <div className={cn(
          "flex items-center justify-center size-8 rounded-lg",
          agent.status === 'working' ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
        )}>
          <Icon className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">{agent.name}</span>
            <span className={cn("size-2 rounded-full shrink-0", statusColors[agent.status])} />
          </div>
          <p className="text-xs text-muted-foreground truncate">{agent.lastAction}</p>
        </div>
        {agent.status === 'working' && (
          <span className="text-xs font-medium text-primary">{agent.progress}%</span>
        )}
      </div>
    )
  }

  return (
    <div className="group relative rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center size-10 rounded-lg",
            agent.status === 'working' ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          )}>
            <Icon className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold">{agent.name}</h3>
            <p className="text-xs text-muted-foreground">{agent.role}</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="flex items-center gap-1.5">
          <span className={cn("size-2 rounded-full", statusColors[agent.status])} />
          <span className="text-xs font-medium">{statusLabels[agent.status]}</span>
        </div>
      </div>

      {/* Progress */}
      {(agent.status === 'working' || agent.status === 'completed') && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{agent.progress}%</span>
          </div>
          <Progress value={agent.progress} className="h-1.5" />
        </div>
      )}

      {/* Last Action */}
      <div className="mb-3">
        <p className="text-xs text-muted-foreground mb-1">Last Action</p>
        <p className="text-sm">{agent.lastAction}</p>
      </div>

      {/* Output Snippet */}
      <div className="mb-3">
        <p className="text-xs text-muted-foreground mb-1">Output</p>
        <pre className="text-xs bg-muted/50 rounded-md p-2 overflow-x-auto font-mono max-h-16 overflow-y-auto">
          {agent.outputSnippet}
        </pre>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-7" disabled={agent.status !== 'working'}
          onClick={() => toast({ title: `${agent.name} Paused`, description: `Agent "${agent.name}" has been paused.` })}>
          <Pause className="size-3" />
          Pause
        </Button>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-7" disabled={agent.status !== 'error'}
          onClick={() => toast({ title: `${agent.name} Retrying`, description: `Re-running "${agent.name}" agent.` })}>
          <RotateCcw className="size-3" />
          Retry
        </Button>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-7 text-destructive hover:text-destructive" disabled={agent.status === 'idle'}
          onClick={() => toast({ title: `${agent.name} Stopped`, description: `Agent "${agent.name}" has been stopped.`, variant: "destructive" })}>
          <Square className="size-3" />
          Stop
        </Button>
      </div>
    </div>
  )
}
