"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const performanceData = [
  { time: '10:00', planner: 85, developer: 70, tester: 0, researcher: 90 },
  { time: '10:10', planner: 90, developer: 75, tester: 0, researcher: 95 },
  { time: '10:20', planner: 95, developer: 80, tester: 10, researcher: 100 },
  { time: '10:30', planner: 100, developer: 85, tester: 15, researcher: 100 },
  { time: '10:40', planner: 100, developer: 90, tester: 20, researcher: 100 },
  { time: '10:50', planner: 100, developer: 92, tester: 25, researcher: 100 },
  { time: '11:00', planner: 100, developer: 95, tester: 30, researcher: 100 },
]

export function AgentPerformanceChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-6">
      <div className="mb-4">
        <h2 className="font-semibold text-lg">Agent Performance</h2>
        <p className="text-sm text-muted-foreground">Task completion progress over time</p>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPlanner" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDeveloper" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTester" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorResearcher" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="planner" 
              stroke="hsl(var(--chart-1))" 
              fillOpacity={1} 
              fill="url(#colorPlanner)" 
              name="Planner"
            />
            <Area 
              type="monotone" 
              dataKey="developer" 
              stroke="hsl(var(--chart-2))" 
              fillOpacity={1} 
              fill="url(#colorDeveloper)" 
              name="Developer"
            />
            <Area 
              type="monotone" 
              dataKey="researcher" 
              stroke="hsl(var(--chart-4))" 
              fillOpacity={1} 
              fill="url(#colorResearcher)" 
              name="Researcher"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-chart-1" />
          <span className="text-xs text-muted-foreground">Planner</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-chart-2" />
          <span className="text-xs text-muted-foreground">Developer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-chart-4" />
          <span className="text-xs text-muted-foreground">Researcher</span>
        </div>
      </div>
    </div>
  )
}
