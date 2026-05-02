"use client"

import { useState } from "react"
import { Plus, FolderKanban, MoreHorizontal, Clock, CheckCircle2, Search, Pencil, Archive, Trash2, FolderOpen } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'paused'
  progress: number
  tasksCompleted: number
  totalTasks: number
  lastUpdated: string
}

const defaultProjects: Project[] = [
  {
    id: '1',
    name: 'AgentOS Dashboard',
    description: 'Multi-agent AI system dashboard',
    status: 'active',
    progress: 65,
    tasksCompleted: 12,
    totalTasks: 18,
    lastUpdated: '2 hours ago'
  },
  {
    id: '2',
    name: 'E-commerce Platform',
    description: 'Full-stack online store with payments',
    status: 'active',
    progress: 40,
    tasksCompleted: 8,
    totalTasks: 20,
    lastUpdated: '1 day ago'
  },
  {
    id: '3',
    name: 'Portfolio Website',
    description: 'Personal portfolio with blog',
    status: 'completed',
    progress: 100,
    tasksCompleted: 15,
    totalTasks: 15,
    lastUpdated: '3 days ago'
  },
  {
    id: '4',
    name: 'API Documentation',
    description: 'Technical documentation site',
    status: 'paused',
    progress: 25,
    tasksCompleted: 5,
    totalTasks: 20,
    lastUpdated: '1 week ago'
  }
]

const statusColors = {
  active: 'bg-green-500',
  completed: 'bg-blue-500',
  paused: 'bg-yellow-500'
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects)
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [newName, setNewName] = useState("")
  const [newDesc, setNewDesc] = useState("")

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = () => {
    if (!newName.trim()) return
    const project: Project = {
      id: `proj-${Date.now()}`,
      name: newName.trim(),
      description: newDesc.trim() || "No description",
      status: 'active',
      progress: 0,
      tasksCompleted: 0,
      totalTasks: 0,
      lastUpdated: 'Just now'
    }
    setProjects(prev => [project, ...prev])
    setShowNewDialog(false)
    setNewName("")
    setNewDesc("")
    toast({ title: "Project Created", description: `"${project.name}" has been created.` })
  }

  const handleEdit = () => {
    if (!editProject || !newName.trim()) return
    setProjects(prev => prev.map(p =>
      p.id === editProject.id ? { ...p, name: newName.trim(), description: newDesc.trim() || p.description } : p
    ))
    setShowEditDialog(false)
    setEditProject(null)
    toast({ title: "Project Updated", description: "Project details saved." })
  }

  const handleArchive = (id: string) => {
    setProjects(prev => prev.map(p =>
      p.id === id ? { ...p, status: 'paused' as const } : p
    ))
    toast({ title: "Project Archived", description: "Project has been paused/archived." })
  }

  const handleDelete = (id: string) => {
    const name = projects.find(p => p.id === id)?.name
    setProjects(prev => prev.filter(p => p.id !== id))
    toast({ title: "Project Deleted", description: `"${name}" has been removed.`, variant: "destructive" })
  }

  const openEdit = (project: Project) => {
    setEditProject(project)
    setNewName(project.name)
    setNewDesc(project.description)
    setShowEditDialog(true)
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your AI-assisted projects
            </p>
          </div>
          <Button className="gap-2" onClick={() => { setNewName(""); setNewDesc(""); setShowNewDialog(true) }}>
            <Plus className="size-4" />
            New Project
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-2xl font-bold">{projects.length}</p>
            <p className="text-xs text-muted-foreground">Total Projects</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-2xl font-bold">{projects.filter(p => p.status === 'completed').length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-2xl font-bold">{projects.reduce((acc, p) => acc + p.tasksCompleted, 0)}</p>
            <p className="text-xs text-muted-foreground">Tasks Done</p>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((project) => (
            <div key={project.id} className="rounded-xl border border-border bg-card p-5 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-muted">
                    <FolderKanban className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toast({ title: "Opened", description: `Viewing "${project.name}"` })}>
                      <FolderOpen className="size-4 mr-2" /> Open
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEdit(project)}>
                      <Pencil className="size-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleArchive(project.id)}>
                      <Archive className="size-4 mr-2" /> Archive
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(project.id)}>
                      <Trash2 className="size-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-1.5" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="size-3" />
                    <span>{project.tasksCompleted}/{project.totalTasks} tasks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>{project.lastUpdated}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs capitalize gap-1.5">
                  <span className={`size-1.5 rounded-full ${statusColors[project.status]}`} />
                  {project.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FolderKanban className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">{searchQuery ? "No matching projects" : "No projects yet"}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery ? "Try a different search term" : "Create your first project to get started"}
            </p>
            {!searchQuery && (
              <Button className="gap-2" onClick={() => setShowNewDialog(true)}>
                <Plus className="size-4" /> Create Project
              </Button>
            )}
          </div>
        )}
      </div>

      {/* New Project Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
            <DialogDescription>Create a new AI-assisted project.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Project Name</label>
              <Input placeholder="e.g. My New App" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleCreate()} autoFocus />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Input placeholder="Brief project description" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newName.trim()}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update project details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Project Name</label>
              <Input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleEdit()} autoFocus />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Input value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={!newName.trim()}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
