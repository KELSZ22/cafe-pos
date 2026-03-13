import { create } from 'zustand'
import {
  type Product,
  type ProductAddon,
  type ProductSize,
  type Order,
  type OrderItem,
  type StoreSettings,
  type Category,
  products as initialProducts,
  categories as initialCategories,
  sampleOrders,
  defaultSettings,
  allGlobalAddons,
  allGlobalSizes,
} from '#/data/pos-data'

export interface CartItem {
  id: string
  product: Product
  size: ProductSize | null
  addons: ProductAddon[]
  quantity: number
}

interface PosState {
  isAuthenticated: boolean
  currentUser: { name: string; role: string; pin: string } | null

  products: Product[]
  categories: Category[]
  cart: CartItem[]
  orders: Order[]
  settings: StoreSettings
  selectedCategory: string
  orderCounter: number
  globalAddons: ProductAddon[]
  globalSizes: ProductSize[]

  login: (pin: string) => boolean
  logout: () => void
  setSelectedCategory: (category: string) => void
  addToCart: (
    product: Product,
    size: ProductSize | null,
    addons: ProductAddon[],
  ) => void
  removeFromCart: (cartItemId: string) => void
  updateCartItemQuantity: (cartItemId: string, quantity: number) => void
  updateCartItemDetails: (
    cartItemId: string,
    updates: Partial<Pick<CartItem, 'size' | 'addons' | 'quantity'>>,
  ) => void
  updateCartItemDetails: (
    cartItemId: string,
    updates: Partial<Pick<CartItem, 'size' | 'addons' | 'quantity'>>,
  ) => void
  clearCart: () => void
  checkout: (paymentMethod: 'cash' | 'card') => Order
  updateOrderStatus: (orderId: string, status: Order['status']) => void

  addProduct: (product: Product) => void
  updateProduct: (productId: string, updates: Partial<Product>) => void
  deleteProduct: (productId: string) => void

  addCategory: (category: Category) => void
  updateCategory: (categoryId: string, updates: Partial<Category>) => void
  deleteCategory: (categoryId: string) => void

  addGlobalAddon: (addon: ProductAddon) => void
  updateGlobalAddon: (addonId: string, updates: Partial<ProductAddon>) => void
  deleteGlobalAddon: (addonId: string) => void

  addGlobalSize: (size: ProductSize) => void
  updateGlobalSize: (sizeId: string, updates: Partial<ProductSize>) => void
  deleteGlobalSize: (sizeId: string) => void

  updateSettings: (updates: Partial<StoreSettings>) => void

  getCartTotal: () => { subtotal: number; tax: number; total: number }
  getProductsByCategory: (category: string) => Product[]
  getTodayOrders: () => Order[]
  getTodaySales: () => number
}

const staffAccounts = [
  { name: 'Michael', role: 'Cashier', pin: '1234' },
  { name: 'Miguel', role: 'Manager', pin: '0000' },
  { name: 'Rina', role: 'Barista', pin: '5678' },
]

function generateCartItemId(): string {
  return `cart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function generateOrderId(): string {
  return `order-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const usePosStore = create<PosState>((set, get) => ({
  isAuthenticated: false,
  currentUser: null,

  products: initialProducts,
  categories: initialCategories,
  cart: [],
  orders: sampleOrders,
  settings: defaultSettings,
  selectedCategory: 'coffee',
  orderCounter: 100,
  globalAddons: allGlobalAddons,
  globalSizes: allGlobalSizes,

  login: (pin) => {
    const user = staffAccounts.find((u) => u.pin === pin)
    if (user) {
      set({ isAuthenticated: true, currentUser: user })
      return true
    }
    return false
  },

  logout: () => {
    set({ isAuthenticated: false, currentUser: null, cart: [] })
  },

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  addToCart: (product, size, addons) => {
    const existing = get().cart.find(
      (item) =>
        item.product.id === product.id &&
        item.size?.id === size?.id &&
        JSON.stringify(item.addons.map((a) => a.id).sort()) ===
          JSON.stringify(addons.map((a) => a.id).sort()),
    )

    if (existing) {
      set({
        cart: get().cart.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      })
    } else {
      set({
        cart: [
          ...get().cart,
          {
            id: generateCartItemId(),
            product,
            size,
            addons,
            quantity: 1,
          },
        ],
      })
    }
  },

  removeFromCart: (cartItemId) => {
    set({ cart: get().cart.filter((item) => item.id !== cartItemId) })
  },

  updateCartItemQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(cartItemId)
      return
    }
    set({
      cart: get().cart.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item,
      ),
    })
  },

  updateCartItemDetails: (cartItemId, updates) => {
    set({
      cart: get().cart.map((item) => {
        if (item.id !== cartItemId) return item
        const nextQuantity =
          updates.quantity !== undefined ? updates.quantity : item.quantity
        if (nextQuantity <= 0) {
          return item
        }
        return {
          ...item,
          ...updates,
          quantity: nextQuantity,
        }
      }),
    })
  },

  clearCart: () => set({ cart: [] }),

  checkout: (paymentMethod) => {
    const state = get()
    const { subtotal, tax, total } = state.getCartTotal()
    const orderNumber = state.orderCounter + 1

    const orderItems: OrderItem[] = state.cart.map((item) => {
      const unitPrice =
        item.product.price +
        (item.size?.priceModifier ?? 0) +
        item.addons.reduce((sum, a) => sum + a.price, 0)
      return {
        productId: item.product.id,
        productName: item.product.name,
        size: item.size,
        addons: item.addons,
        quantity: item.quantity,
        unitPrice,
        totalPrice: unitPrice * item.quantity,
      }
    })

    const order: Order = {
      id: generateOrderId(),
      orderNumber,
      items: orderItems,
      subtotal,
      tax,
      total,
      status: 'pending',
      paymentMethod,
      createdAt: new Date().toISOString(),
      cashierName: state.settings.cashierName,
    }

    set({
      orders: [order, ...state.orders],
      cart: [],
      orderCounter: orderNumber,
    })

    return order
  },

  updateOrderStatus: (orderId, status) => {
    set({
      orders: get().orders.map((o) =>
        o.id === orderId ? { ...o, status } : o,
      ),
    })
  },

  addProduct: (product) => {
    set({ products: [...get().products, product] })
  },

  updateProduct: (productId, updates) => {
    set({
      products: get().products.map((p) =>
        p.id === productId ? { ...p, ...updates } : p,
      ),
    })
  },

  deleteProduct: (productId) => {
    set({ products: get().products.filter((p) => p.id !== productId) })
  },

  addCategory: (category) => {
    set({ categories: [...get().categories, category] })
  },

  updateCategory: (categoryId, updates) => {
    set({
      categories: get().categories.map((c) =>
        c.id === categoryId ? { ...c, ...updates } : c,
      ),
    })
  },

  deleteCategory: (categoryId) => {
    set({ categories: get().categories.filter((c) => c.id !== categoryId) })
  },

  addGlobalAddon: (addon) => {
    set({ globalAddons: [...get().globalAddons, addon] })
  },

  updateGlobalAddon: (addonId, updates) => {
    const updatedAddon = {
      ...get().globalAddons.find((a) => a.id === addonId)!,
      ...updates,
    }
    set({
      globalAddons: get().globalAddons.map((a) =>
        a.id === addonId ? updatedAddon : a,
      ),
      products: get().products.map((p) => ({
        ...p,
        addons: p.addons.map((a) => (a.id === addonId ? updatedAddon : a)),
      })),
    })
  },

  deleteGlobalAddon: (addonId) => {
    set({
      globalAddons: get().globalAddons.filter((a) => a.id !== addonId),
      products: get().products.map((p) => ({
        ...p,
        addons: p.addons.filter((a) => a.id !== addonId),
      })),
    })
  },

  addGlobalSize: (size) => {
    set({ globalSizes: [...get().globalSizes, size] })
  },

  updateGlobalSize: (sizeId, updates) => {
    const updatedSize = {
      ...get().globalSizes.find((s) => s.id === sizeId)!,
      ...updates,
    }
    set({
      globalSizes: get().globalSizes.map((s) =>
        s.id === sizeId ? updatedSize : s,
      ),
      products: get().products.map((p) => ({
        ...p,
        sizes: p.sizes.map((s) => (s.id === sizeId ? updatedSize : s)),
      })),
    })
  },

  deleteGlobalSize: (sizeId) => {
    set({
      globalSizes: get().globalSizes.filter((s) => s.id !== sizeId),
      products: get().products.map((p) => ({
        ...p,
        sizes: p.sizes.filter((s) => s.id !== sizeId),
      })),
    })
  },

  updateSettings: (updates) => {
    set({ settings: { ...get().settings, ...updates } })
  },

  getCartTotal: () => {
    const state = get()
    const subtotal = state.cart.reduce((sum, item) => {
      const price =
        item.product.price +
        (item.size?.priceModifier ?? 0) +
        item.addons.reduce((a, addon) => a + addon.price, 0)
      return sum + price * item.quantity
    }, 0)
    const tax = Math.round(subtotal * (state.settings.taxRate / 100))
    return { subtotal, tax, total: subtotal + tax }
  },

  getProductsByCategory: (category) => {
    if (category === 'all') return get().products.filter((p) => p.available)
    return get().products.filter((p) => p.category === category && p.available)
  },

  getTodayOrders: () => {
    const today = new Date().toDateString()
    return get().orders.filter(
      (o) => new Date(o.createdAt).toDateString() === today,
    )
  },

  getTodaySales: () => {
    return get()
      .getTodayOrders()
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0)
  },
}))
