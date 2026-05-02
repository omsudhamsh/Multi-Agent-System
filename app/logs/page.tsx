"use client"

import { useState } from "react"
import { Search, Filter, AlertCircle, AlertTriangle, Info, Bug, Download } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { logs as initialLogs, type LogEntry } from "@/lib/mock-data"

const levelConfig = {
  info: {
    icon: Info,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    label: 'Info'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    label: 'Warning'
  },
  error: {
    icon: AlertCircle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    label: 'Error'
  },
  debug: {
    icon: Bug,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    label: 'Debug'
  }
}

const levels = ['all', 'info', 'warning', 'error', 'debug'] as const

function LogRow({ log }: { log: LogEntry }) {
  const config = levelConfig[log.level]
  const LevelIcon = config.icon

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0">
      <div className={cn(
        "flex items-center justify-center size-8 rounded-lg shrink-0",
        config.bgColor
      )}>
        <LevelIcon className={cn("size-4", config.color)} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <Badge variant="outline" className="text-xs">
            {log.agent}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(log.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <p className="text-sm font-mono">{log.message}</p>
      </div>
    </div>
  )
}

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeLevel, setActiveLevel] = useState<typeof levels[number]>("all")

  const filteredLogs = initialLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.agent.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = activeLevel === "all" || log.level === activeLevel
    return matchesSearch && matchesLevel
  })

  const errorCount = initialLogs.filter(l => l.level === 'error').length
  const warningCount = initialLogs.filter(l => l.level === 'warning').length

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Logs</h1>
            <p className="text-muted-foreground mt-1">
              Monitor agent activity and debug issues
            </p>
          </div>
          <div className="flex items-center gap-3">
            {errorCount > 0 && (
              <Badge variant="destructive" className="gap-1.5">
                <AlertCircle className="size-3" />
                {errorCount} Errors
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="secondary" className="gap-1.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
                <AlertTriangle className="size-3" />
                {warningCount} Warnings
              </Badge>
            )}
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="size-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-9 font-mono text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {levels.map((level) => (
              <Badge
                key={level}
                variant={activeLevel === level ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() => setActiveLevel(level)}
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>

        {/* Logs List */}
        <div className="rounded-xl border border-border bg-card">
          <ScrollArea className="h-[600px]">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <LogRow key={log.id} log={log} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="size-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">No logs found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </DashboardLayout>
  )
}
