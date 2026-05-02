"use client"

import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { timeline } from "@/lib/mock-data"
import { ScrollArea } from "@/components/ui/scroll-area"

const agentColors: Record<string, string> = {
  planner: 'text-blue-500',
  developer: 'text-primary',
  tester: 'text-yellow-500',
  researcher: 'text-green-500',
  reviewer: 'text-orange-500',
  memory: 'text-pink-500',
  tools: 'text-cyan-500'
}

export function ExecutionTimeline() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold">Execution Timeline</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Live agent activity</p>
      </div>
      
      <ScrollArea className="h-[300px]">
        <div className="p-4">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
            
            {/* Events */}
            <div className="space-y-4">
              {timeline.map((event, index) => (
                <div key={event.id} className="relative flex gap-3">
                  {/* Status Icon */}
                  <div className="relative z-10 shrink-0">
                    {event.status === 'completed' ? (
                      <CheckCircle2 className="size-6 text-green-500 bg-card" />
                    ) : event.status === 'running' ? (
                      <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <Loader2 className="size-4 text-primary animate-spin" />
                      </div>
                    ) : (
                      <Circle className="size-6 text-muted-foreground bg-card" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn(
                        "text-sm font-medium",
                        agentColors[event.agentId] || 'text-foreground'
                      )}>
                        {event.agentName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {event.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{event.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
