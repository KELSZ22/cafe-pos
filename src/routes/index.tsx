import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { usePosStore } from '#/store/pos-store'
import CategorySidebar from '#/components/pos/CategorySidebar'
import ProductGrid from '#/components/pos/ProductGrid'
import { CartContent } from '#/components/pos/CartPanel'
import { ShoppingBag, X } from 'lucide-react'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/')({ component: PosScreen })

function PosScreen() {
  const [cartOpen, setCartOpen] = useState(false)
  const cart = usePosStore((s) => s.cart)
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0)
  const getCartTotal = usePosStore((s) => s.getCartTotal)
  const { total } = getCartTotal()

  return (
    <div className="flex h-full flex-col overflow-hidden lg:flex-row">
      {/* Vertical sidebar on large screens only; horizontal strip rendered inside ProductGrid area for small */}
      <CategorySidebar />

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <ProductGrid />

        {/* Desktop: static cart panel */}
        <div className="hidden h-full w-[320px] shrink-0 border-l border-cafe-border bg-cafe-card lg:block">
          <CartContent />
        </div>
      </div>

      {/* Mobile/tablet: floating cart button (top-right of nav FAB) */}
      {itemCount > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="animate-slide-up fixed bottom-20 right-4 z-30 flex items-center gap-2.5 rounded-2xl bg-cafe-brown px-4 py-3 text-white shadow-xl shadow-cafe-brown/30 transition-all active:scale-95 lg:hidden"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-cafe-card px-1 text-[10px] font-bold text-cafe-brown">
              {itemCount}
            </span>
          </div>
          <span className="text-sm font-bold">₱{total.toLocaleString()}</span>
        </button>
      )}

      {/* Mobile/tablet: slide-over cart */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <div
            className={cn(
              'absolute inset-y-0 right-0 w-full max-w-sm bg-cafe-card shadow-2xl',
              'animate-slide-in-right',
            )}
          >
            <button
              onClick={() => setCartOpen(false)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-cafe-gray text-cafe-text-muted transition hover:bg-cafe-cream"
            >
              <X className="h-4 w-4" />
            </button>
            <CartContent />
          </div>
        </div>
      )}
    </div>
  )
}
