"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Key, Bell, Palette, Shield, Database, Trash2, Save, Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { getSettings, updateSettings } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("gemini-pro")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notifications, setNotifications] = useState({
    taskComplete: true,
    errors: true,
    updates: false
  })

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getSettings()
        setApiKey(settings.apiKey)
        setModel(settings.model)
        setNotifications(settings.notifications)
        if (settings.theme) setTheme(settings.theme)
      } catch (error) {
        console.error("Failed to load settings:", error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [setTheme])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSettings({
        apiKey,
        model,
        theme: theme || "system",
        notifications
      })
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated.",
      })
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your AgentOS preferences and configurations
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save Changes
          </Button>
        </div>

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
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono bg-background"
                placeholder="sk-..."
              />
            </Field>
            
            <Field>
              <FieldLabel>Model</FieldLabel>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="bg-background">
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
        </div>

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
                <SelectTrigger className="bg-background">
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

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
              <Bell className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Notifications</h2>
              <p className="text-sm text-muted-foreground">Configure alert preferences</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Task Completion</p>
                <p className="text-xs text-muted-foreground">Notify when an agent finishes a task</p>
              </div>
              <Switch 
                checked={notifications.taskComplete}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, taskComplete: checked }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Error Alerts</p>
                <p className="text-xs text-muted-foreground">Notify when a task fails or an error occurs</p>
              </div>
              <Switch 
                checked={notifications.errors}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, errors: checked }))}
              />
            </div>
          </div>
        </div>

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
      </div>
    </DashboardLayout>
  )
}