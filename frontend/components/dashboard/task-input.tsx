"use client"

import { useState, useRef, useCallback } from "react"
import { Send, Paperclip, Puzzle, Save, X, FileText, Image, File, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { promptExamples, plugins as allPlugins } from "@/lib/mock-data"
import { createTask, Task, getPlugins } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

// ============================================================================
// Types
// ============================================================================

interface AttachedFile {
  id: string
  name: string
  size: number
  type: string
}

interface SavedWorkflow {
  id: string
  name: string
  prompt: string
  plugins: string[]
  createdAt: string
}

interface PluginOption {
  id: string
  name: string
  icon: string
  category: string
  enabled: boolean
  connected: boolean
  selected: boolean
}

// ============================================================================
// Helpers
// ============================================================================

const WORKFLOWS_STORAGE_KEY = "agentos_saved_workflows"

function getSavedWorkflows(): SavedWorkflow[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(WORKFLOWS_STORAGE_KEY) || "[]")
  } catch {
    return []
  }
}

function saveWorkflows(workflows: SavedWorkflow[]) {
  localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(workflows))
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return Image
  if (type.includes("pdf") || type.includes("text") || type.includes("document")) return FileText
  return File
}

// ============================================================================
// Component
// ============================================================================

export function TaskInput({ onTaskCreated }: { onTaskCreated?: (task: Task) => void }) {
  const [prompt, setPrompt] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Attachments state
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Save workflow state
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [workflowName, setWorkflowName] = useState("")
  const [savedWorkflows, setSavedWorkflows] = useState<SavedWorkflow[]>([])
  const [showLoadWorkflows, setShowLoadWorkflows] = useState(false)

  // Plugin selection state
  const [pluginOptions, setPluginOptions] = useState<PluginOption[]>([])
  const [pluginPopoverOpen, setPluginPopoverOpen] = useState(false)

  // Load saved workflows on mount
  useEffect(() => {
    setSavedWorkflows(getSavedWorkflows())
  }, [])

  // Load plugins when popover opens
  useEffect(() => {
    if (pluginPopoverOpen && pluginOptions.length === 0) {
      loadPlugins()
    }
  }, [pluginPopoverOpen])

  const loadPlugins = async () => {
    try {
      const fetched = await getPlugins()
      const plugins = fetched.length > 0 ? fetched : allPlugins
      setPluginOptions(plugins.map(p => ({
        id: p.id,
        name: p.name,
        icon: p.icon,
        category: p.category,
        enabled: p.enabled,
        connected: p.connected,
        selected: p.enabled && p.connected,
      })))
    } catch {
      setPluginOptions(allPlugins.map(p => ({
        id: p.id,
        name: p.name,
        icon: p.icon,
        category: p.category,
        enabled: p.enabled,
        connected: p.connected,
        selected: p.enabled && p.connected,
      })))
    }
  }

  // ---------- Submit ----------
  const handleSubmit = async () => {
    if (!prompt.trim()) return
    setIsSubmitting(true)

    try {
      const selectedPlugins = pluginOptions.filter(p => p.selected).map(p => p.id)
      const taskPrompt = attachedFiles.length > 0
        ? `${prompt}\n\n[Attached files: ${attachedFiles.map(f => f.name).join(", ")}]${selectedPlugins.length > 0 ? `\n[Plugins: ${selectedPlugins.join(", ")}]` : ""}`
        : selectedPlugins.length > 0
          ? `${prompt}\n\n[Plugins: ${selectedPlugins.join(", ")}]`
          : prompt

      const newTask = await createTask(taskPrompt)
      setPrompt("")
      setAttachedFiles([])
      if (onTaskCreated) onTaskCreated(newTask)
      toast({
        title: "Task Started",
        description: `Your AI agents are now processing the request.${attachedFiles.length > 0 ? ` (${attachedFiles.length} file(s) attached)` : ""}`,
      })
    } catch (error) {
      console.error("Failed to create task:", error)
      toast({
        title: "Error",
        description: "Failed to start task. Please check if the backend is running.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ---------- File Attachment ----------
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles: AttachedFile[] = Array.from(files).map(f => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      size: f.size,
      type: f.type || "application/octet-stream",
    }))

    setAttachedFiles(prev => [...prev, ...newFiles])
    toast({
      title: "Files Attached",
      description: `${newFiles.length} file(s) attached to your task.`,
    })

    // Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [])

  const removeFile = (id: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id))
  }

  // ---------- Save Workflow ----------
  const handleSaveWorkflow = () => {
    if (!prompt.trim()) {
      toast({
        title: "No Prompt",
        description: "Write a task prompt before saving it as a workflow.",
        variant: "destructive",
      })
      return
    }
    setWorkflowName("")
    setShowSaveDialog(true)
  }

  const confirmSaveWorkflow = () => {
    if (!workflowName.trim()) return

    const workflow: SavedWorkflow = {
      id: `wf-${Date.now()}`,
      name: workflowName.trim(),
      prompt,
      plugins: pluginOptions.filter(p => p.selected).map(p => p.id),
      createdAt: new Date().toISOString(),
    }

    const updated = [...savedWorkflows, workflow]
    setSavedWorkflows(updated)
    saveWorkflows(updated)
    setShowSaveDialog(false)

    toast({
      title: "Workflow Saved",
      description: `"${workflow.name}" has been saved. Click the save button to load it later.`,
    })
  }

  const loadWorkflow = (workflow: SavedWorkflow) => {
    setPrompt(workflow.prompt)
    if (workflow.plugins.length > 0) {
      setPluginOptions(prev =>
        prev.map(p => ({
          ...p,
          selected: workflow.plugins.includes(p.id),
        }))
      )
    }
    setShowLoadWorkflows(false)
    toast({
      title: "Workflow Loaded",
      description: `"${workflow.name}" has been loaded into the task input.`,
    })
  }

  const deleteWorkflow = (id: string) => {
    const updated = savedWorkflows.filter(w => w.id !== id)
    setSavedWorkflows(updated)
    saveWorkflows(updated)
  }

  // ---------- Plugin Toggle ----------
  const togglePlugin = (id: string) => {
    setPluginOptions(prev =>
      prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p)
    )
  }

  const selectedPluginCount = pluginOptions.filter(p => p.selected).length

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

        {/* Attached Files Display */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((file) => {
              const FileIcon = getFileIcon(file.type)
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm group"
                >
                  <FileIcon className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({formatFileSize(file.size)})</span>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Selected Plugins Display */}
        {selectedPluginCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Plugins:</span>
            {pluginOptions.filter(p => p.selected).map(p => (
              <Badge key={p.id} variant="outline" className="gap-1 text-xs">
                {p.name}
                <button onClick={() => togglePlugin(p.id)} className="ml-0.5 hover:text-destructive">
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

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
            {/* ---- SAVE WORKFLOW ---- */}
            <Popover open={showLoadWorkflows} onOpenChange={setShowLoadWorkflows}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 relative"
                  onClick={(e) => {
                    if (savedWorkflows.length === 0) {
                      e.preventDefault()
                      handleSaveWorkflow()
                    }
                  }}
                  title="Save / Load Workflow"
                >
                  <Save className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <div className="p-3 border-b border-border">
                  <h4 className="font-semibold text-sm">Saved Workflows</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Load a saved prompt or save the current one</p>
                </div>
                <ScrollArea className="max-h-[200px]">
                  {savedWorkflows.length > 0 ? (
                    <div className="p-1">
                      {savedWorkflows.map((wf) => (
                        <div
                          key={wf.id}
                          className="flex items-center justify-between gap-2 rounded-md px-3 py-2 hover:bg-muted/50 cursor-pointer group"
                          onClick={() => loadWorkflow(wf)}
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{wf.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{wf.prompt}</p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteWorkflow(wf.id) }}
                            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No saved workflows yet
                    </div>
                  )}
                </ScrollArea>
                <Separator />
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full gap-2 justify-start"
                    onClick={() => { setShowLoadWorkflows(false); handleSaveWorkflow() }}
                    disabled={!prompt.trim()}
                  >
                    <Save className="size-3.5" />
                    Save Current Prompt
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* ---- ATTACH FILES ---- */}
            <Button
              variant="outline"
              size="icon"
              className={cn("shrink-0", attachedFiles.length > 0 && "border-primary text-primary")}
              onClick={() => fileInputRef.current?.click()}
              title="Attach files"
            >
              <Paperclip className="size-4" />
              {attachedFiles.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                  {attachedFiles.length}
                </span>
              )}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept=".txt,.md,.py,.js,.ts,.tsx,.jsx,.json,.csv,.pdf,.png,.jpg,.jpeg,.gif,.svg,.html,.css,.sql,.xml,.yaml,.yml,.log,.env,.sh,.bat,.ps1"
            />

            {/* ---- PLUGIN SELECTOR ---- */}
            <Popover open={pluginPopoverOpen} onOpenChange={setPluginPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn("shrink-0 relative", selectedPluginCount > 0 && "border-primary text-primary")}
                  title="Select plugins"
                >
                  <Puzzle className="size-4" />
                  {selectedPluginCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                      {selectedPluginCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0" align="start">
                <div className="p-3 border-b border-border">
                  <h4 className="font-semibold text-sm">Task Plugins</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Select plugins to use for this task</p>
                </div>
                <ScrollArea className="max-h-[250px]">
                  <div className="p-1">
                    {pluginOptions.map((plugin) => (
                      <div
                        key={plugin.id}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-md px-3 py-2.5 cursor-pointer transition-colors",
                          plugin.selected ? "bg-primary/5" : "hover:bg-muted/50",
                          !plugin.connected && "opacity-50"
                        )}
                        onClick={() => plugin.connected && togglePlugin(plugin.id)}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={cn(
                            "size-2 rounded-full shrink-0",
                            plugin.connected ? "bg-green-500" : "bg-muted-foreground"
                          )} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{plugin.name}</p>
                            <p className="text-xs text-muted-foreground">{plugin.category}</p>
                          </div>
                        </div>
                        {plugin.connected ? (
                          <div className={cn(
                            "size-5 rounded border flex items-center justify-center shrink-0 transition-colors",
                            plugin.selected
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-border"
                          )}>
                            {plugin.selected && <Check className="size-3" />}
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">Not connected</span>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Separator />
                <div className="p-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground px-2">
                    {selectedPluginCount} selected
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setPluginPopoverOpen(false)}
                  >
                    Done
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <span className="text-xs text-muted-foreground hidden sm:inline ml-auto">
            Press Ctrl+Enter to submit
          </span>
        </div>
      </div>

      {/* ---- Save Workflow Dialog ---- */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Workflow</DialogTitle>
            <DialogDescription>
              Save this prompt as a reusable workflow you can load later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Workflow Name</label>
              <Input
                placeholder="e.g. API Code Review"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && confirmSaveWorkflow()}
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Prompt Preview</label>
              <div className="rounded-md border border-border bg-muted/50 p-3 text-sm text-muted-foreground max-h-24 overflow-y-auto">
                {prompt}
              </div>
            </div>
            {selectedPluginCount > 0 && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">Included Plugins</label>
                <div className="flex flex-wrap gap-1.5">
                  {pluginOptions.filter(p => p.selected).map(p => (
                    <Badge key={p.id} variant="secondary" className="text-xs">{p.name}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
            <Button onClick={confirmSaveWorkflow} disabled={!workflowName.trim()}>Save Workflow</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
