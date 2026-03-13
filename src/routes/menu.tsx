import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { usePosStore } from '#/store/pos-store'
import type { Product, Category, ProductAddon, ProductSize } from '#/data/pos-data'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  ImageIcon,
  Package,
  Tag,
  Check,
  Cookie,
  Ruler,
} from 'lucide-react'
import { cn } from '#/lib/utils'
import { toast } from 'sonner'

export const Route = createFileRoute('/menu')({ component: MenuManagement })

type TabKey = 'products' | 'categories' | 'addons' | 'sizes'

function MenuManagement() {
  const products = usePosStore((s) => s.products)
  const categories = usePosStore((s) => s.categories)
  const globalAddons = usePosStore((s) => s.globalAddons)
  const globalSizes = usePosStore((s) => s.globalSizes)
  const addProduct = usePosStore((s) => s.addProduct)
  const updateProduct = usePosStore((s) => s.updateProduct)
  const deleteProduct = usePosStore((s) => s.deleteProduct)
  const addCategory = usePosStore((s) => s.addCategory)
  const deleteCategory = usePosStore((s) => s.deleteCategory)
  const addGlobalAddon = usePosStore((s) => s.addGlobalAddon)
  const updateGlobalAddon = usePosStore((s) => s.updateGlobalAddon)
  const deleteGlobalAddon = usePosStore((s) => s.deleteGlobalAddon)
  const addGlobalSize = usePosStore((s) => s.addGlobalSize)
  const updateGlobalSize = usePosStore((s) => s.updateGlobalSize)
  const deleteGlobalSize = usePosStore((s) => s.deleteGlobalSize)

  const [activeTab, setActiveTab] = useState<TabKey>('products')
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showAddonForm, setShowAddonForm] = useState(false)
  const [editingAddon, setEditingAddon] = useState<ProductAddon | null>(null)
  const [showSizeForm, setShowSizeForm] = useState(false)
  const [editingSize, setEditingSize] = useState<ProductSize | null>(null)

  const filtered = products.filter((p) => {
    const matchSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.nameFil.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'all' || p.category === filterCat
    return matchSearch && matchCat
  })

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'products', label: 'Products' },
    { key: 'categories', label: 'Categories' },
    { key: 'addons', label: 'Add-ons' },
    { key: 'sizes', label: 'Sizes' },
  ]

  const headerActions: Record<TabKey, { label: string; shortLabel: string; fn: () => void }> = {
    products: {
      label: 'Add Product',
      shortLabel: 'Add',
      fn: () => {
        setEditingProduct(null)
        setShowProductForm(true)
      },
    },
    categories: {
      label: 'Add Category',
      shortLabel: 'Add',
      fn: () => setShowCategoryForm(true),
    },
    addons: {
      label: 'Add Add-on',
      shortLabel: 'Add',
      fn: () => {
        setEditingAddon(null)
        setShowAddonForm(true)
      },
    },
    sizes: {
      label: 'Add Size',
      shortLabel: 'Add',
      fn: () => {
        setEditingSize(null)
        setShowSizeForm(true)
      },
    },
  }

  const action = headerActions[activeTab]

  return (
    <div className="flex h-full flex-col overflow-hidden bg-cafe-bg">
      <div className="shrink-0 border-b border-cafe-border bg-cafe-card px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-cafe-text sm:text-lg">Menu Management</h1>
            <p className="text-xs text-cafe-text-muted">
              {products.length} products &bull; {categories.length} categories &bull;{' '}
              {globalAddons.length} add-ons &bull; {globalSizes.length} sizes
            </p>
          </div>
          <button
            onClick={action.fn}
            className="pos-btn flex items-center gap-1.5 rounded-xl bg-cafe-brown px-3 py-2 text-xs font-semibold text-white shadow-md shadow-cafe-brown/20 transition hover:bg-cafe-brown-dark sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{action.label}</span>
            <span className="sm:hidden">{action.shortLabel}</span>
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex overflow-x-auto rounded-xl bg-cafe-gray p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition sm:px-4 sm:py-2 sm:text-sm',
                  activeTab === tab.key
                    ? 'bg-cafe-card text-cafe-text shadow-sm'
                    : 'text-cafe-text-muted hover:text-cafe-text',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'products' && (
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cafe-text-light" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-full rounded-xl border border-cafe-border bg-cafe-card pl-10 pr-4 text-sm text-cafe-text placeholder:text-cafe-text-light focus:border-cafe-brown-light focus:outline-none focus:ring-2 focus:ring-cafe-brown-light/20"
                />
              </div>
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="h-10 shrink-0 rounded-xl border border-cafe-border bg-cafe-card px-2 text-xs text-cafe-text focus:border-cafe-brown-light focus:outline-none sm:px-3 sm:text-sm"
              >
                <option value="all">All</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pb-24 sm:p-6 sm:pb-6 pos-scrollbar">
        {activeTab === 'products' && (
          <ProductsTab
            products={filtered}
            onEdit={(p) => {
              setEditingProduct(p)
              setShowProductForm(true)
            }}
            onDelete={(p) => {
              deleteProduct(p.id)
              toast.success(`${p.name} deleted`)
            }}
            onToggle={(p) => {
              updateProduct(p.id, { available: !p.available })
              toast.success(`${p.name} ${p.available ? 'hidden' : 'activated'}`)
            }}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesTab
            categories={categories}
            products={products}
            onDelete={(cat) => {
              deleteCategory(cat.id)
              toast.success(`${cat.name} deleted`)
            }}
          />
        )}

        {activeTab === 'addons' && (
          <AddonsTab
            addons={globalAddons}
            products={products}
            onEdit={(addon) => {
              setEditingAddon(addon)
              setShowAddonForm(true)
            }}
            onDelete={(addon) => {
              deleteGlobalAddon(addon.id)
              toast.success(`${addon.name} removed`)
            }}
          />
        )}

        {activeTab === 'sizes' && (
          <SizesTab
            sizes={globalSizes}
            products={products}
            onEdit={(size) => {
              setEditingSize(size)
              setShowSizeForm(true)
            }}
            onDelete={(size) => {
              deleteGlobalSize(size.id)
              toast.success(`${size.label} removed`)
            }}
          />
        )}
      </div>

      {showProductForm && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          globalAddons={globalAddons}
          globalSizes={globalSizes}
          onSave={(data) => {
            if (editingProduct) {
              updateProduct(editingProduct.id, data)
              toast.success(`${data.name ?? editingProduct.name} updated`)
            } else {
              addProduct({
                ...data,
                id: `product-${Date.now()}`,
                available: true,
              } as Product)
              toast.success(`${data.name} added`)
            }
            setShowProductForm(false)
            setEditingProduct(null)
          }}
          onClose={() => {
            setShowProductForm(false)
            setEditingProduct(null)
          }}
        />
      )}

      {showCategoryForm && (
        <CategoryFormModal
          onSave={(data) => {
            addCategory({
              ...data,
              id: data.name.toLowerCase().replace(/\s+/g, '-'),
            })
            toast.success(`${data.name} category added`)
            setShowCategoryForm(false)
          }}
          onClose={() => setShowCategoryForm(false)}
        />
      )}

      {showAddonForm && (
        <AddonFormModal
          addon={editingAddon}
          onSave={(data) => {
            if (editingAddon) {
              updateGlobalAddon(editingAddon.id, data)
              toast.success(`${data.name ?? editingAddon.name} updated`)
            } else {
              const id = (data.name ?? '')
                .toLowerCase()
                .replace(/\s+/g, '-')
                .concat(`-${Date.now()}`)
              addGlobalAddon({ id, name: data.name!, price: data.price! })
              toast.success(`${data.name} add-on created`)
            }
            setShowAddonForm(false)
            setEditingAddon(null)
          }}
          onClose={() => {
            setShowAddonForm(false)
            setEditingAddon(null)
          }}
        />
      )}

      {showSizeForm && (
        <SizeFormModal
          size={editingSize}
          onSave={(data) => {
            if (editingSize) {
              updateGlobalSize(editingSize.id, data)
              toast.success(`${data.label ?? editingSize.label} updated`)
            } else {
              const id = (data.label ?? '')
                .toLowerCase()
                .replace(/\s+/g, '-')
                .concat(`-${Date.now()}`)
              addGlobalSize({ id, label: data.label!, priceModifier: data.priceModifier! })
              toast.success(`${data.label} size created`)
            }
            setShowSizeForm(false)
            setEditingSize(null)
          }}
          onClose={() => {
            setShowSizeForm(false)
            setEditingSize(null)
          }}
        />
      )}
    </div>
  )
}

/* ─── Products Tab ─── */

function ProductsTab({
  products,
  onEdit,
  onDelete,
  onToggle,
}: {
  products: Product[]
  onEdit: (p: Product) => void
  onDelete: (p: Product) => void
  onToggle: (p: Product) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, i) => (
        <div
          key={product.id}
          className="animate-fade-in pos-card flex overflow-hidden"
          style={{ animationDelay: `${i * 20}ms` }}
        >
          <div className="h-24 w-24 shrink-0 overflow-hidden bg-cafe-cream">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.parentElement!.innerHTML = `<div class="flex h-full w-full items-center justify-center"><span class="text-2xl">☕</span></div>`
              }}
            />
          </div>
          <div className="flex flex-1 flex-col justify-between p-3">
            <div>
              <div className="flex items-start justify-between gap-1">
                <div>
                  <p className="text-sm font-semibold text-cafe-text">{product.name}</p>
                  <p className="text-[10px] text-cafe-text-muted">{product.nameFil}</p>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                    product.available
                      ? 'bg-cafe-green-light text-cafe-green'
                      : 'bg-red-50 text-red-500',
                  )}
                >
                  {product.available ? 'Active' : 'Hidden'}
                </span>
              </div>
              <p className="mt-1 text-xs font-bold text-cafe-brown">
                ₱{product.price.toLocaleString()}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {product.sizes.length > 0 && (
                  <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-medium text-blue-600">
                    {product.sizes.length} size{product.sizes.length > 1 && 's'}
                  </span>
                )}
                {product.addons.length > 0 && (
                  <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[9px] font-medium text-purple-600">
                    {product.addons.length} add-on{product.addons.length > 1 && 's'}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-2 flex gap-1">
              <button
                onClick={() => onEdit(product)}
                className="flex h-7 items-center gap-1 rounded-lg bg-cafe-cream px-2 text-[10px] font-medium text-cafe-brown-dark transition hover:bg-cafe-cream-dark"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
              <button
                onClick={() => onDelete(product)}
                className="flex h-7 items-center gap-1 rounded-lg bg-red-50 px-2 text-[10px] font-medium text-red-500 transition hover:bg-red-100"
              >
                <Trash2 className="h-3 w-3" />
              </button>
              <button
                onClick={() => onToggle(product)}
                className="flex h-7 items-center rounded-lg bg-cafe-gray px-2 text-[10px] font-medium text-cafe-text-muted transition hover:bg-cafe-cream"
              >
                {product.available ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Categories Tab ─── */

function CategoriesTab({
  categories,
  products,
  onDelete,
}: {
  categories: Category[]
  products: Product[]
  onDelete: (cat: Category) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((cat, i) => {
        const count = products.filter((p) => p.category === cat.id).length
        return (
          <div
            key={cat.id}
            className="animate-fade-in pos-card flex items-center gap-3 p-4"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cafe-cream">
              <Tag className="h-5 w-5 text-cafe-brown" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-cafe-text">{cat.name}</p>
              <p className="text-[10px] text-cafe-text-muted">
                {cat.nameFil} &bull; {count} items
              </p>
            </div>
            <button
              onClick={() => onDelete(cat)}
              className="rounded-lg p-1.5 text-cafe-text-light transition hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Add-ons Tab ─── */

function AddonsTab({
  addons,
  products,
  onEdit,
  onDelete,
}: {
  addons: ProductAddon[]
  products: Product[]
  onEdit: (a: ProductAddon) => void
  onDelete: (a: ProductAddon) => void
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {addons.map((addon, i) => {
          const usedIn = products.filter((p) => p.addons.some((a) => a.id === addon.id))
          return (
            <div
              key={addon.id}
              className="animate-fade-in pos-card flex items-center gap-3 p-4"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50">
                <Cookie className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-cafe-text">{addon.name}</p>
                <p className="text-[10px] text-cafe-text-muted">
                  +₱{addon.price.toLocaleString()} &bull; Used in {usedIn.length} product
                  {usedIn.length !== 1 && 's'}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(addon)}
                  className="rounded-lg p-1.5 text-cafe-text-light transition hover:bg-cafe-cream hover:text-cafe-brown"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDelete(addon)}
                  className="rounded-lg p-1.5 text-cafe-text-light transition hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {addons.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-cafe-text-muted">
          <Cookie className="mb-3 h-10 w-10 opacity-30" />
          <p className="text-sm font-medium">No add-ons yet</p>
          <p className="text-xs">Create your first add-on to get started</p>
        </div>
      )}
    </div>
  )
}

/* ─── Sizes Tab ─── */

function SizesTab({
  sizes,
  products,
  onEdit,
  onDelete,
}: {
  sizes: ProductSize[]
  products: Product[]
  onEdit: (s: ProductSize) => void
  onDelete: (s: ProductSize) => void
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sizes.map((size, i) => {
          const usedIn = products.filter((p) => p.sizes.some((s) => s.id === size.id))
          return (
            <div
              key={size.id}
              className="animate-fade-in pos-card flex items-center gap-3 p-4"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <Ruler className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-cafe-text">{size.label}</p>
                <p className="text-[10px] text-cafe-text-muted">
                  {size.priceModifier > 0
                    ? `+₱${size.priceModifier.toLocaleString()}`
                    : 'Base price'}{' '}
                  &bull; Used in {usedIn.length} product{usedIn.length !== 1 && 's'}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(size)}
                  className="rounded-lg p-1.5 text-cafe-text-light transition hover:bg-cafe-cream hover:text-cafe-brown"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDelete(size)}
                  className="rounded-lg p-1.5 text-cafe-text-light transition hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {sizes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-cafe-text-muted">
          <Ruler className="mb-3 h-10 w-10 opacity-30" />
          <p className="text-sm font-medium">No sizes yet</p>
          <p className="text-xs">Create your first size option to get started</p>
        </div>
      )}
    </div>
  )
}

/* ─── Product Form Modal (with add-on & size picker) ─── */

function ProductFormModal({
  product,
  categories,
  globalAddons,
  globalSizes,
  onSave,
  onClose,
}: {
  product: Product | null
  categories: Category[]
  globalAddons: ProductAddon[]
  globalSizes: ProductSize[]
  onSave: (data: Partial<Product>) => void
  onClose: () => void
}) {
  const [name, setName] = useState(product?.name ?? '')
  const [nameFil, setNameFil] = useState(product?.nameFil ?? '')
  const [category, setCategory] = useState(product?.category ?? categories[0]?.id ?? '')
  const [price, setPrice] = useState(product?.price?.toString() ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [image, setImage] = useState(product?.image ?? '')

  const [selectedAddonIds, setSelectedAddonIds] = useState<Set<string>>(
    new Set(product?.addons.map((a) => a.id) ?? []),
  )
  const [selectedSizeIds, setSelectedSizeIds] = useState<Set<string>>(
    new Set(product?.sizes.map((s) => s.id) ?? []),
  )

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSize = (id: string) => {
    setSelectedSizeIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAllAddons = () => {
    if (selectedAddonIds.size === globalAddons.length) {
      setSelectedAddonIds(new Set())
    } else {
      setSelectedAddonIds(new Set(globalAddons.map((a) => a.id)))
    }
  }

  const selectAllSizes = () => {
    if (selectedSizeIds.size === globalSizes.length) {
      setSelectedSizeIds(new Set())
    } else {
      setSelectedSizeIds(new Set(globalSizes.map((s) => s.id)))
    }
  }

  const handleSubmit = () => {
    if (!name.trim() || !price.trim()) return
    onSave({
      name: name.trim(),
      nameFil: nameFil.trim(),
      category,
      price: parseInt(price, 10),
      description: description.trim(),
      image: image.trim(),
      sizes: globalSizes.filter((s) => selectedSizeIds.has(s.id)),
      addons: globalAddons.filter((a) => selectedAddonIds.has(a.id)),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-scale-in relative mx-4 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-cafe-card shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-cafe-border px-6 py-4">
          <h2 className="text-lg font-bold text-cafe-text">
            {product ? 'Edit Product' : 'New Product'}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-cafe-gray text-cafe-text-muted transition hover:bg-cafe-cream"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pos-scrollbar">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Product Name" icon={<Package className="h-4 w-4" />}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Americano"
                  className="form-input"
                />
              </FormField>
              <FormField label="Filipino Name">
                <input
                  value={nameFil}
                  onChange={(e) => setNameFil(e.target.value)}
                  placeholder="e.g. Kapeng Amerikano"
                  className="form-input"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Category">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Price (₱)">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="4500"
                  className="form-input"
                />
              </FormField>
            </div>

            <FormField label="Description">
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description..."
                className="form-input"
              />
            </FormField>

            <FormField label="Image URL" icon={<ImageIcon className="h-4 w-4" />}>
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="form-input"
              />
            </FormField>

            {/* Sizes picker */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-cafe-text-muted">
                  <Ruler className="h-3.5 w-3.5" />
                  Sizes
                </label>
                <button
                  type="button"
                  onClick={selectAllSizes}
                  className="text-[10px] font-semibold text-cafe-brown hover:underline"
                >
                  {selectedSizeIds.size === globalSizes.length ? 'Deselect all' : 'Select all'}
                </button>
              </div>
              {globalSizes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {globalSizes.map((size) => {
                    const selected = selectedSizeIds.has(size.id)
                    return (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => toggleSize(size.id)}
                        className={cn(
                          'flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-xs font-medium transition-all',
                          selected
                            ? 'border-blue-400 bg-blue-50 text-blue-700'
                            : 'border-cafe-border bg-cafe-card text-cafe-text-muted hover:border-blue-300',
                        )}
                      >
                        {selected && <Check className="h-3 w-3" />}
                        {size.label}
                        {size.priceModifier > 0 && (
                          <span className="opacity-60">+₱{size.priceModifier}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className="text-xs text-cafe-text-light">
                  No sizes available. Create one in the Sizes tab.
                </p>
              )}
            </div>

            {/* Add-ons picker */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-cafe-text-muted">
                  <Cookie className="h-3.5 w-3.5" />
                  Add-ons
                </label>
                <button
                  type="button"
                  onClick={selectAllAddons}
                  className="text-[10px] font-semibold text-cafe-brown hover:underline"
                >
                  {selectedAddonIds.size === globalAddons.length ? 'Deselect all' : 'Select all'}
                </button>
              </div>
              {globalAddons.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {globalAddons.map((addon) => {
                    const selected = selectedAddonIds.has(addon.id)
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddon(addon.id)}
                        className={cn(
                          'flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-xs font-medium transition-all',
                          selected
                            ? 'border-purple-400 bg-purple-50 text-purple-700'
                            : 'border-cafe-border bg-cafe-card text-cafe-text-muted hover:border-purple-300',
                        )}
                      >
                        {selected && <Check className="h-3 w-3" />}
                        {addon.name}
                        <span className="opacity-60">+₱{addon.price}</span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className="text-xs text-cafe-text-light">
                  No add-ons available. Create one in the Add-ons tab.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 border-t border-cafe-border px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-cafe-border bg-cafe-card py-3 text-sm font-semibold text-cafe-text transition hover:bg-cafe-gray"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !price.trim()}
            className="flex-1 rounded-xl bg-cafe-brown py-3 text-sm font-semibold text-white shadow-md transition hover:bg-cafe-brown-dark disabled:opacity-40"
          >
            {product ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          height: 2.5rem;
          border-radius: 0.75rem;
          border: 1px solid var(--cafe-border);
          background: var(--cafe-card);
          padding: 0 0.75rem;
          font-size: 0.875rem;
          color: var(--cafe-text);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--cafe-brown-light);
          box-shadow: 0 0 0 3px rgba(196, 168, 130, 0.15);
        }
        .form-input::placeholder {
          color: var(--cafe-text-light);
        }
      `}</style>
    </div>
  )
}

/* ─── Add-on Form Modal ─── */

function AddonFormModal({
  addon,
  onSave,
  onClose,
}: {
  addon: ProductAddon | null
  onSave: (data: Partial<ProductAddon>) => void
  onClose: () => void
}) {
  const [name, setName] = useState(addon?.name ?? '')
  const [price, setPrice] = useState(addon?.price?.toString() ?? '')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-scale-in relative mx-4 w-full max-w-sm rounded-3xl bg-cafe-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-cafe-text">
            {addon ? 'Edit Add-on' : 'New Add-on'}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-cafe-gray text-cafe-text-muted transition hover:bg-cafe-cream"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-cafe-text-muted">
              Add-on Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Extra Shot"
              className="h-10 w-full rounded-xl border border-cafe-border bg-cafe-card px-3 text-sm text-cafe-text placeholder:text-cafe-text-light focus:border-cafe-brown-light focus:outline-none focus:ring-2 focus:ring-cafe-brown-light/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-cafe-text-muted">
              Price (₱)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="30"
              className="h-10 w-full rounded-xl border border-cafe-border bg-cafe-card px-3 text-sm text-cafe-text placeholder:text-cafe-text-light focus:border-cafe-brown-light focus:outline-none focus:ring-2 focus:ring-cafe-brown-light/20"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-cafe-border py-3 text-sm font-semibold text-cafe-text transition hover:bg-cafe-gray"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!name.trim() || !price.trim()) return
              onSave({ name: name.trim(), price: parseInt(price, 10) })
            }}
            disabled={!name.trim() || !price.trim()}
            className="flex-1 rounded-xl bg-cafe-brown py-3 text-sm font-semibold text-white shadow-md transition hover:bg-cafe-brown-dark disabled:opacity-40"
          >
            {addon ? 'Save Changes' : 'Add Add-on'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Size Form Modal ─── */

function SizeFormModal({
  size,
  onSave,
  onClose,
}: {
  size: ProductSize | null
  onSave: (data: Partial<ProductSize>) => void
  onClose: () => void
}) {
  const [label, setLabel] = useState(size?.label ?? '')
  const [priceModifier, setPriceModifier] = useState(size?.priceModifier?.toString() ?? '0')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-scale-in relative mx-4 w-full max-w-sm rounded-3xl bg-cafe-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-cafe-text">
            {size ? 'Edit Size' : 'New Size'}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-cafe-gray text-cafe-text-muted transition hover:bg-cafe-cream"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-cafe-text-muted">
              Size Label
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Large"
              className="h-10 w-full rounded-xl border border-cafe-border bg-cafe-card px-3 text-sm text-cafe-text placeholder:text-cafe-text-light focus:border-cafe-brown-light focus:outline-none focus:ring-2 focus:ring-cafe-brown-light/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-cafe-text-muted">
              Price Modifier (₱)
            </label>
            <input
              type="number"
              value={priceModifier}
              onChange={(e) => setPriceModifier(e.target.value)}
              placeholder="0"
              className="h-10 w-full rounded-xl border border-cafe-border bg-cafe-card px-3 text-sm text-cafe-text placeholder:text-cafe-text-light focus:border-cafe-brown-light focus:outline-none focus:ring-2 focus:ring-cafe-brown-light/20"
            />
            <p className="mt-1 text-[10px] text-cafe-text-light">
              Set to 0 for base size. This amount is added to the product price.
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-cafe-border py-3 text-sm font-semibold text-cafe-text transition hover:bg-cafe-gray"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!label.trim()) return
              onSave({ label: label.trim(), priceModifier: parseInt(priceModifier, 10) || 0 })
            }}
            disabled={!label.trim()}
            className="flex-1 rounded-xl bg-cafe-brown py-3 text-sm font-semibold text-white shadow-md transition hover:bg-cafe-brown-dark disabled:opacity-40"
          >
            {size ? 'Save Changes' : 'Add Size'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Category Form Modal ─── */

function CategoryFormModal({
  onSave,
  onClose,
}: {
  onSave: (data: Omit<Category, 'id'>) => void
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [nameFil, setNameFil] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-scale-in relative mx-4 w-full max-w-sm rounded-3xl bg-cafe-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-cafe-text">New Category</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-cafe-gray text-cafe-text-muted transition hover:bg-cafe-cream"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-cafe-text-muted">
              Category Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bakery"
              className="h-10 w-full rounded-xl border border-cafe-border bg-cafe-card px-3 text-sm text-cafe-text placeholder:text-cafe-text-light focus:border-cafe-brown-light focus:outline-none focus:ring-2 focus:ring-cafe-brown-light/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-cafe-text-muted">
              Filipino Name
            </label>
            <input
              value={nameFil}
              onChange={(e) => setNameFil(e.target.value)}
              placeholder="e.g. Panaderya"
              className="h-10 w-full rounded-xl border border-cafe-border bg-cafe-card px-3 text-sm text-cafe-text placeholder:text-cafe-text-light focus:border-cafe-brown-light focus:outline-none focus:ring-2 focus:ring-cafe-brown-light/20"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-cafe-border py-3 text-sm font-semibold text-cafe-text transition hover:bg-cafe-gray"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!name.trim()) return
              onSave({ name: name.trim(), nameFil: nameFil.trim(), icon: 'tag' })
            }}
            disabled={!name.trim()}
            className="flex-1 rounded-xl bg-cafe-brown py-3 text-sm font-semibold text-white shadow-md transition hover:bg-cafe-brown-dark disabled:opacity-40"
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Shared ─── */

function FormField({
  label,
  icon: _icon,
  children,
}: {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-cafe-text-muted">{label}</label>
      {children}
    </div>
  )
}
