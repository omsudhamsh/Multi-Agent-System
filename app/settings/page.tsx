"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Key, Bell, Palette, Shield, Database, Trash2, Save } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [apiKey, setApiKey] = useState("sk-••••••••••••••••••••••••")
  const [notifications, setNotifications] = useState({
    taskComplete: true,
    errors: true,
    updates: false
  })

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-3xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your AgentOS preferences and configurations
          </p>
        </div>

        {/* API Configuration */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
              <Key className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">API Configuration</h2>
              <p className="text-sm text-muted-foreground">Connect to the Gemini API</p>
            </div>
          </div>
          
          <FieldGroup>
            <Field>
              <FieldLabel>API Key</FieldLabel>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono"
                />
                <Button variant="outline">Verify</Button>
              </div>
            </Field>
            
            <Field>
              <FieldLabel>Model</FieldLabel>
              <Select defaultValue="gemini-pro">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  <SelectItem value="gemini-pro-vision">Gemini Pro Vision</SelectItem>
                  <SelectItem value="gemini-ultra">Gemini Ultra</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">API Connected</span>
            </div>
            <Badge variant="secondary">1,247 / 10,000 requests today</Badge>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
              <Palette className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Appearance</h2>
              <p className="text-sm text-muted-foreground">Customize the look and feel</p>
            </div>
          </div>
          
          <FieldGroup>
            <Field>
              <FieldLabel>Theme</FieldLabel>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
              <Bell className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Notifications</h2>
              <p className="text-sm text-muted-foreground">Manage notification preferences</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Task Completions</p>
                <p className="text-xs text-muted-foreground">Notify when tasks are completed</p>
              </div>
              <Switch 
                checked={notifications.taskComplete}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, taskComplete: checked }))}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Errors & Warnings</p>
                <p className="text-xs text-muted-foreground">Notify when agents encounter errors</p>
              </div>
              <Switch 
                checked={notifications.errors}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, errors: checked }))}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Product Updates</p>
                <p className="text-xs text-muted-foreground">Receive news about new features</p>
              </div>
              <Switch 
                checked={notifications.updates}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, updates: checked }))}
              />
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
              <Shield className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Data & Privacy</h2>
              <p className="text-sm text-muted-foreground">Manage your data and privacy settings</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="size-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Export Data</p>
                  <p className="text-xs text-muted-foreground">Download all your data</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Export</Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trash2 className="size-5 text-destructive" />
                <div>
                  <p className="font-medium text-sm text-destructive">Delete Account</p>
                  <p className="text-xs text-muted-foreground">Permanently delete your account and data</p>
                </div>
              </div>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="gap-2">
            <Save className="size-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
