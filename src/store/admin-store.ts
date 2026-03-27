import { create } from 'zustand'
import {
  type FoodCourtStore,
  type FoodCourtSettings,
  type AuditEntry,
  foodCourtStores as initialStores,
  foodCourtSettings as initialSettings,
  sampleAuditLog,
} from '#/data/admin-data'

interface AdminState {
  stores: FoodCourtStore[]
  settings: FoodCourtSettings
  auditLog: AuditEntry[]

  addStore: (store: FoodCourtStore) => void
  updateStore: (storeId: string, updates: Partial<FoodCourtStore>) => void
  deleteStore: (storeId: string) => void
  setStoreStatus: (storeId: string, status: FoodCourtStore['status']) => void
  toggleStaffDuty: (storeId: string, staffId: string) => void
  updateFoodCourtSettings: (updates: Partial<FoodCourtSettings>) => void
  updateStoreRevenueTarget: (storeId: string, target: number) => void
  toggleProductAvailability: (storeId: string, productId: string) => void
  updateProductPrice: (storeId: string, productId: string, price: number) => void
  addStaffMember: (storeId: string, name: string, role: string) => void
  removeStaffMember: (storeId: string, staffId: string) => void
  addAuditEntry: (action: string, details: string) => void

  getTotalRevenue: () => number
  getActiveStores: () => number
  getStoreRevenue: (storeId: string) => number
  getRevenueByStore: () => { name: string; revenue: number; color: string }[]
  getHourlySalesAllStores: () => { hour: string; total: number }[]
  getAllStaff: () => { storeId: string; storeName: string; storeColor: string; id: string; name: string; role: string; isOnDuty: boolean }[]
}

export const useAdminStore = create<AdminState>((set, get) => ({
  stores: initialStores,
  settings: initialSettings,
  auditLog: sampleAuditLog,

  addStore: (store) => {
    set({ stores: [...get().stores, store] })
    get().addAuditEntry('Store Created', `${store.name} added to food court`)
  },

  updateStore: (storeId, updates) => {
    const store = get().stores.find((s) => s.id === storeId)
    set({
      stores: get().stores.map((s) =>
        s.id === storeId ? { ...s, ...updates } : s,
      ),
    })
    if (store) {
      get().addAuditEntry('Store Updated', `${updates.name ?? store.name} details updated`)
    }
  },

  deleteStore: (storeId) => {
    const store = get().stores.find((s) => s.id === storeId)
    set({ stores: get().stores.filter((s) => s.id !== storeId) })
    if (store) {
      get().addAuditEntry('Store Deleted', `${store.name} removed from food court`)
    }
  },

  setStoreStatus: (storeId, status) => {
    const store = get().stores.find((s) => s.id === storeId)
    set({
      stores: get().stores.map((s) =>
        s.id === storeId ? { ...s, status } : s,
      ),
    })
    if (store) {
      get().addAuditEntry('Store Status Changed', `${store.name} set to ${status}`)
    }
  },

  toggleStaffDuty: (storeId, staffId) => {
    set({
      stores: get().stores.map((s) =>
        s.id === storeId
          ? {
              ...s,
              staff: s.staff.map((m) =>
                m.id === staffId ? { ...m, isOnDuty: !m.isOnDuty } : m,
              ),
            }
          : s,
      ),
    })
  },

  updateFoodCourtSettings: (updates) => {
    set({ settings: { ...get().settings, ...updates } })
    get().addAuditEntry('Settings Updated', `Food court settings updated`)
  },

  updateStoreRevenueTarget: (storeId, target) => {
    set({
      stores: get().stores.map((s) =>
        s.id === storeId ? { ...s, revenueTarget: target } : s,
      ),
    })
  },

  toggleProductAvailability: (storeId, productId) => {
    const store = get().stores.find((s) => s.id === storeId)
    const product = store?.products.find((p) => p.id === productId)
    set({
      stores: get().stores.map((s) =>
        s.id === storeId
          ? { ...s, products: s.products.map((p) => p.id === productId ? { ...p, available: !p.available } : p) }
          : s,
      ),
    })
    if (product) {
      get().addAuditEntry('Product Availability', `${product.name} at ${store!.name} set to ${product.available ? 'unavailable' : 'available'}`)
    }
  },

  updateProductPrice: (storeId, productId, price) => {
    const store = get().stores.find((s) => s.id === storeId)
    const product = store?.products.find((p) => p.id === productId)
    set({
      stores: get().stores.map((s) =>
        s.id === storeId
          ? { ...s, products: s.products.map((p) => p.id === productId ? { ...p, price } : p) }
          : s,
      ),
    })
    if (product) {
      get().addAuditEntry('Price Updated', `${product.name} at ${store!.name} price changed to ${price}`)
    }
  },

  addStaffMember: (storeId, name, role) => {
    const store = get().stores.find((s) => s.id === storeId)
    const newStaff = { id: `staff-${Date.now()}`, name, role, isOnDuty: false }
    set({
      stores: get().stores.map((s) =>
        s.id === storeId ? { ...s, staff: [...s.staff, newStaff] } : s,
      ),
    })
    if (store) {
      get().addAuditEntry('Staff Added', `${name} (${role}) added to ${store.name}`)
    }
  },

  removeStaffMember: (storeId, staffId) => {
    const store = get().stores.find((s) => s.id === storeId)
    const member = store?.staff.find((m) => m.id === staffId)
    set({
      stores: get().stores.map((s) =>
        s.id === storeId ? { ...s, staff: s.staff.filter((m) => m.id !== staffId) } : s,
      ),
    })
    if (member && store) {
      get().addAuditEntry('Staff Removed', `${member.name} removed from ${store.name}`)
    }
  },

  addAuditEntry: (action, details) => {
    const entry: AuditEntry = {
      id: `au-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      user: 'Admin',
    }
    set({ auditLog: [entry, ...get().auditLog] })
  },

  getTotalRevenue: () =>
    get().stores.reduce(
      (sum, store) =>
        sum + store.orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
      0,
    ),

  getActiveStores: () =>
    get().stores.filter((s) => s.status !== 'closed').length,

  getStoreRevenue: (storeId) => {
    const store = get().stores.find((s) => s.id === storeId)
    if (!store) return 0
    return store.orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  },

  getRevenueByStore: () =>
    get().stores.map((store) => ({
      name: store.name.length > 12 ? store.name.split(' ')[0]! : store.name,
      revenue: store.orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
      color: store.color,
    })),

  getHourlySalesAllStores: () => {
    const hours: Record<number, number> = {}
    for (let i = 8; i <= 22; i++) hours[i] = 0
    get().stores.forEach((store) => {
      store.orders.filter((o) => o.status !== 'cancelled').forEach((order) => {
        const h = new Date(order.createdAt).getHours()
        if (hours[h] !== undefined) hours[h]! += order.total
      })
    })
    return Object.entries(hours).map(([hour, total]) => ({
      hour: `${parseInt(hour)}:00`,
      total,
    }))
  },

  getAllStaff: () =>
    get().stores.flatMap((store) =>
      store.staff.map((m) => ({
        ...m,
        storeId: store.id,
        storeName: store.name,
        storeColor: store.color,
      })),
    ),
}))
