import { useState } from 'react'
import { usePosStore } from '#/store/pos-store'
import type { Product } from '#/data/pos-data'
import ProductCard from './ProductCard'
import AddonsModal from './AddonsModal'
import { Search } from 'lucide-react'

export default function ProductGrid() {
  const selectedCategory = usePosStore((s) => s.selectedCategory)
  const getProductsByCategory = usePosStore((s) => s.getProductsByCategory)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [search, setSearch] = useState('')

  let filteredProducts = getProductsByCategory(selectedCategory)

  if (search.trim()) {
    const q = search.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-cafe-border bg-cafe-warm-white px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cafe-text-light" />
          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-cafe-border bg-cafe-card pl-10 pr-4 text-sm text-cafe-text placeholder:text-cafe-text-light focus:border-cafe-brown-light focus:outline-none focus:ring-2 focus:ring-cafe-brown-light/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pb-24 sm:p-4 sm:pb-4 pos-scrollbar">
        {filteredProducts.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-cafe-text-muted">
            <span className="text-4xl">🔍</span>
            <p className="text-sm font-medium">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 xl:grid-cols-4">
            {filteredProducts.map((product, i) => (
              <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                <ProductCard product={product} onClick={setSelectedProduct} />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <AddonsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  )
}
