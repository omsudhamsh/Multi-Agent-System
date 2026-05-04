"use client"

import { useState, useEffect } from "react"
import { Loader2, FileText, CheckCircle2 } from "lucide-react"
import { getTaskResult } from "@/lib/api"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface TaskResultCardProps {
  taskId?: string
}

export function TaskResultCard({ taskId }: TaskResultCardProps) {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!taskId) {
      setResult(null)
      return
    }

    let isMounted = true
    setLoading(true)
    
    getTaskResult(taskId)
      .then((data) => {
        if (isMounted) {
          setResult(data)
        }
      })
      .catch((error) => {
        console.error("Failed to fetch task result:", error)
        if (isMounted) {
          setResult(null)
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [taskId])

  if (!taskId) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
        <FileText className="size-8 opacity-20 mb-3" />
        <p className="text-sm">No completed tasks yet.</p>
        <p className="text-xs mt-1">Start a task to see its final output here.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center justify-center">
        <Loader2 className="size-6 text-primary animate-spin mb-3" />
        <p className="text-sm text-muted-foreground">Fetching final results...</p>
      </div>
    )
  }

  if (!result || !result.results) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        <p className="text-sm">Results are not available for this task.</p>
      </div>
    )
  }

  // Extract the most meaningful output. Usually from developer or reviewer.
  const development = result.results.development?.implementation || result.results.development?.code || ""
  const review = result.results.review?.review || result.results.review?.summary || ""
  const research = result.results.research?.findings || result.results.research?.research || ""

  const finalOutput = development || review || research || "Task completed, but no printable output was found."

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col max-h-[600px]">
      <div className="p-4 border-b border-border flex items-center justify-between shrink-0 bg-muted/10">
        <div>
          <h2 className="font-semibold flex items-center gap-2">
            <CheckCircle2 className="size-4 text-green-500" />
            Final Output
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Result of your most recently completed task</p>
        </div>
      </div>
      <div className="p-4 md:p-6 overflow-y-auto flex-1 prose prose-sm dark:prose-invert max-w-none break-words custom-scrollbar">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {finalOutput}
        </ReactMarkdown>
      </div>
    </div>
  )
}
