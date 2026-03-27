import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAdminStore } from '#/store/admin-store'
import { cn } from '#/lib/utils'
import { toast } from 'sonner'
import {
  Search,
  Package,
  Check,
  XCircle,
  Coffee,
  Beef,
  Soup,
  CakeSlice,
  GlassWater,
  Flame,
  Store,
} from 'lucide-react'

export const Route = createFileRoute('/admin/products')({ component: ProductsPage })

const STORE_ICONS: Record<string, React.ElementType> = {
  coffee: Coffee, beef: Beef, soup: Soup,
  'cake-slice': CakeSlice, 'glass-water': GlassWater, flame: Flame,
}

function ProductsPage() {
  const stores = useAdminStore((s) => s.stores)
  const settings = useAdminStore((s) => s.settings)
  const toggleProductAvailability = useAdminStore((s) => s.toggleProductAvailability)
  const updateProductPrice = useAdminStore((s) => s.updateProductPrice)

  const [searchQuery, setSearchQuery] = useState('')
  const [storeFilter, setStoreFilter] = useState('all')
  const [availFilter, setAvailFilter] = useState<'all' | 'available' | 'unavailable'>('all')
  const [editingPrice, setEditingPrice] = useState<{ storeId: string; productId: string; price: string } | null>(null)

  const allProducts = stores.flatMap((store) =>
    store.products.map((product) => ({
      ...product,
      storeId: store.id,
      storeName: store.name,
      storeColor: store.color,
      storeIcon: store.icon,
      categoryName: store.categories.find((c) => c.id === product.category)?.name ?? product.category,
    })),
  )

  const filtered = allProducts.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (storeFilter !== 'all' && p.storeId !== storeFilter) return false
    if (availFilter === 'available' && !p.available) return false
    if (availFilter === 'unavailable' && p.available) return false
    return true
  })

  const totalProducts = allProducts.length
  const availableCount = allProducts.filter((p) => p.available).length
  const unavailableCount = totalProducts - availableCount

  const handlePriceSave = () => {
    if (!editingPrice) return
    const newPrice = parseFloat(editingPrice.price)
    if (isNaN(newPrice) || newPrice < 0) { toast.error('Invalid price'); return }
    updateProductPrice(editingPrice.storeId, editingPrice.productId, newPrice)
    toast.success('Price updated')
    setEditingPrice(null)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg">Product Management</h1>
            <p className="text-xs text-slate-500">{totalProducts} products &middot; {availableCount} available &middot; {unavailableCount} unavailable</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6 admin-scrollbar">
        {/* Summary Cards */}
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stores.map((store) => {
            const StoreIcon = STORE_ICONS[store.icon] ?? Store
            const products = store.products
            const avail = products.filter((p) => p.available).length
            return (
              <button
                key={store.id}
                onClick={() => setStoreFilter(storeFilter === store.id ? 'all' : store.id)}
                className={cn(
                  'admin-card flex items-center gap-3 p-3 text-left transition-all',
                  storeFilter === store.id && 'ring-2 ring-indigo-400',
                )}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white" style={{ backgroundColor: store.color }}>
                  <StoreIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">{store.name}</p>
                  <p className="text-[10px] text-slate-500">{avail}/{products.length} available</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:ring-indigo-900"
            />
          </div>
          <select
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="all">All Stores</option>
            {stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700">
            {(['all', 'available', 'unavailable'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setAvailFilter(f)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium transition-colors first:rounded-l-lg last:rounded-r-lg',
                  availFilter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800',
                )}
              >
                {f === 'all' ? 'All' : f === 'available' ? 'Available' : 'Unavailable'}
              </button>
            ))}
          </div>
        </div>

        {/* Product Table */}
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">Product</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">Store</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-500">Price</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">Status</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={`${product.storeId}-${product.id}`} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold', product.available ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800')}>
                          <Package className="h-4 w-4" />
                        </div>
                        <span className={cn('font-medium', product.available ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 line-through')}>{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: product.storeColor }} />
                        <span className="text-xs text-slate-600 dark:text-slate-400">{product.storeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800">{product.categoryName}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {editingPrice?.storeId === product.storeId && editingPrice?.productId === product.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            value={editingPrice.price}
                            onChange={(e) => setEditingPrice({ ...editingPrice, price: e.target.value })}
                            className="w-20 rounded border border-indigo-300 bg-white px-2 py-0.5 text-right text-xs dark:border-indigo-700 dark:bg-slate-800"
                            min={0}
                            autoFocus
                            onKeyDown={(e) => { if (e.key === 'Enter') handlePriceSave(); if (e.key === 'Escape') setEditingPrice(null) }}
                          />
                          <button onClick={handlePriceSave} className="rounded bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white">OK</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingPrice({ storeId: product.storeId, productId: product.id, price: product.price.toString() })}
                          className="font-semibold text-slate-900 hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400"
                          title="Click to edit price"
                        >
                          {settings.currency}{product.price.toLocaleString()}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold', product.available ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400')}>
                        {product.available ? <Check className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {product.available ? 'Available' : '86\'d'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          toggleProductAvailability(product.storeId, product.id)
                          toast.success(`${product.name} is now ${product.available ? 'unavailable' : 'available'}`)
                        }}
                        className={cn(
                          'rounded-lg px-3 py-1 text-xs font-semibold transition-colors',
                          product.available
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50',
                        )}
                      >
                        {product.available ? 'Mark 86\'d' : 'Restore'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">No products match your filters</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category breakdown per store */}
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-slate-100">Menu by Store</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {stores.map((store) => {
              const StoreIcon = STORE_ICONS[store.icon] ?? Store
              return (
                <div key={store.id} className="admin-card overflow-hidden">
                  <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ backgroundColor: store.color }}>
                      <StoreIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{store.name}</p>
                      <p className="text-[10px] text-slate-500">{store.products.filter((p) => p.available).length} of {store.products.length} available</p>
                    </div>
                  </div>
                  <div className="p-3">
                    {store.categories.map((cat) => {
                      const catProducts = store.products.filter((p) => p.category === cat.id)
                      if (catProducts.length === 0) return null
                      return (
                        <div key={cat.id} className="mb-2 last:mb-0">
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{cat.name}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {catProducts.map((p) => (
                              <span key={p.id} className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium', p.available ? 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300' : 'bg-red-50/50 text-red-400 line-through dark:bg-red-950/20')}>
                                {p.name}
                                <span className="text-[10px] text-slate-400">{settings.currency}{p.price}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
