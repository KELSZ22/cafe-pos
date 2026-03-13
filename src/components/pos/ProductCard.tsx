import { useState } from 'react'
import type { Product } from '#/data/pos-data'
import { cn } from '#/lib/utils'

interface ProductCardProps {
  product: Product
  onClick: (product: Product) => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showPlaceholder = imageFailed || !product.image

  return (
    <button
      onClick={() => onClick(product)}
      className={cn(
        'pos-card pos-card-hover flex min-h-64 min-w-40 flex-col overflow-hidden text-left',
        !product.available && 'pointer-events-none opacity-50',
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-cafe-gray">
        {!showPlaceholder && (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
        {showPlaceholder && (
          <div className="flex h-full w-full items-center justify-center bg-cafe-cream">
            <span className="text-3xl">☕</span>
          </div>
        )}
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-cafe-text">
              Sold Out
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-xs font-medium text-cafe-text-muted">
          {product.nameFil}
        </p>
        <p className="text-sm font-semibold leading-tight text-cafe-text">
          {product.name}
        </p>
        <p className="mt-auto pt-1 text-sm font-bold text-cafe-brown">
          ₱{product.price.toLocaleString()}
        </p>
      </div>
    </button>
  )
}
