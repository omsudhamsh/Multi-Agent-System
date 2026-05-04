"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TaskInput } from "@/components/dashboard/task-input"
import { AgentCard } from "@/components/dashboard/agent-card"
import { ExecutionTimeline } from "@/components/dashboard/execution-timeline"
import { ProgressOverview } from "@/components/dashboard/progress-overview"
import { RecentTasks } from "@/components/dashboard/recent-tasks"
import { TaskResultCard } from "@/components/dashboard/task-result-card"
import { getAgents, getTasks, getTimeline, Task, Agent, TimelineEvent } from "@/lib/api"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [fetchedAgents, fetchedTasks, fetchedTimeline] = await Promise.all([
        getAgents(),
        getTasks(),
        getTimeline()
      ])
      setAgents(fetchedAgents)
      setTasks(fetchedTasks)
      setTimeline(fetchedTimeline)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    // Poll for updates every 3 seconds for "real-time" feel
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [fetchData])

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev])
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Assign tasks and monitor your AI agents in real-time
          </p>
        </div>

        {/* Task Input */}
        <TaskInput onTaskCreated={handleTaskCreated} />

        {/* Progress Overview */}
        {tasks.length > 0 && tasks[0].status === 'running' && (
          <ProgressOverview 
            progress={tasks[0].progress}
            confidenceScore={tasks[0].confidenceScore}
            totalSteps={tasks[0].agents.length}
            completedSteps={Math.floor((tasks[0].progress / 100) * tasks[0].agents.length)}
          />
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Status - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                Active Agents
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center justify-center size-5 rounded-full bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <span className="sr-only">Info</span>
                        <i className="text-xs font-serif font-bold italic">i</i>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View the real-time status of all active agents.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h2>
              <span className="text-sm text-muted-foreground">
                {agents.filter(a => a.status === 'working').length || 0} working · {agents.length} total
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.length > 0 ? (
                agents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 text-center text-sm text-muted-foreground p-8">
                  No agents available. Ensure the backend is running.
                </div>
              )}
            </div>
          </div>

          {/* Timeline - Takes 1 column */}
          <div className="lg:col-span-1">
            <ExecutionTimeline timeline={timeline} />
          </div>
        </div>

        {/* Results & Recent Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TaskResultCard 
            taskId={tasks.find(t => t.status === 'completed' || t.status === 'failed')?.id} 
          />
          <RecentTasks tasks={tasks} />
        </div>
      </div>
    </DashboardLayout>
  )
}
