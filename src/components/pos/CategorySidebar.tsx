import { usePosStore } from '#/store/pos-store'
import { Coffee, CupSoda, Leaf, Cake, GlassWater, LayoutGrid } from 'lucide-react'
import { cn } from '#/lib/utils'
import type { ReactNode } from 'react'

const iconMap: Record<string, ReactNode> = {
  coffee: <Coffee className="h-5 w-5" />,
  'cup-soda': <CupSoda className="h-5 w-5" />,
  leaf: <Leaf className="h-5 w-5" />,
  cake: <Cake className="h-5 w-5" />,
  'glass-water': <GlassWater className="h-5 w-5" />,
}

const iconMapSm: Record<string, ReactNode> = {
  coffee: <Coffee className="h-4 w-4" />,
  'cup-soda': <CupSoda className="h-4 w-4" />,
  leaf: <Leaf className="h-4 w-4" />,
  cake: <Cake className="h-4 w-4" />,
  'glass-water': <GlassWater className="h-4 w-4" />,
}

export default function CategorySidebar() {
  const categories = usePosStore((s) => s.categories)
  const selectedCategory = usePosStore((s) => s.selectedCategory)
  const setSelectedCategory = usePosStore((s) => s.setSelectedCategory)
  const products = usePosStore((s) => s.products)

  const allItems = [{ id: 'all', name: 'All', icon: 'all' }, ...categories]

  return (
    <>
      {/* Desktop / large tablet: vertical sidebar */}
      <div className="hidden w-[140px] shrink-0 flex-col gap-2 overflow-y-auto p-3 pos-scrollbar lg:flex">
        <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-cafe-text-light">
          Categories
        </p>
        {allItems.map((cat) => {
          const isActive = selectedCategory === cat.id
          const count =
            cat.id === 'all'
              ? products.filter((p) => p.available).length
              : products.filter((p) => p.category === cat.id && p.available).length

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'pos-btn flex flex-col items-center gap-1.5 rounded-2xl border px-3 py-3 text-center',
                isActive
                  ? 'border-cafe-brown bg-cafe-brown text-white shadow-md shadow-cafe-brown/20'
                  : 'border-cafe-border bg-cafe-card text-cafe-text-muted hover:border-cafe-brown-light hover:bg-cafe-cream',
              )}
            >
              <span className={cn(isActive ? 'text-white' : 'text-cafe-brown-light')}>
                {cat.id === 'all' ? <LayoutGrid className="h-5 w-5" /> : iconMap[cat.icon]}
              </span>
              <span className="text-xs font-semibold leading-tight">{cat.name}</span>
              <span
                className={cn(
                  'text-[10px] font-medium',
                  isActive ? 'text-white/70' : 'text-cafe-text-light',
                )}
              >
                {count} items
              </span>
            </button>
          )
        })}
      </div>

      {/* Small tablet / mobile: horizontal scrollable strip */}
      <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-cafe-border bg-cafe-warm-white px-3 py-2 pos-scrollbar lg:hidden">
        {allItems.map((cat) => {
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'pos-btn flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2',
                isActive
                  ? 'border-cafe-brown bg-cafe-brown text-white shadow-sm shadow-cafe-brown/20'
                  : 'border-cafe-border bg-cafe-card text-cafe-text-muted hover:border-cafe-brown-light hover:bg-cafe-cream',
              )}
            >
              <span className={cn(isActive ? 'text-white' : 'text-cafe-brown-light')}>
                {cat.id === 'all' ? <LayoutGrid className="h-4 w-4" /> : iconMapSm[cat.icon]}
              </span>
              <span className="text-xs font-semibold">{cat.name}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}
