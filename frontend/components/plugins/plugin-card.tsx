"use client"

import {
  Globe,
  FileText,
  Play,
  Github,
  Monitor,
  Database,
  FileType,
  Mail,
  Calendar,
  Image,
  FileSearch,
  type LucideIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import type { Plugin } from "@/lib/api"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const iconMap: Record<string, LucideIcon> = {
  Globe,
  FileText,
  Play,
  Github,
  Monitor,
  Database,
  FileType,
  Mail,
  Calendar,
  Image,
  FileSearch
}

interface PluginCardProps {
  plugin: Plugin
  onToggle?: (id: string, enabled: boolean) => void
  onConnect?: (id: string) => void
}

export function PluginCard({ plugin, onToggle, onConnect }: PluginCardProps) {
  const Icon = iconMap[plugin.icon] || Globe

  return (
    <div className={cn(
      "rounded-xl border bg-card p-4 transition-all",
      plugin.enabled && plugin.connected 
        ? "border-primary/50" 
        : "border-border hover:border-muted-foreground/50"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center size-10 rounded-lg",
            plugin.enabled && plugin.connected 
              ? "bg-primary/20 text-primary" 
              : "bg-muted text-muted-foreground"
          )}>
            <Icon className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm flex items-center gap-1.5">
              {plugin.name}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center size-4 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-help">
                      <span className="sr-only">Info</span>
                      <i className="text-[10px] font-serif font-bold italic">i</i>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{plugin.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
            <Badge variant="outline" className="text-xs mt-0.5">
              {plugin.category}
            </Badge>
          </div>
        </div>
        
        <Switch 
          checked={plugin.enabled}
          onCheckedChange={(checked) => onToggle?.(plugin.id, checked)}
          disabled={!plugin.connected}
        />
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {plugin.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {plugin.connected ? (
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">Connected</span>
          </div>
        ) : (
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs h-7"
            onClick={() => onConnect?.(plugin.id)}
          >
            Connect
          </Button>
        )}
        
        <Button variant="ghost" size="sm" className="text-xs h-7"
          onClick={() => toast({ title: `Configure ${plugin.name}`, description: `Opening configuration for ${plugin.name} plugin.` })}>
          Configure
        </Button>
      </div>
    </div>
  )
}
