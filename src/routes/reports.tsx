import { createFileRoute } from '@tanstack/react-router'
import { usePosStore } from '#/store/pos-store'
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Coffee,
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'

export const Route = createFileRoute('/reports')({ component: ReportsPage })

function ReportsPage() {
  const orders = usePosStore((s) => s.orders)
  const products = usePosStore((s) => s.products)
  const categories = usePosStore((s) => s.categories)
  const settings = usePosStore((s) => s.settings)

  const completedOrders = orders.filter((o) => o.status !== 'cancelled')
  const totalSales = completedOrders.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = completedOrders.length
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0

  const topProducts = (() => {
    const counts: Record<string, { name: string; count: number; revenue: number }> = {}
    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!counts[item.productId]) {
          counts[item.productId] = { name: item.productName, count: 0, revenue: 0 }
        }
        counts[item.productId]!.count += item.quantity
        counts[item.productId]!.revenue += item.totalPrice
      })
    })
    return Object.values(counts)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6)
  })()

  const categorySales = categories.map((cat) => {
    const catProducts = products.filter((p) => p.category === cat.id).map((p) => p.id)
    const revenue = completedOrders.reduce(
      (sum, order) =>
        sum +
        order.items
          .filter((item) => catProducts.includes(item.productId))
          .reduce((s, item) => s + item.totalPrice, 0),
      0,
    )
    return { name: cat.name, value: revenue }
  }).filter((c) => c.value > 0)

  const PIE_COLORS = ['#8B6F47', '#C4A882', '#D4A574', '#7CB68E', '#E07A5F']

  const hourlyData = (() => {
    const hours: Record<number, number> = {}
    for (let i = 8; i <= 22; i++) hours[i] = 0
    completedOrders.forEach((order) => {
      const h = new Date(order.createdAt).getHours()
      if (hours[h] !== undefined) hours[h]! += order.total
    })
    return Object.entries(hours).map(([hour, amount]) => ({
      hour: `${parseInt(hour)}:00`,
      sales: amount,
    }))
  })()

  const paymentSplit = {
    card: completedOrders.filter((o) => o.paymentMethod === 'card').length,
    cash: completedOrders.filter((o) => o.paymentMethod === 'cash').length,
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-cafe-bg">
      <div className="shrink-0 border-b border-cafe-border bg-cafe-card px-4 py-3 sm:px-6 sm:py-4">
        <h1 className="text-base font-bold text-cafe-text sm:text-lg">Reports & Analytics</h1>
        <p className="text-xs text-cafe-text-muted">Today's performance overview</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pb-24 sm:p-6 sm:pb-6 pos-scrollbar">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<DollarSign className="h-5 w-5" />}
            label="Total Sales"
            value={`${settings.currency}${totalSales.toLocaleString()}`}
            color="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            icon={<ShoppingCart className="h-5 w-5" />}
            label="Total Orders"
            value={totalOrders.toString()}
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Avg. Order Value"
            value={`${settings.currency}${avgOrderValue.toLocaleString()}`}
            color="bg-amber-50 text-amber-600"
          />
          <StatCard
            icon={<Coffee className="h-5 w-5" />}
            label="Items Sold"
            value={completedOrders
              .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)
              .toString()}
            color="bg-purple-50 text-purple-600"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="pos-card p-5">
            <h3 className="mb-4 text-sm font-bold text-cafe-text">Hourly Sales</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" />
                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 10, fill: '#8E7E70' }}
                    axisLine={{ stroke: '#EDE8E3' }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#8E7E70' }}
                    axisLine={{ stroke: '#EDE8E3' }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #EDE8E3',
                      boxShadow: '0 4px 12px rgba(139,111,71,0.08)',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`₱${value.toLocaleString()}`, 'Sales']}
                  />
                  <Bar dataKey="sales" fill="#8B6F47" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pos-card p-5">
            <h3 className="mb-4 text-sm font-bold text-cafe-text">Sales by Category</h3>
            <div className="h-56">
              {categorySales.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categorySales}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {categorySales.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #EDE8E3',
                        fontSize: '12px',
                      }}
                      formatter={(value: number) => [`₱${value.toLocaleString()}`, 'Revenue']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-cafe-text-light">
                  No data yet
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="pos-card p-5 lg:col-span-2">
            <h3 className="mb-4 text-sm font-bold text-cafe-text">Top Products</h3>
            <div className="space-y-3">
              {topProducts.length === 0 ? (
                <p className="text-sm text-cafe-text-light">No sales data yet</p>
              ) : (
                topProducts.map((product, i) => {
                  const maxRevenue = topProducts[0]?.revenue ?? 1
                  const pct = (product.revenue / maxRevenue) * 100
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cafe-cream text-xs font-bold text-cafe-brown">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-cafe-text">{product.name}</span>
                          <span className="font-semibold text-cafe-brown">
                            ₱{product.revenue.toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-cafe-gray">
                          <div
                            className="h-full rounded-full bg-cafe-brown transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="mt-0.5 text-[10px] text-cafe-text-light">
                          {product.count} sold
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="pos-card p-5">
            <h3 className="mb-4 text-sm font-bold text-cafe-text">Payment Methods</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-xl bg-cafe-gray-soft p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-cafe-text">Card</p>
                  <p className="text-xs text-cafe-text-muted">
                    {paymentSplit.card} orders
                  </p>
                </div>
                <span className="text-lg font-bold text-cafe-text">
                  {totalOrders > 0
                    ? Math.round((paymentSplit.card / totalOrders) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-cafe-gray-soft p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <Banknote className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-cafe-text">Cash</p>
                  <p className="text-xs text-cafe-text-muted">
                    {paymentSplit.cash} orders
                  </p>
                </div>
                <span className="text-lg font-bold text-cafe-text">
                  {totalOrders > 0
                    ? Math.round((paymentSplit.cash / totalOrders) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 text-xs font-bold text-cafe-text-muted">Sales Trend</h4>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyData}>
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#8B6F47"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}) {
  return (
    <div className="pos-card flex items-center gap-3 p-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-cafe-text-muted">{label}</p>
        <p className="text-lg font-bold text-cafe-text">{value}</p>
      </div>
    </div>
  )
}
