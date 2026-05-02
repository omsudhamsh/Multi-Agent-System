"use client"

import { useState } from "react"
import { Send, Paperclip, Puzzle, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { promptExamples } from "@/lib/mock-data"

export function TaskInput() {
  const [prompt, setPrompt] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (!prompt.trim()) return
    setIsSubmitting(true)
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false)
      setPrompt("")
    }, 1000)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-6">
      <div className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Describe your task in plain English..."
            className="min-h-[120px] resize-none text-base bg-background pr-4"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSubmit()
              }
            }}
          />
        </div>

        {/* Example Prompts */}
        <div className="flex flex-wrap gap-2">
          {promptExamples.map((example) => (
            <Badge
              key={example}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => setPrompt(example)}
            >
              {example}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isSubmitting}
            className="gap-2 flex-1 sm:flex-none"
          >
            <Send className="size-4" />
            {isSubmitting ? "Starting..." : "Start Task"}
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="shrink-0">
              <Save className="size-4" />
              <span className="sr-only">Save as workflow</span>
            </Button>
            <Button variant="outline" size="icon" className="shrink-0">
              <Paperclip className="size-4" />
              <span className="sr-only">Attach files</span>
            </Button>
            <Button variant="outline" size="icon" className="shrink-0">
              <Puzzle className="size-4" />
              <span className="sr-only">Add plugin</span>
            </Button>
          </div>

          <span className="text-xs text-muted-foreground hidden sm:inline ml-auto">
            Press ⌘+Enter to submit
          </span>
        </div>
      </div>
    </div>
  )
}
