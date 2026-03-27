import { useState, useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useAdminStore } from '#/store/admin-store'
import { cn } from '#/lib/utils'
import {
  DollarSign,
  Store,
  ChevronRight,
  Coffee,
  Beef,
  Soup,
  CakeSlice,
  GlassWater,
  Flame,
  CircleDot,
  Users,
  Package,
  CalendarDays,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from 'recharts'

export const Route = createFileRoute('/admin/')({ component: AdminDashboard })

const STORE_ICONS: Record<string, React.ElementType> = {
  coffee: Coffee, beef: Beef, soup: Soup,
  'cake-slice': CakeSlice, 'glass-water': GlassWater, flame: Flame,
}

type Period = 'daily' | 'weekly' | 'monthly'

function getPeriodRange(period: Period): Date {
  const now = new Date()
  if (period === 'daily') return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (period === 'weekly') {
    const d = new Date(now)
    d.setDate(d.getDate() - 6)
    d.setHours(0, 0, 0, 0)
    return d
  }
  const d = new Date(now)
  d.setDate(d.getDate() - 29)
  d.setHours(0, 0, 0, 0)
  return d
}

function AdminDashboard() {
  const stores = useAdminStore((s) => s.stores)
  const settings = useAdminStore((s) => s.settings)
  const getActiveStores = useAdminStore((s) => s.getActiveStores)
  const getAllStaff = useAdminStore((s) => s.getAllStaff)

  const [period, setPeriod] = useState<Period>('daily')

  const periodStart = getPeriodRange(period)

  const periodData = useMemo(() => {
    const cutoff = periodStart.getTime()

    const storeRevenues = stores.map((store) => {
      const filtered = store.orders.filter((o) => o.status !== 'cancelled' && new Date(o.createdAt).getTime() >= cutoff)
      const revenue = filtered.reduce((s, o) => s + o.total, 0)
      return {
        id: store.id,
        name: store.name.length > 12 ? (store.name.split(' ')[0] ?? store.name) : store.name,
        fullName: store.name,
        revenue,
        color: store.color,
      }
    })

    const totalRevenue = storeRevenues.reduce((s, r) => s + r.revenue, 0)

    let trendData: { label: string; revenue: number }[] = []
    if (period === 'daily') {
      const hours: Record<number, number> = {}
      for (let i = 8; i <= 22; i++) hours[i] = 0
      stores.forEach((store) => {
        store.orders.filter((o) => o.status !== 'cancelled' && new Date(o.createdAt).getTime() >= cutoff).forEach((o) => {
          const h = new Date(o.createdAt).getHours()
          if (h in hours) hours[h] = (hours[h] ?? 0) + o.total
        })
      })
      trendData = Object.entries(hours).map(([h, rev]) => ({ label: `${parseInt(h)}:00`, revenue: rev }))
    } else if (period === 'weekly') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const dayBuckets: Record<string, number> = {}
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const key = days[d.getDay()] ?? 'Sun'
        dayBuckets[key] = 0
      }
      stores.forEach((store) => {
        store.orders.filter((o) => o.status !== 'cancelled' && new Date(o.createdAt).getTime() >= cutoff).forEach((o) => {
          const d = new Date(o.createdAt)
          const key = days[d.getDay()] ?? 'Sun'
          if (key in dayBuckets) dayBuckets[key] = (dayBuckets[key] ?? 0) + o.total
        })
      })
      trendData = Object.entries(dayBuckets).map(([label, revenue]) => ({ label, revenue }))
    } else {
      const weekBuckets: { label: string; start: number; end: number; revenue: number }[] = []
      for (let w = 3; w >= 0; w--) {
        const start = new Date()
        start.setDate(start.getDate() - (w + 1) * 7 + 1)
        start.setHours(0, 0, 0, 0)
        const end = new Date()
        end.setDate(end.getDate() - w * 7)
        end.setHours(23, 59, 59, 999)
        weekBuckets.push({ label: `W${4 - w}`, start: start.getTime(), end: end.getTime(), revenue: 0 })
      }
      stores.forEach((store) => {
        store.orders.filter((o) => o.status !== 'cancelled').forEach((o) => {
          const t = new Date(o.createdAt).getTime()
          const bucket = weekBuckets.find((b) => t >= b.start && t <= b.end)
          if (bucket) bucket.revenue += o.total
        })
      })
      trendData = weekBuckets.map((b) => ({ label: b.label, revenue: b.revenue }))
    }

    return { totalRevenue, storeRevenues, trendData }
  }, [stores, period, periodStart])

  const activeStores = getActiveStores()
  const allStaff = getAllStaff()
  const onDutyStaff = allStaff.filter((s) => s.isOnDuty).length
  const totalProducts = stores.reduce((sum, s) => sum + s.products.length, 0)
  const availableProducts = stores.reduce((sum, s) => sum + s.products.filter((p) => p.available).length, 0)

  const periodLabel = period === 'daily' ? "Today's" : period === 'weekly' ? 'This Week\'s' : 'This Month\'s'

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg">Dashboard</h1>
            <p className="text-xs text-slate-500">Real-time food court overview</p>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
            {(['daily', 'weekly', 'monthly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all',
                  period === p
                    ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300',
                )}
              >
                {p === 'daily' && <CalendarDays className="h-3 w-3" />}
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6 admin-scrollbar">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard
            icon={<DollarSign className="h-5 w-5" />}
            label={`${periodLabel} Revenue`}
            value={`${settings.currency}${periodData.totalRevenue.toLocaleString()}`}
            accent="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
          />
          <KpiCard
            icon={<Store className="h-5 w-5" />}
            label="Active Stores"
            value={`${activeStores} / ${stores.length}`}
            accent="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400"
          />
          <KpiCard
            icon={<Users className="h-5 w-5" />}
            label="Staff On Duty"
            value={`${onDutyStaff} / ${allStaff.length}`}
            accent="text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400"
          />
          <KpiCard
            icon={<Package className="h-5 w-5" />}
            label="Products Available"
            value={`${availableProducts} / ${totalProducts}`}
            accent="text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400"
          />
        </div>

        {/* Store Grid */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Store Status</h2>
            <Link to="/admin/stores" className="text-xs font-medium text-indigo-600 no-underline hover:text-indigo-700 dark:text-indigo-400">
              Manage stores <ChevronRight className="inline h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => {
              const storeRev = periodData.storeRevenues.find((r) => r.id === store.id)
              const revenue = storeRev?.revenue ?? 0
              const targetPct = store.revenueTarget > 0 ? Math.min(100, Math.round((revenue / store.revenueTarget) * 100)) : 0
              const StoreIcon = STORE_ICONS[store.icon] ?? Store
              const staffOnDuty = store.staff.filter((s) => s.isOnDuty).length
              return (
                <div key={store.id} className="admin-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ backgroundColor: store.color }}>
                        <StoreIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{store.name}</p>
                        <p className="text-[11px] text-slate-500">{store.subtitle}</p>
                      </div>
                    </div>
                    <StatusBadge status={store.status} />
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{settings.currency}{revenue.toLocaleString()}</p>
                      <p className="text-[11px] text-slate-500">{staffOnDuty} staff on duty &middot; {store.products.filter((p) => p.available).length} products</p>
                    </div>
                    {store.revenueTarget > 0 && (
                      <div className="text-right">
                        <p className="text-[10px] font-medium text-slate-400">{targetPct}% of target</p>
                        <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div className={cn('h-full rounded-full transition-all', targetPct >= 80 ? 'bg-emerald-500' : targetPct >= 50 ? 'bg-amber-500' : 'bg-red-400')} style={{ width: `${targetPct}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Charts */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="admin-card p-5">
            <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-slate-100">{periodLabel} Revenue by Store</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={periodData.storeRevenues} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={{ stroke: 'var(--color-border)' }} tickFormatter={(v: number) => `₱${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: 'var(--color-border)' }} width={70} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} formatter={(value) => [`₱${Number(value).toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                    {periodData.storeRevenues.map((entry, idx) => (<Cell key={idx} fill={entry.color} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="admin-card p-5">
            <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-slate-100">
              {period === 'daily' ? 'Hourly Sales' : period === 'weekly' ? 'Daily Sales' : 'Weekly Sales'}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {period === 'daily' ? (
                  <BarChart data={periodData.trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={{ stroke: 'var(--color-border)' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={{ stroke: 'var(--color-border)' }} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} formatter={(value) => [`₱${Number(value).toLocaleString()}`, 'Sales']} />
                    <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={periodData.trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={{ stroke: 'var(--color-border)' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={{ stroke: 'var(--color-border)' }} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} formatter={(value) => [`₱${Number(value).toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className="admin-card flex items-center gap-3 p-4">
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', accent)}>{icon}</div>
      <div>
        <p className="text-[11px] font-medium text-slate-500">{label}</p>
        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{value}</p>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: 'open' | 'closed' | 'busy' }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold',
      status === 'open' && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
      status === 'busy' && 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
      status === 'closed' && 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500',
    )}>
      <CircleDot className="h-3 w-3" />
      {status === 'open' ? 'Open' : status === 'busy' ? 'Busy' : 'Closed'}
    </span>
  )
}
