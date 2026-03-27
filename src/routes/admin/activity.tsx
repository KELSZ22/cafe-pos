import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAdminStore } from '#/store/admin-store'
import { cn } from '#/lib/utils'
import {
  Search,
  ScrollText,
  Store,
  Users,
  Settings,
  Package,
  ShieldCheck,
  Clock,
} from 'lucide-react'

export const Route = createFileRoute('/admin/activity')({ component: ActivityPage })

const ACTION_CATEGORIES: { value: string; label: string; icon: React.ElementType; match: string[] }[] = [
  { value: 'store', label: 'Stores', icon: Store, match: ['Store Created', 'Store Updated', 'Store Deleted', 'Store Status Changed', 'Store Opened', 'Store Closed'] },
  { value: 'staff', label: 'Staff', icon: Users, match: ['Staff Added', 'Staff Removed', 'Staff Assigned'] },
  { value: 'product', label: 'Products', icon: Package, match: ['Product Availability', 'Price Updated'] },
  { value: 'settings', label: 'Settings', icon: Settings, match: ['Settings Updated'] },
]

function getActionColor(action: string): string {
  if (action.includes('Deleted') || action.includes('Removed') || action.includes('Closed')) return 'bg-red-400'
  if (action.includes('Created') || action.includes('Added') || action.includes('Opened')) return 'bg-emerald-400'
  if (action.includes('Updated') || action.includes('Changed') || action.includes('Assigned')) return 'bg-indigo-400'
  if (action.includes('Availability') || action.includes('Price')) return 'bg-amber-400'
  return 'bg-slate-400'
}

function getActionIcon(action: string): React.ElementType {
  if (action.includes('Store')) return Store
  if (action.includes('Staff')) return Users
  if (action.includes('Product') || action.includes('Price')) return Package
  if (action.includes('Settings')) return Settings
  return ShieldCheck
}

function ActivityPage() {
  const auditLog = useAdminStore((s) => s.auditLog)

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filtered = auditLog.filter((entry) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!entry.action.toLowerCase().includes(q) && !entry.details.toLowerCase().includes(q) && !entry.user.toLowerCase().includes(q)) return false
    }
    if (categoryFilter !== 'all') {
      const cat = ACTION_CATEGORIES.find((c) => c.value === categoryFilter)
      if (cat && !cat.match.some((m) => entry.action.includes(m))) return false
    }
    return true
  })

  const todayCount = auditLog.filter((e) => {
    const d = new Date(e.timestamp)
    const now = new Date()
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  }).length

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg">Activity Log</h1>
            <p className="text-xs text-slate-500">{auditLog.length} total entries &middot; {todayCount} today</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6 admin-scrollbar">
        {/* Category chips */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter('all')}
            className={cn('flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all', categoryFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700')}
          >
            <ScrollText className="h-3.5 w-3.5" />
            All ({auditLog.length})
          </button>
          {ACTION_CATEGORIES.map((cat) => {
            const count = auditLog.filter((e) => cat.match.some((m) => e.action.includes(m))).length
            return (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(categoryFilter === cat.value ? 'all' : cat.value)}
                className={cn('flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all', categoryFilter === cat.value ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700')}
              >
                <cat.icon className="h-3.5 w-3.5" />
                {cat.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search actions, details, or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:ring-indigo-900"
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="admin-card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12">
              <ScrollText className="h-10 w-10 text-slate-300" />
              <p className="text-sm text-slate-400">No activity matches your filters</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((entry) => {
                const ActionIcon = getActionIcon(entry.action)
                const dotColor = getActionColor(entry.action)
                return (
                  <div key={entry.id} className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', dotColor.replace('bg-', 'bg-').replace('400', '50'), 'dark:bg-opacity-20')}>
                      <ActionIcon className={cn('h-4 w-4', dotColor.replace('bg-', 'text-'))} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{entry.action}</p>
                        <span className={cn('h-1.5 w-1.5 rounded-full', dotColor)} />
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">{entry.details}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(entry.timestamp)}
                      </p>
                      <p className="mt-0.5 text-[10px] font-medium text-slate-400">{entry.user}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <p className="mt-3 text-center text-xs text-slate-400">Showing {filtered.length} of {auditLog.length} entries</p>
        )}
      </div>
    </div>
  )
}

function formatTimestamp(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(dateString).toLocaleDateString()
}
