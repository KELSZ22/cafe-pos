import { useState, useEffect } from 'react'
import type { Product, ProductAddon, ProductSize } from '#/data/pos-data'
import { usePosStore } from '#/store/pos-store'
import { X, Plus, Minus, Check } from 'lucide-react'
import { cn } from '#/lib/utils'

interface AddonsModalProps {
  product: Product
  onClose: () => void
  cartItemId?: string
  initialSize?: ProductSize | null
  initialAddons?: ProductAddon[]
  initialQuantity?: number
}

export default function AddonsModal({
  product,
  onClose,
  cartItemId,
  initialSize,
  initialAddons,
  initialQuantity,
}: AddonsModalProps) {
  const addToCart = usePosStore((s) => s.addToCart)
  const updateCartItemDetails = usePosStore((s) => s.updateCartItemDetails)
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(
    initialSize ?? product.sizes[0] ?? null,
  )
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>(
    initialAddons ?? [],
  )
  const [quantity, setQuantity] = useState(initialQuantity ?? 1)

  useEffect(() => {
    if (initialSize) setSelectedSize(initialSize)
    if (initialAddons) setSelectedAddons(initialAddons)
    if (initialQuantity) setQuantity(initialQuantity)
  }, [initialSize, initialAddons, initialQuantity])

  const toggleAddon = (addon: ProductAddon) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon],
    )
  }

  const unitPrice =
    product.price +
    (selectedSize?.priceModifier ?? 0) +
    selectedAddons.reduce((sum, a) => sum + a.price, 0)

  const totalPrice = unitPrice * quantity

  const handleAdd = () => {
    if (cartItemId) {
      updateCartItemDetails(cartItemId, {
        size: selectedSize,
        addons: selectedAddons,
        quantity,
      })
    } else {
      for (let i = 0; i < quantity; i++) {
        addToCart(product, selectedSize, selectedAddons)
      }
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="animate-scale-in relative mx-4 flex w-full max-w-md flex-col overflow-hidden rounded-3xl bg-cafe-card shadow-2xl">
        <div className="relative h-48 overflow-hidden bg-cafe-cream">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-cafe-text shadow-sm transition hover:bg-cafe-card"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-4">
            <h2 className="text-lg font-bold text-white">{product.name}</h2>
          </div>
        </div>

        <div className="flex max-h-[50vh] flex-col gap-3 overflow-y-auto px-4 py-3 pos-scrollbar">
          <div className="mt-1 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cafe-text-muted">
              Quantity
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-cafe-border bg-cafe-card text-cafe-text transition hover:bg-cafe-cream"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-8 text-center text-lg font-bold text-cafe-text">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-cafe-border bg-cafe-card text-cafe-text transition hover:bg-cafe-cream"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {product.sizes.length > 0 && (
            <div>
              <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-cafe-text-muted">
                Size
              </h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'flex-1 rounded-xl border-2 px-4 py-3 text-center transition-all',
                      selectedSize?.id === size.id
                        ? 'border-cafe-brown bg-cafe-cream text-cafe-brown-dark'
                        : 'border-cafe-border bg-cafe-card text-cafe-text-muted hover:border-cafe-brown-light',
                    )}
                  >
                    <p className="text-sm font-semibold">{size.label}</p>
                    <p className="mt-0.5 text-xs text-cafe-text-muted">
                      {size.priceModifier > 0
                        ? `+₱${size.priceModifier.toLocaleString()}`
                        : 'Base'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.addons.length > 0 && (
            <div>
              <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-cafe-text-muted">
                Add-ons
              </h3>
              <div className="flex flex-col gap-2">
                {product.addons.map((addon) => {
                  const isSelected = selectedAddons.some(
                    (a) => a.id === addon.id,
                  )
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={cn(
                        'flex items-center justify-between rounded-xl border-2 px-4 py-3 transition-all',
                        isSelected
                          ? 'border-cafe-brown bg-cafe-cream'
                          : 'border-cafe-border bg-cafe-card hover:border-cafe-brown-light',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all',
                            isSelected
                              ? 'border-cafe-brown bg-cafe-brown text-white'
                              : 'border-cafe-border',
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                        <span className="text-sm font-medium text-cafe-text">
                          {addon.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-cafe-brown">
                        +₱{addon.price.toLocaleString()}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-cafe-border p-5">
          <button
            onClick={handleAdd}
            className="pos-btn flex w-full items-center justify-center gap-3 rounded-2xl bg-cafe-brown px-6 py-4 text-white shadow-lg shadow-cafe-brown/20 transition hover:bg-cafe-brown-dark"
          >
            <span className="text-base font-bold">
              {cartItemId ? 'Update Item' : 'Add to Cart'}
            </span>
            <span className="rounded-lg bg-white/20 px-3 py-1 text-sm font-bold">
              ₱{totalPrice.toLocaleString()}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
