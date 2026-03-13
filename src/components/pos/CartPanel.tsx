import { useState } from 'react'
import { usePosStore, type CartItem } from '#/store/pos-store'
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, Banknote } from 'lucide-react'
import { cn } from '#/lib/utils'
import { toast } from 'sonner'
import AddonsModal from './AddonsModal'

export default function CartPanel() {
  return <CartContent />
}

export function CartContent() {
  const cart = usePosStore((s) => s.cart)
  const getCartTotal = usePosStore((s) => s.getCartTotal)
  const updateCartItemQuantity = usePosStore((s) => s.updateCartItemQuantity)
  const removeFromCart = usePosStore((s) => s.removeFromCart)
  const clearCart = usePosStore((s) => s.clearCart)
  const checkout = usePosStore((s) => s.checkout)
  const [editingItem, setEditingItem] = useState<CartItem | null>(null)

  const { subtotal, tax, total } = getCartTotal()

  const handleCheckout = (method: 'cash' | 'card') => {
    if (cart.length === 0) return
    const order = checkout(method)
    toast.success(`Order #${order.orderNumber} placed!`, {
      description: `Total: ₱${order.total.toLocaleString()} • ${method === 'card' ? 'Card' : 'Cash'}`,
    })
  }

  return (
    <>
      <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-cafe-border px-4 py-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-cafe-brown" />
          <h2 className="text-sm font-bold text-cafe-text">Current Order</h2>
          {cart.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cafe-brown px-1.5 text-[10px] font-bold text-white">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </div>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="rounded-lg px-2 py-1 text-xs font-medium text-cafe-text-muted transition hover:bg-red-50 hover:text-red-500"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 pos-scrollbar">
        {cart.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-cafe-text-light">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cafe-gray">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <p className="text-sm font-medium">No items yet</p>
            <p className="text-xs">Tap a product to add it</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {cart.map((item) => {
              const unitPrice =
                item.product.price +
                (item.size?.priceModifier ?? 0) +
                item.addons.reduce((sum, a) => sum + a.price, 0)
              const itemTotal = unitPrice * item.quantity

              return (
                <div
                  key={item.id}
                  className="animate-fade-in rounded-xl border border-cafe-border bg-cafe-gray-soft p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingItem(item)}
                      className="flex-1 text-left"
                    >
                      <p className="text-sm font-semibold text-cafe-text">
                        {item.product.name}
                      </p>
                      <div className="mt-0.5 flex flex-wrap gap-1">
                        {item.size && (
                          <span className="rounded-md bg-cafe-cream px-1.5 py-0.5 text-[10px] font-medium text-cafe-brown-dark">
                            {item.size.label}
                          </span>
                        )}
                        {item.addons.map((addon) => (
                          <span
                            key={addon.id}
                            className="rounded-md bg-cafe-pink px-1.5 py-0.5 text-[10px] font-medium text-cafe-brown-dark"
                          >
                            {addon.name}
                          </span>
                        ))}
                      </div>
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="shrink-0 rounded-lg p-1 text-cafe-text-light transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-cafe-border bg-cafe-card transition hover:bg-cafe-cream"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-6 text-center text-sm font-bold text-cafe-text">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-cafe-border bg-cafe-card transition hover:bg-cafe-cream"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-cafe-brown">
                      ₱{itemTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-cafe-border bg-cafe-warm-white p-4">
        <div className="mb-3 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-cafe-text-muted">Subtotal</span>
            <span className="font-medium text-cafe-text">₱{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-cafe-text-muted">Tax</span>
            <span className="font-medium text-cafe-text">₱{tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-dashed border-cafe-border pt-1.5">
            <span className="text-base font-bold text-cafe-text">Total</span>
            <span className="text-base font-bold text-cafe-brown">₱{total.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleCheckout('cash')}
            disabled={cart.length === 0}
            className={cn(
              'pos-btn flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-cafe-border bg-cafe-card px-4 py-3.5 font-semibold text-cafe-text transition',
              cart.length === 0
                ? 'cursor-not-allowed opacity-40'
                : 'hover:border-cafe-green hover:bg-cafe-green-light hover:text-cafe-green',
            )}
          >
            <Banknote className="h-4 w-4" />
            <span className="text-sm">Cash</span>
          </button>
          <button
            onClick={() => handleCheckout('card')}
            disabled={cart.length === 0}
            className={cn(
              'pos-btn flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cafe-brown px-4 py-3.5 font-semibold text-white shadow-lg shadow-cafe-brown/20 transition',
              cart.length === 0
                ? 'cursor-not-allowed opacity-40'
                : 'hover:bg-cafe-brown-dark',
            )}
          >
            <CreditCard className="h-4 w-4" />
            <span className="text-sm">Card</span>
          </button>
        </div>
      </div>

      {editingItem && (
        <AddonsModal
          product={editingItem.product}
          cartItemId={editingItem.id}
          initialSize={editingItem.size}
          initialAddons={editingItem.addons}
          initialQuantity={editingItem.quantity}
          onClose={() => setEditingItem(null)}
        />
      )}
      </div>
    </>
  )
}
