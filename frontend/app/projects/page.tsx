"use client"

import { useState } from "react"
import { Plus, FolderKanban, MoreHorizontal, Clock, CheckCircle2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const projects = [
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
          <Button className="gap-2">
            <Plus className="size-4" />
            New Project
          </Button>
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
          {projects.map((project) => (
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
                    <DropdownMenuItem>Open</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Archive</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
                  <span className={`size-1.5 rounded-full ${statusColors[project.status as keyof typeof statusColors]}`} />
                  {project.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State for New Users */}
        {projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FolderKanban className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">No projects yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first project to get started with AI-assisted development
            </p>
            <Button className="gap-2">
              <Plus className="size-4" />
              Create Project
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
