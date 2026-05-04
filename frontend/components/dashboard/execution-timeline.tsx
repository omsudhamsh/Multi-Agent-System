"use client"

import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { TimelineEvent } from "@/lib/api"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const agentColors: Record<string, string> = {
  planner: 'text-blue-500',
  developer: 'text-primary',
  tester: 'text-yellow-500',
  researcher: 'text-green-500',
  reviewer: 'text-orange-500',
  memory: 'text-pink-500',
  tools: 'text-cyan-500'
}

export function ExecutionTimeline({ timeline }: { timeline: TimelineEvent[] }) {
  const displayTimeline = timeline || []

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-semibold flex items-center gap-2">
            Execution Timeline
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center justify-center size-5 rounded-full bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                    <span className="sr-only">Info</span>
                    <i className="text-xs font-serif font-bold italic">i</i>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Real-time log of agent activities and states.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Live agent activity</p>
        </div>
      </div>
      
      <ScrollArea className="h-[300px]">
        <div className="p-4">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
            
            {/* Events */}
            <div className="space-y-4">
              {displayTimeline.length > 0 ? (
                displayTimeline.map((event, index) => (
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
                      <div className="mt-1.5 text-sm text-muted-foreground bg-muted/20 p-3 rounded-md border border-border/50 max-h-[500px] overflow-y-auto prose prose-sm dark:prose-invert max-w-none break-words">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {event.action}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground pt-4 text-center">
                  No timeline events to display
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
