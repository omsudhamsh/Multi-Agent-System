"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Filter, Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PluginCard } from "@/components/plugins/plugin-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPlugins, togglePlugin, connectPlugin, type Plugin } from "@/lib/api"
import { plugins as mockPlugins } from "@/lib/mock-data"

const categories = ['All', 'Research', 'Files', 'Development', 'Automation', 'Data', 'Communication', 'Productivity', 'AI']

export default function PluginsPage() {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [loading, setLoading] = useState(true)

  const fetchPlugins = useCallback(async () => {
    try {
      const fetchedPlugins = await getPlugins()
      setPlugins(fetchedPlugins)
    } catch (error) {
      console.error("Failed to fetch plugins:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPlugins()
  }, [fetchPlugins])

  const displayPlugins = plugins.length > 0 ? plugins : mockPlugins

  const filteredPlugins = displayPlugins.filter(plugin => {
    const matchesSearch = (plugin.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (plugin.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "All" || plugin.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const connectedCount = displayPlugins.filter(p => p.connected).length
  const enabledCount = displayPlugins.filter(p => p.enabled).length

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      // Optimistic update
      setPlugins(prev => prev.map(p => 
        p.id === id ? { ...p, enabled } : p
      ))
      await togglePlugin(id, enabled)
    } catch (error) {
      console.error("Failed to toggle plugin:", error)
      fetchPlugins() // Rollback
    }
  }

  const handleConnect = async (id: string) => {
    try {
      // Optimistic update
      setPlugins(prev => prev.map(p => 
        p.id === id ? { ...p, connected: true, enabled: true } : p
      ))
      await connectPlugin(id)
    } catch (error) {
      console.error("Failed to connect plugin:", error)
      fetchPlugins() // Rollback
    }
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Plugin Marketplace</h1>
              {loading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
            </div>
            <p className="text-muted-foreground mt-1">
              Extend your agents with powerful plugins
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-1.5">
              {connectedCount} Connected
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              {enabledCount} Enabled
            </Badge>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search plugins..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Plugin Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlugins.map((plugin) => (
            <PluginCard 
              key={plugin.id} 
              plugin={plugin}
              onToggle={handleToggle}
              onConnect={handleConnect}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredPlugins.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="size-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">No plugins found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
