"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AgentCard } from "@/components/dashboard/agent-card"
import { AgentStats } from "@/components/agents/agent-stats"
import { AgentPerformanceChart } from "@/components/agents/agent-performance-chart"
import { getAgents, type Agent } from "@/lib/api"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  
  const fetchAgents = useCallback(async () => {
    try {
      const fetched = await getAgents()
      setAgents(fetched || [])
    } catch {
      setAgents([])
    }
  }, [])

  useEffect(() => {
    fetchAgents()
    const interval = setInterval(fetchAgents, 5000)
    return () => clearInterval(interval)
  }, [fetchAgents])

  const workingAgents = agents.filter(a => a.status === 'working').length
  const completedAgents = agents.filter(a => a.status === 'completed').length
  const idleAgents = agents.filter(a => a.status === 'idle').length

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            Agents
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center justify-center size-5 rounded-full bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mt-1">
                    <span className="sr-only">Info</span>
                    <i className="text-xs font-serif font-bold italic">i</i>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Detailed view of all AI agents and their current status.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage your AI agents
          </p>
        </div>

        {/* Stats */}
        <AgentStats 
          total={agents.length}
          working={workingAgents}
          completed={completedAgents}
          idle={idleAgents}
        />

        {/* Performance Chart */}
        <AgentPerformanceChart />

        {/* All Agents Grid */}
        <div>
          <h2 className="font-semibold text-lg mb-4">All Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {agents.length > 0 ? (
              agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 xl:col-span-3 text-center text-sm text-muted-foreground p-8">
                No agents available.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
