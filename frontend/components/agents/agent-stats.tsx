"use client"

import { Bot, Loader2, CheckCircle2, Clock } from "lucide-react"

interface AgentStatsProps {
  total: number
  working: number
  completed: number
  idle: number
}

export function AgentStats({ total, working, completed, idle }: AgentStatsProps) {
  const stats = [
    {
      label: 'Total Agents',
      value: total,
      icon: Bot,
      color: 'text-foreground',
      bgColor: 'bg-muted'
    },
    {
      label: 'Working',
      value: working,
      icon: Loader2,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Idle',
      value: idle,
      icon: Clock,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center size-10 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`size-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
