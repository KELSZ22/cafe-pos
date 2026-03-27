import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAdminStore } from '#/store/admin-store'
import type { FoodCourtStore } from '#/data/admin-data'
import { cn } from '#/lib/utils'
import { toast } from 'sonner'
import {
  Store,
  Coffee,
  Beef,
  Soup,
  CakeSlice,
  GlassWater,
  Flame,
  CircleDot,
  Users,
  DollarSign,
  Target,
  Plus,
  Pencil,
  Trash2,
  X,
  ArrowLeft,
  CreditCard,
  Banknote,
  Package,
  BarChart3,
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'

export const Route = createFileRoute('/admin/stores')({ component: StoresPage })

const STORE_ICONS: Record<string, React.ElementType> = {
  coffee: Coffee, beef: Beef, soup: Soup,
  'cake-slice': CakeSlice, 'glass-water': GlassWater, flame: Flame,
}

const ICON_OPTIONS = [
  { value: 'coffee', label: 'Coffee' },
  { value: 'beef', label: 'Burger' },
  { value: 'soup', label: 'Ramen' },
  { value: 'cake-slice', label: 'Bakery' },
  { value: 'glass-water', label: 'Juice' },
  { value: 'flame', label: 'Grill' },
]

const COLOR_OPTIONS = ['#8B6F47', '#E07A5F', '#D4A574', '#C97B84', '#7CB68E', '#E8963A', '#6366F1', '#0EA5E9']

const statusOptions: { value: 'open' | 'closed' | 'busy'; label: string; color: string }[] = [
  { value: 'open', label: 'Open', color: 'bg-emerald-500' },
  { value: 'busy', label: 'Busy', color: 'bg-amber-500' },
  { value: 'closed', label: 'Closed', color: 'bg-slate-400' },
]

function StoresPage() {
  const stores = useAdminStore((s) => s.stores)
  const settings = useAdminStore((s) => s.settings)
  const setStoreStatus = useAdminStore((s) => s.setStoreStatus)
  const getStoreRevenue = useAdminStore((s) => s.getStoreRevenue)
  const updateStoreRevenueTarget = useAdminStore((s) => s.updateStoreRevenueTarget)
  const addStore = useAdminStore((s) => s.addStore)
  const updateStore = useAdminStore((s) => s.updateStore)
  const deleteStore = useAdminStore((s) => s.deleteStore)

  const [showForm, setShowForm] = useState(false)
  const [editingStore, setEditingStore] = useState<FoodCourtStore | null>(null)
  const [analyticsStoreId, setAnalyticsStoreId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const analyticsStore = analyticsStoreId ? stores.find((s) => s.id === analyticsStoreId) ?? null : null

  if (analyticsStore) {
    return (
      <StoreAnalytics
        store={analyticsStore}
        currency={settings.currency}
        onBack={() => setAnalyticsStoreId(null)}
      />
    )
  }

  const handleEdit = (store: FoodCourtStore) => {
    setEditingStore(store)
    setShowForm(true)
  }

  const handleDelete = (storeId: string) => {
    const store = stores.find((s) => s.id === storeId)
    deleteStore(storeId)
    setDeleteConfirm(null)
    toast.success(`${store?.name ?? 'Store'} deleted`)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg">Store Management</h1>
            <p className="text-xs text-slate-500">{stores.length} stores &middot; Manage, monitor, and configure</p>
          </div>
          <button
            onClick={() => { setEditingStore(null); setShowForm(true) }}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add Store
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6 admin-scrollbar">
        <div className="space-y-4">
          {stores.map((store) => {
            const revenue = getStoreRevenue(store.id)
            const onDutyCount = store.staff.filter((s) => s.isOnDuty).length
            const availProducts = store.products.filter((p) => p.available).length
            const targetPct = store.revenueTarget > 0 ? Math.min(100, Math.round((revenue / store.revenueTarget) * 100)) : 0
            const StoreIcon = STORE_ICONS[store.icon] ?? Store

            return (
              <div key={store.id} className="admin-card overflow-hidden">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: store.color }}>
                      <StoreIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{store.name}</h3>
                      <p className="text-sm text-slate-500">{store.subtitle}</p>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {settings.currency}{revenue.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {onDutyCount} on duty</span>
                        <span className="flex items-center gap-1"><Package className="h-3.5 w-3.5" /> {availProducts} products</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setStoreStatus(store.id, opt.value)
                          toast.success(`${store.name} set to ${opt.label}`)
                        }}
                        className={cn(
                          'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                          store.status === opt.value
                            ? `${opt.color} text-white shadow-sm`
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                    <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
                    <button onClick={() => setAnalyticsStoreId(store.id)} className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-950/60" title="Analytics">
                      <BarChart3 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleEdit(store)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700" title="Edit">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    {deleteConfirm === store.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDelete(store.id)} className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600">Yes</button>
                        <button onClick={() => setDeleteConfirm(null)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(store.id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Revenue target */}
                <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="flex items-center gap-4">
                    <Target className="h-4 w-4 shrink-0 text-slate-400" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-600 dark:text-slate-400">Revenue Target: {settings.currency}{store.revenueTarget.toLocaleString()}</span>
                        <span className={cn('font-bold', targetPct >= 80 ? 'text-emerald-600' : targetPct >= 50 ? 'text-amber-600' : 'text-red-500')}>{targetPct}%</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div className={cn('h-full rounded-full transition-all', targetPct >= 80 ? 'bg-emerald-500' : targetPct >= 50 ? 'bg-amber-500' : 'bg-red-400')} style={{ width: `${targetPct}%` }} />
                      </div>
                    </div>
                    <input
                      type="number"
                      className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      value={store.revenueTarget}
                      onChange={(e) => updateStoreRevenueTarget(store.id, parseInt(e.target.value) || 0)}
                      min={0}
                      step={1000}
                    />
                  </div>
                </div>

                {/* Staff */}
                <div className="border-t border-slate-100 px-5 py-3 dark:border-slate-800">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Staff</p>
                  <div className="flex flex-wrap gap-2">
                    {store.staff.map((member) => (
                      <span key={member.id} className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', member.isOnDuty ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500')}>
                        <span className={cn('h-1.5 w-1.5 rounded-full', member.isOnDuty ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600')} />
                        {member.name} ({member.role})
                      </span>
                    ))}
                    {store.staff.length === 0 && <span className="text-xs text-slate-400">No staff assigned</span>}
                  </div>
                </div>
              </div>
            )
          })}

          {stores.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Store className="h-12 w-12 text-slate-300" />
              <p className="text-sm text-slate-500">No stores yet. Add your first store to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <StoreFormModal
          store={editingStore}
          currency={settings.currency}
          onSave={(data) => {
            if (editingStore) {
              updateStore(editingStore.id, data)
              toast.success(`${data.name ?? editingStore.name} updated`)
            } else {
              const newStore: FoodCourtStore = {
                id: `store-${Date.now()}`,
                name: data.name ?? '',
                subtitle: data.subtitle ?? '',
                icon: data.icon ?? 'coffee',
                color: data.color ?? '#6366F1',
                status: 'closed',
                revenueTarget: data.revenueTarget ?? 10000,
                settings: {
                  storeName: data.name ?? '',
                  storeSubtitle: data.subtitle ?? '',
                  taxRate: data.settings?.taxRate ?? settings.defaultTaxRate,
                  receiptFooter: data.settings?.receiptFooter ?? '',
                  cashierName: '',
                  currency: settings.currency,
                  logoUrl: '',
                },
                categories: [],
                products: [],
                orders: [],
                staff: [],
              }
              addStore(newStore)
              toast.success(`${newStore.name} created`)
            }
            setShowForm(false)
            setEditingStore(null)
          }}
          onClose={() => { setShowForm(false); setEditingStore(null) }}
        />
      )}
    </div>
  )
}

/* ─── Store Form Modal ─── */

function StoreFormModal({
  store,
  currency,
  onSave,
  onClose,
}: {
  store: FoodCourtStore | null
  currency: string
  onSave: (data: Partial<FoodCourtStore>) => void
  onClose: () => void
}) {
  const [name, setName] = useState(store?.name ?? '')
  const [subtitle, setSubtitle] = useState(store?.subtitle ?? '')
  const [icon, setIcon] = useState(store?.icon ?? 'coffee')
  const [color, setColor] = useState(store?.color ?? '#6366F1')
  const [taxRate, setTaxRate] = useState(store?.settings.taxRate ?? 12)
  const [receiptFooter, setReceiptFooter] = useState(store?.settings.receiptFooter ?? '')
  const [revenueTarget, setRevenueTarget] = useState(store?.revenueTarget ?? 10000)

  const handleSubmit = () => {
    if (!name.trim()) { toast.error('Store name is required'); return }
    onSave({
      name: name.trim(),
      subtitle: subtitle.trim(),
      icon,
      color,
      revenueTarget,
      settings: { ...store?.settings!, storeName: name.trim(), storeSubtitle: subtitle.trim(), taxRate, receiptFooter, currency, cashierName: store?.settings.cashierName ?? '', logoUrl: store?.settings.logoUrl ?? '' },
    })
  }

  const StoreIcon = STORE_ICONS[icon] ?? Store

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{store ? 'Edit Store' : 'Add New Store'}</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-4 w-4" /></button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-6 admin-scrollbar">
          <div className="space-y-5">
            {/* Preview */}
            <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl text-white" style={{ backgroundColor: color }}>
                <StoreIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{name || 'Store Name'}</p>
                <p className="text-xs text-slate-500">{subtitle || 'Subtitle'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Store Name">
                <input value={name} onChange={(e) => setName(e.target.value)} className="admin-input" placeholder="e.g. Pinoy Grill" />
              </FormField>
              <FormField label="Subtitle">
                <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="admin-input" placeholder="e.g. Filipino Favorites" />
              </FormField>
            </div>

            <FormField label="Icon">
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map((opt) => {
                  const Icon = STORE_ICONS[opt.value] ?? Store
                  return (
                    <button key={opt.value} onClick={() => setIcon(opt.value)} className={cn('flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all', icon === opt.value ? 'border-indigo-400 bg-indigo-50 text-indigo-700 dark:border-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400' : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800')}>
                      <Icon className="h-4 w-4" />
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </FormField>

            <FormField label="Color">
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button key={c} onClick={() => setColor(c)} className={cn('h-8 w-8 rounded-lg border-2 transition-all', color === c ? 'scale-110 border-slate-900 shadow-md dark:border-white' : 'border-transparent hover:scale-105')} style={{ backgroundColor: c }} />
                ))}
              </div>
            </FormField>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Tax Rate (%)">
                <input type="number" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} className="admin-input" min={0} max={100} step={0.5} />
              </FormField>
              <FormField label={`Revenue Target (${currency})`}>
                <input type="number" value={revenueTarget} onChange={(e) => setRevenueTarget(parseInt(e.target.value) || 0)} className="admin-input" min={0} step={1000} />
              </FormField>
            </div>

            <FormField label="Receipt Footer">
              <input value={receiptFooter} onChange={(e) => setReceiptFooter(e.target.value)} className="admin-input" placeholder="e.g. Thank you!" />
            </FormField>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4 dark:border-slate-700">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">Cancel</button>
          <button onClick={handleSubmit} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">{store ? 'Save Changes' : 'Create Store'}</button>
        </div>
      </div>

      <style>{`
        .admin-input {
          width: 100%; height: 2.5rem; border-radius: 0.5rem;
          border: 1px solid #e2e8f0; background: #ffffff;
          padding: 0 0.75rem; font-size: 0.875rem; color: #1e293b;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .admin-input:focus { outline: none; border-color: #818cf8; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
        .dark .admin-input { background: #1e293b; border-color: #334155; color: #f1f5f9; }
        .dark .admin-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.2); }
      `}</style>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-500">{label}</label>
      {children}
    </div>
  )
}

/* ─── Per-Store Analytics ─── */

type Period = 'daily' | 'weekly' | 'monthly'

function getPeriodCutoff(period: Period): number {
  const now = new Date()
  if (period === 'daily') return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  if (period === 'weekly') {
    const d = new Date(now)
    d.setDate(d.getDate() - 6)
    d.setHours(0, 0, 0, 0)
    return d.getTime()
  }
  const d = new Date(now)
  d.setDate(d.getDate() - 29)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function StoreAnalytics({ store, currency, onBack }: { store: FoodCourtStore; currency: string; onBack: () => void }) {
  const [period, setPeriod] = useState<Period>('daily')
  const cutoff = getPeriodCutoff(period)

  const data = useMemo(() => {
    const completed = store.orders.filter((o) => o.status !== 'cancelled' && new Date(o.createdAt).getTime() >= cutoff)
    const totalRevenue = completed.reduce((s, o) => s + o.total, 0)
    const targetPct = store.revenueTarget > 0 ? Math.min(100, Math.round((totalRevenue / store.revenueTarget) * 100)) : 0

    const productSales: Record<string, { name: string; count: number; revenue: number }> = {}
    completed.forEach((order) => {
      order.items.forEach((item) => {
        if (item.productId in productSales) {
          productSales[item.productId].count += item.quantity
          productSales[item.productId].revenue += item.totalPrice
        } else {
          productSales[item.productId] = { name: item.productName, count: item.quantity, revenue: item.totalPrice }
        }
      })
    })
    const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue)

    const cardOrders = completed.filter((o) => o.paymentMethod === 'card')
    const cashOrders = completed.filter((o) => o.paymentMethod === 'cash')
    const cardRevenue = cardOrders.reduce((s, o) => s + o.total, 0)
    const cashRevenue = cashOrders.reduce((s, o) => s + o.total, 0)
    const paymentPie = [{ name: 'Card', value: cardRevenue }, { name: 'Cash', value: cashRevenue }].filter((d) => d.value > 0)

    let trendData: { label: string; sales: number }[] = []
    const trendLabel = period === 'daily' ? 'Hourly Sales' : period === 'weekly' ? 'Daily Sales' : 'Weekly Sales'

    if (period === 'daily') {
      const hours: Record<number, number> = {}
      for (let i = 8; i <= 22; i++) hours[i] = 0
      completed.forEach((o) => {
        const h = new Date(o.createdAt).getHours()
        if (h in hours) hours[h] = (hours[h] ?? 0) + o.total
      })
      trendData = Object.entries(hours).map(([h, v]) => ({ label: `${parseInt(h)}:00`, sales: v }))
    } else if (period === 'weekly') {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const dayBuckets: Record<string, number> = {}
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const key = dayNames[d.getDay()] ?? 'Sun'
        dayBuckets[key] = 0
      }
      completed.forEach((o) => {
        const key = dayNames[new Date(o.createdAt).getDay()] ?? 'Sun'
        if (key in dayBuckets) dayBuckets[key] = (dayBuckets[key] ?? 0) + o.total
      })
      trendData = Object.entries(dayBuckets).map(([l, v]) => ({ label: l, sales: v }))
    } else {
      const buckets: { label: string; start: number; end: number; sales: number }[] = []
      for (let w = 3; w >= 0; w--) {
        const start = new Date(); start.setDate(start.getDate() - (w + 1) * 7 + 1); start.setHours(0, 0, 0, 0)
        const end = new Date(); end.setDate(end.getDate() - w * 7); end.setHours(23, 59, 59, 999)
        buckets.push({ label: `W${4 - w}`, start: start.getTime(), end: end.getTime(), sales: 0 })
      }
      completed.forEach((o) => {
        const t = new Date(o.createdAt).getTime()
        const b = buckets.find((bk) => t >= bk.start && t <= bk.end)
        if (b) b.sales += o.total
      })
      trendData = buckets.map((b) => ({ label: b.label, sales: b.sales }))
    }

    return { totalRevenue, targetPct, topProducts, paymentPie, cardCount: cardOrders.length, cashCount: cashOrders.length, trendData, trendLabel, totalTransactions: completed.length }
  }, [store, cutoff, period])

  const availProducts = store.products.filter((p) => p.available).length
  const periodLabel = period === 'daily' ? "Today's" : period === 'weekly' ? "This Week's" : "This Month's"
  const StoreIcon = STORE_ICONS[store.icon] ?? Store

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600 dark:border-slate-700 dark:hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg text-white" style={{ backgroundColor: store.color }}>
            <StoreIcon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg">{store.name}</h1>
            <p className="text-xs text-slate-500">{store.subtitle} &middot; Store Analytics</p>
          </div>
          <div className="flex items-center gap-2">
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
            <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold', store.status === 'open' && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400', store.status === 'busy' && 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400', store.status === 'closed' && 'bg-slate-100 text-slate-400 dark:bg-slate-800')}>
              <CircleDot className="h-3 w-3" />
              {store.status === 'open' ? 'Open' : store.status === 'busy' ? 'Busy' : 'Closed'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6 admin-scrollbar">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard icon={<DollarSign className="h-5 w-5" />} label={`${periodLabel} Revenue`} value={`${currency}${data.totalRevenue.toLocaleString()}`} accent="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400" />
          <KpiCard icon={<Package className="h-5 w-5" />} label="Products" value={`${availProducts} / ${store.products.length}`} accent="text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400" />
          <KpiCard icon={<Users className="h-5 w-5" />} label="Staff" value={`${store.staff.filter((s) => s.isOnDuty).length} on duty`} accent="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400" />
          <KpiCard icon={<Target className="h-5 w-5" />} label="Target" value={`${data.targetPct}%`} accent={cn(data.targetPct >= 80 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400' : data.targetPct >= 50 ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400' : 'text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400')} />
        </div>

        {/* Charts Row */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="admin-card p-5">
            <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-slate-100">{data.trendLabel}</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                {period === 'daily' ? (
                  <BarChart data={data.trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={{ stroke: 'var(--color-border)' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={{ stroke: 'var(--color-border)' }} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} formatter={(value) => [`${currency}${Number(value).toLocaleString()}`, 'Sales']} />
                    <Bar dataKey="sales" fill={store.color} radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={data.trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={{ stroke: 'var(--color-border)' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={{ stroke: 'var(--color-border)' }} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} formatter={(value) => [`${currency}${Number(value).toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="sales" stroke={store.color} strokeWidth={2.5} dot={{ r: 4, fill: store.color, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          <div className="admin-card p-5">
            <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-slate-100">Payment Methods</h3>
            <div className="h-44">
              {data.paymentPie.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.paymentPie} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                      <Cell fill="#6366f1" />
                      <Cell fill="#10b981" />
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} formatter={(value) => [`${currency}${Number(value).toLocaleString()}`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">No data for this period</div>
              )}
            </div>
            <div className="mt-2 flex justify-center gap-6">
              <span className="flex items-center gap-2 text-xs text-slate-500"><CreditCard className="h-4 w-4 text-indigo-500" /> Card ({data.cardCount})</span>
              <span className="flex items-center gap-2 text-xs text-slate-500"><Banknote className="h-4 w-4 text-emerald-500" /> Cash ({data.cashCount})</span>
            </div>
          </div>
        </div>

        {/* Top Products + Staff */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="admin-card p-5">
            <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-slate-100">Top Products ({periodLabel.replace("'s", "")})</h3>
            {data.topProducts.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-400">No sales data for this period</p>
            ) : (
              <div className="space-y-3">
                {data.topProducts.map((product, i) => {
                  const maxRev = data.topProducts[0]?.revenue ?? 1
                  const pct = (product.revenue / maxRev) * 100
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-900 dark:text-slate-100">{product.name}</span>
                          <span className="font-semibold" style={{ color: store.color }}>{currency}{product.revenue.toLocaleString()}</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: store.color }} />
                        </div>
                        <p className="mt-0.5 text-[10px] text-slate-400">{product.count} sold</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="admin-card p-5">
            <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-slate-100">Staff ({store.staff.length})</h3>
            <div className="space-y-2">
              {store.staff.map((member) => (
                <div key={member.id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                  <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-white', member.isOnDuty ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600')}>
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </div>
                  <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', member.isOnDuty ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500')}>
                    {member.isOnDuty ? 'On Duty' : 'Off'}
                  </span>
                </div>
              ))}
              {store.staff.length === 0 && <p className="py-4 text-center text-sm text-slate-400">No staff assigned</p>}
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

