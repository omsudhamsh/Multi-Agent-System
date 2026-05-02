import { DashboardLayout } from "@/components/dashboard-layout"
import { AgentCard } from "@/components/dashboard/agent-card"
import { AgentStats } from "@/components/agents/agent-stats"
import { AgentPerformanceChart } from "@/components/agents/agent-performance-chart"
import { agents } from "@/lib/mock-data"

export default function AgentsPage() {
  const workingAgents = agents.filter(a => a.status === 'working').length
  const completedAgents = agents.filter(a => a.status === 'completed').length
  const idleAgents = agents.filter(a => a.status === 'idle').length

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Agents</h1>
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
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
