"use client"

import { TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ProgressOverviewProps {
  progress: number
  confidenceScore: number
  completedSteps: number
  totalSteps: number
  estimatedTime: string
}

export function ProgressOverview({
  progress = 65,
  confidenceScore = 87,
  completedSteps = 4,
  totalSteps = 7,
  estimatedTime = "~3 min remaining"
}: Partial<ProgressOverviewProps>) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="font-semibold text-lg">Current Task Progress</h2>
          <p className="text-sm text-muted-foreground">Building a login page with authentication</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">{estimatedTime}</span>
          </div>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm font-bold">{progress}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="size-4" />
            <span className="text-xs">Confidence</span>
          </div>
          <p className="text-xl font-bold">{confidenceScore}%</p>
        </div>
        
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <CheckCircle className="size-4" />
            <span className="text-xs">Steps Done</span>
          </div>
          <p className="text-xl font-bold">{completedSteps}/{totalSteps}</p>
        </div>
        
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <AlertCircle className="size-4" />
            <span className="text-xs">Warnings</span>
          </div>
          <p className="text-xl font-bold">1</p>
        </div>
        
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Clock className="size-4" />
            <span className="text-xs">Elapsed</span>
          </div>
          <p className="text-xl font-bold">4:32</p>
        </div>
      </div>
    </div>
  )
}
