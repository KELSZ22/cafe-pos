import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { usePosStore } from '#/store/pos-store'
import type { Order } from '#/data/pos-data'
import {
  Clock,
  CheckCircle2,
  ChefHat,
  XCircle,
  Receipt,
  X,
  Search,
  Filter,
} from 'lucide-react'
import { cn } from '#/lib/utils'
import { toast } from 'sonner'

export const Route = createFileRoute('/orders')({ component: OrdersPage })

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-amber-50 text-amber-600 border-amber-200',
    icon: Clock,
    dotColor: 'bg-amber-400',
  },
  preparing: {
    label: 'Preparing',
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    icon: ChefHat,
    dotColor: 'bg-blue-400',
  },
  done: {
    label: 'Done',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    icon: CheckCircle2,
    dotColor: 'bg-emerald-400',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-50 text-red-500 border-red-200',
    icon: XCircle,
    dotColor: 'bg-red-400',
  },
}

function OrdersPage() {
  const orders = usePosStore((s) => s.orders)
  const updateOrderStatus = usePosStore((s) => s.updateOrderStatus)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filteredOrders = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    const matchSearch =
      !search.trim() ||
      o.orderNumber.toString().includes(search) ||
      o.items.some((i) => i.productName.toLowerCase().includes(search.toLowerCase()))
    return matchStatus && matchSearch
  })

  const pendingCount = orders.filter((o) => o.status === 'pending').length
  const preparingCount = orders.filter((o) => o.status === 'preparing').length

  return (
    <div className="flex h-full flex-col overflow-hidden bg-cafe-bg">
      <div className="shrink-0 border-b border-cafe-border bg-cafe-card px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-cafe-text sm:text-lg">Orders</h1>
            <p className="text-xs text-cafe-text-muted">
              {orders.length} total orders today
            </p>
          </div>
          <div className="flex gap-1.5 sm:gap-2">
            {pendingCount > 0 && (
              <div className="flex items-center gap-1 rounded-xl bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-600 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400 sm:h-2 sm:w-2" />
                {pendingCount} pending
              </div>
            )}
            {preparingCount > 0 && (
              <div className="flex items-center gap-1 rounded-xl bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-600 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400 sm:h-2 sm:w-2" />
                {preparingCount} preparing
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cafe-text-light" />
            <input
              type="text"
              placeholder="Search by order # or item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-cafe-border bg-cafe-card pl-10 pr-4 text-sm text-cafe-text placeholder:text-cafe-text-light focus:border-cafe-brown-light focus:outline-none focus:ring-2 focus:ring-cafe-brown-light/20"
            />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-cafe-gray p-1 sm:gap-1.5">
            <Filter className="ml-2 h-3.5 w-3.5 shrink-0 text-cafe-text-light" />
            {['all', 'pending', 'preparing', 'done', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold capitalize transition sm:px-3 sm:text-xs',
                  statusFilter === status
                    ? 'bg-cafe-card text-cafe-text shadow-sm'
                    : 'text-cafe-text-muted hover:text-cafe-text',
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pb-24 sm:p-6 sm:pb-6 pos-scrollbar">
        {filteredOrders.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-cafe-text-light">
            <Receipt className="h-12 w-12" />
            <p className="text-sm font-medium">No orders found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order, i) => {
              const config = statusConfig[order.status]
              const StatusIcon = config.icon
              const time = new Date(order.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })

              return (
                <div
                  key={order.id}
                  className="animate-fade-in pos-card cursor-pointer overflow-hidden transition-all hover:border-cafe-brown-light hover:shadow-md"
                  style={{ animationDelay: `${i * 20}ms` }}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-center justify-between border-b border-cafe-border px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-cafe-text">
                        #{order.orderNumber}
                      </span>
                      <span className="text-xs text-cafe-text-muted">{time}</span>
                    </div>
                    <div
                      className={cn(
                        'flex items-center gap-1.5 rounded-lg border px-2 py-1',
                        config.color,
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      <span className="text-[10px] font-semibold">{config.label}</span>
                    </div>
                  </div>

                  <div className="px-4 py-3">
                    <div className="space-y-1">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-cafe-text-muted">
                            {item.productName}
                            {item.size ? ` (${item.size.label})` : ''} x{item.quantity}
                          </span>
                          <span className="font-medium text-cafe-text">
                            ₱{item.totalPrice.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-xs text-cafe-text-light">
                          +{order.items.length - 3} more items
                        </p>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-dashed border-cafe-border pt-2">
                      <span className="text-xs font-medium text-cafe-text-muted">
                        {order.paymentMethod === 'card' ? '💳 Card' : '💵 Cash'}
                      </span>
                      <span className="text-sm font-bold text-cafe-brown">
                        ₱{order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {(order.status === 'pending' || order.status === 'preparing') && (
                    <div className="flex border-t border-cafe-border">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              updateOrderStatus(order.id, 'preparing')
                              toast.success(`Order #${order.orderNumber} → Preparing`)
                            }}
                            className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                          >
                            <ChefHat className="h-3.5 w-3.5" />
                            Start Preparing
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              updateOrderStatus(order.id, 'cancelled')
                              toast.error(`Order #${order.orderNumber} cancelled`)
                            }}
                            className="flex flex-1 items-center justify-center gap-1.5 border-l border-cafe-border py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Cancel
                          </button>
                        </>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateOrderStatus(order.id, 'done')
                            toast.success(`Order #${order.orderNumber} → Done!`)
                          }}
                          className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Mark as Done
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {selectedOrder && (
        <ReceiptModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  )
}

function ReceiptModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const settings = usePosStore((s) => s.settings)
  const time = new Date(order.createdAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-scale-in relative mx-4 w-full max-w-sm overflow-hidden rounded-3xl bg-cafe-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-cafe-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-cafe-brown" />
            <h2 className="text-base font-bold text-cafe-text">Receipt</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-cafe-gray text-cafe-text-muted transition hover:bg-cafe-cream"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-bold text-cafe-text">{settings.storeName}</h3>
            <p className="text-xs text-cafe-text-muted">{settings.storeSubtitle}</p>
          </div>

          <div className="mb-3 flex items-center justify-between text-xs text-cafe-text-muted">
            <span>Order #{order.orderNumber}</span>
            <span>{time}</span>
          </div>

          <div className="mb-3 border-y border-dashed border-cafe-border py-3">
            {order.items.map((item, i) => (
              <div key={i} className="mb-2 last:mb-0">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-cafe-text">
                    {item.productName} x{item.quantity}
                  </span>
                  <span className="text-cafe-text">₱{item.totalPrice.toLocaleString()}</span>
                </div>
                {(item.size || item.addons.length > 0) && (
                  <p className="text-[10px] text-cafe-text-muted">
                    {[
                      item.size?.label,
                      ...item.addons.map((a) => a.name),
                    ]
                      .filter(Boolean)
                      .join(' • ')}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-cafe-text-muted">Subtotal</span>
              <span className="text-cafe-text">₱{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cafe-text-muted">Tax ({settings.taxRate}%)</span>
              <span className="text-cafe-text">₱{order.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-cafe-border pt-2 text-base">
              <span className="font-bold text-cafe-text">Total</span>
              <span className="font-bold text-cafe-brown">₱{order.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-3 flex justify-between text-xs text-cafe-text-muted">
            <span>Payment: {order.paymentMethod === 'card' ? 'Card' : 'Cash'}</span>
            <span>Cashier: {order.cashierName}</span>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-cafe-text-light">{settings.receiptFooter}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
