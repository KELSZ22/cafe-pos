import { createFileRoute } from '@tanstack/react-router'
import { useAdminStore } from '#/store/admin-store'
import { cn } from '#/lib/utils'
import { toast } from 'sonner'
import {
  Download,
  TrendingUp,
  CreditCard,
  Banknote,
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
  PieChart,
  Pie,
} from 'recharts'

export const Route = createFileRoute('/admin/reports')({ component: ReportsPage })

function ReportsPage() {
  const stores = useAdminStore((s) => s.stores)
  const settings = useAdminStore((s) => s.settings)
  const getRevenueByStore = useAdminStore((s) => s.getRevenueByStore)

  const revenueByStore = getRevenueByStore()

  const storeComparison = stores.map((store) => {
    const completed = store.orders.filter((o) => o.status !== 'cancelled')
    const revenue = completed.reduce((s, o) => s + o.total, 0)
    const items = completed.reduce((s, o) => s + o.items.reduce((a, i) => a + i.quantity, 0), 0)
    const card = completed.filter((o) => o.paymentMethod === 'card').reduce((s, o) => s + o.total, 0)
    const cash = completed.filter((o) => o.paymentMethod === 'cash').reduce((s, o) => s + o.total, 0)
    const targetPct = store.revenueTarget > 0 ? Math.round((revenue / store.revenueTarget) * 100) : 0
    return { ...store, revenue, items, card, cash, targetPct }
  })

  const topProducts: { name: string; storeName: string; storeColor: string; count: number; revenue: number }[] = []
  stores.forEach((store) => {
    const counts: Record<string, { name: string; count: number; revenue: number }> = {}
    store.orders.filter((o) => o.status !== 'cancelled').forEach((order) => {
      order.items.forEach((item) => {
        if (!counts[item.productId]) counts[item.productId] = { name: item.productName, count: 0, revenue: 0 }
        counts[item.productId]!.count += item.quantity
        counts[item.productId]!.revenue += item.totalPrice
      })
    })
    Object.values(counts).forEach((p) => topProducts.push({ ...p, storeName: store.name, storeColor: store.color }))
  })
  topProducts.sort((a, b) => b.revenue - a.revenue)

  const paymentData = (() => {
    let card = 0; let cash = 0
    stores.forEach((s) => s.orders.filter((o) => o.status !== 'cancelled').forEach((o) => {
      if (o.paymentMethod === 'card') card += o.total
      else cash += o.total
    }))
    return [{ name: 'Card', value: card }, { name: 'Cash', value: cash }]
  })()

  const exportCSV = () => {
    const rows = [
      ['Store', 'Revenue', 'Items Sold', 'Card Revenue', 'Cash Revenue', 'Target %'].join(','),
      ...storeComparison.map((s) =>
        [s.name, s.revenue, s.items, s.card, s.cash, `${s.targetPct}%`].join(','),
      ),
    ]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `food-court-report-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Report exported as CSV')
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg">Reports & Analytics</h1>
            <p className="text-xs text-slate-500">Store comparison and performance insights</p>
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6 admin-scrollbar">
        {/* Comparison Table */}
        <div className="admin-card overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-700 dark:bg-slate-800/50">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Store Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-5 py-3 text-xs font-bold text-slate-500">Store</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-500">Revenue</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-500">Items Sold</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-500">Card Rev.</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-500">Cash Rev.</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">Target</th>
                </tr>
              </thead>
              <tbody>
                {storeComparison.sort((a, b) => b.revenue - a.revenue).map((store) => (
                  <tr key={store.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: store.color }} />
                        <span className="font-medium text-slate-900 dark:text-slate-100">{store.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">{settings.currency}{store.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{store.items}</td>
                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{settings.currency}{store.card.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{settings.currency}{store.cash.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div className={cn('h-full rounded-full', store.targetPct >= 80 ? 'bg-emerald-500' : store.targetPct >= 50 ? 'bg-amber-500' : 'bg-red-400')} style={{ width: `${Math.min(100, store.targetPct)}%` }} />
                        </div>
                        <span className="text-xs font-medium text-slate-500">{store.targetPct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Revenue Chart */}
          <div className="admin-card p-5">
            <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-slate-100">Revenue Comparison</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByStore}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: 'var(--color-border)' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={{ stroke: 'var(--color-border)' }} tickFormatter={(v: number) => `₱${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} formatter={(value: number) => [`₱${value.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                    {revenueByStore.map((entry, idx) => (<Cell key={idx} fill={entry.color} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="admin-card p-5">
            <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-slate-100">Payment Methods</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={paymentData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    <Cell fill="#6366f1" />
                    <Cell fill="#10b981" />
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} formatter={(value: number) => [`₱${value.toLocaleString()}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-center gap-6">
              <span className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400"><CreditCard className="h-4 w-4 text-indigo-500" /> Card</span>
              <span className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400"><Banknote className="h-4 w-4 text-emerald-500" /> Cash</span>
            </div>
          </div>
        </div>

        {/* Top Products Across All Stores */}
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-slate-100">Top Products Across All Stores</h2>
          <div className="admin-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                    <th className="px-5 py-3 text-xs font-bold text-slate-500">#</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500">Product</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500">Store</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-500">Qty Sold</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-500">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.slice(0, 10).map((product, i) => (
                    <tr key={`${product.name}-${product.storeName}`} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                      <td className="px-5 py-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500 dark:bg-slate-800">{i + 1}</span>
                      </td>
                      <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-slate-100">{product.name}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: product.storeColor }} />
                          <span className="text-xs text-slate-500">{product.storeName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400">{product.count}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-slate-900 dark:text-slate-100">{settings.currency}{product.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
