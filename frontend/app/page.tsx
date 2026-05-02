"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TaskInput } from "@/components/dashboard/task-input"
import { AgentCard } from "@/components/dashboard/agent-card"
import { ExecutionTimeline } from "@/components/dashboard/execution-timeline"
import { ProgressOverview } from "@/components/dashboard/progress-overview"
import { RecentTasks } from "@/components/dashboard/recent-tasks"
import { agents as mockAgents } from "@/lib/mock-data"
import { getAgents, getTasks, getTimeline, Task, Agent, TimelineEvent } from "@/lib/api"

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
              <h2 className="font-semibold text-lg">Active Agents</h2>
              <span className="text-sm text-muted-foreground">
                {agents.filter(a => a.status === 'working').length} working
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(agents.length > 0 ? agents : mockAgents).slice(0, 4).map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>

          {/* Timeline - Takes 1 column */}
          <div className="lg:col-span-1">
            <ExecutionTimeline timeline={timeline} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Remaining Agents (Compact) */}
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Other Agents</h2>
            <div className="space-y-2">
              {(agents.length > 0 ? agents : mockAgents).slice(4).map((agent) => (
                <AgentCard key={agent.id} agent={agent} compact />
              ))}
            </div>
          </div>

          {/* Recent Tasks */}
          <RecentTasks tasks={tasks} />
        </div>
      </div>
    </DashboardLayout>
  )
}
