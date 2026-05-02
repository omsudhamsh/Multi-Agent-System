"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PluginCard } from "@/components/plugins/plugin-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { plugins as initialPlugins } from "@/lib/mock-data"

const categories = ['All', 'Research', 'Files', 'Development', 'Automation', 'Data', 'Communication', 'Productivity', 'AI']

export default function PluginsPage() {
  const [plugins, setPlugins] = useState(initialPlugins)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "All" || plugin.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const connectedCount = plugins.filter(p => p.connected).length
  const enabledCount = plugins.filter(p => p.enabled).length

  const handleToggle = (id: string, enabled: boolean) => {
    setPlugins(prev => prev.map(p => 
      p.id === id ? { ...p, enabled } : p
    ))
  }

  const handleConnect = (id: string) => {
    setPlugins(prev => prev.map(p => 
      p.id === id ? { ...p, connected: true, enabled: true } : p
    ))
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Plugin Marketplace</h1>
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
          <Button variant="outline" className="gap-2 sm:w-auto">
            <Filter className="size-4" />
            Filters
          </Button>
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
