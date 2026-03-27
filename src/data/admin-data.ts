import type { Order, Product, Category, StoreSettings } from './pos-data'

export interface FoodCourtStore {
  id: string
  name: string
  subtitle: string
  icon: string
  color: string
  status: 'open' | 'closed' | 'busy'
  revenueTarget: number
  settings: StoreSettings
  categories: Category[]
  products: Product[]
  orders: Order[]
  staff: StoreStaff[]
}

export interface StoreStaff {
  id: string
  name: string
  role: string
  isOnDuty: boolean
}

export interface AuditEntry {
  id: string
  timestamp: string
  action: string
  details: string
  user: string
}

export interface FoodCourtSettings {
  name: string
  location: string
  totalStalls: number
  operatingHours: string
  currency: string
  defaultTaxRate: number
}

export const foodCourtSettings: FoodCourtSettings = {
  name: 'Admin',
  location: 'Metro Manila',
  totalStalls: 6,
  operatingHours: '10:00 AM – 9:00 PM',
  currency: '₱',
  defaultTaxRate: 12,
}

const now = new Date()
function hoursAgo(h: number) {
  return new Date(now.getTime() - h * 3600000).toISOString()
}
function minutesAgo(m: number) {
  return new Date(now.getTime() - m * 60000).toISOString()
}
function daysAgo(d: number, h = 12) {
  return new Date(now.getTime() - d * 86400000 - h * 3600000).toISOString()
}

let orderSeq = 2000


function makeOrder(
  items: Order['items'],
  status: Order['status'],
  paymentMethod: Order['paymentMethod'],
  createdAt: string,
  cashierName: string,
): Order {
  const subtotal = items.reduce((s, i) => s + i.totalPrice, 0)
  const tax = Math.round(subtotal * 0.12)
  orderSeq++
  return {
    id: `admin-order-${orderSeq}`,
    orderNumber: orderSeq,
    items,
    subtotal,
    tax,
    total: subtotal + tax,
    status,
    paymentMethod,
    createdAt,
    cashierName,
  }
}

export const sampleAuditLog: AuditEntry[] = [
  {
    id: 'au-1',
    timestamp: hoursAgo(4),
    action: 'Store Opened',
    details: 'Sizzle Burger opened by Carlos',
    user: 'Admin',
  },
  {
    id: 'au-2',
    timestamp: hoursAgo(3.5),
    action: 'Staff Assigned',
    details: 'Aira assigned as Cook at Sizzle Burger',
    user: 'Admin',
  },
  {
    id: 'au-3',
    timestamp: hoursAgo(2),
    action: 'Store Status Changed',
    details: 'Sizzle Burger set to Busy',
    user: 'Admin',
  },
  {
    id: 'au-4',
    timestamp: hoursAgo(1),
    action: 'Store Closed',
    details: 'Pinoy Grill closed for the day',
    user: 'Admin',
  },
  {
    id: 'au-5',
    timestamp: minutesAgo(30),
    action: 'Settings Updated',
    details: 'Operating hours updated',
    user: 'Admin',
  },
]

export const foodCourtStores: FoodCourtStore[] = [
  {
    id: 'daily-grind',
    name: 'Daily Grind Cafe',
    subtitle: 'Crafted Coffee & Tea',
    icon: 'coffee',
    color: '#8B6F47',
    status: 'open',
    revenueTarget: 15000,
    settings: {
      storeName: 'Daily Grind Cafe',
      storeSubtitle: 'Crafted Coffee & Tea',
      taxRate: 12,
      receiptFooter: 'Salamat po!',
      cashierName: 'Michael',
      currency: '₱',
      logoUrl: '',
    },
    categories: [
      { id: 'coffee', name: 'Coffee', icon: 'coffee' },
      { id: 'tea', name: 'Tea', icon: 'leaf' },
      { id: 'dessert', name: 'Dessert', icon: 'cake' },
    ],
    products: [
      {
        id: 'dg-americano',
        name: 'Americano',
        category: 'coffee',
        price: 120,
        image: '',
        description: '',
        sizes: [],
        addons: [],
        available: true,
      },
      {
        id: 'dg-latte',
        name: 'Cafe Latte',
        category: 'coffee',
        price: 150,
        image: '',
        description: '',
        sizes: [],
        addons: [],
        available: true,
      },
      {
        id: 'dg-mocha',
        name: 'Cafe Mocha',
        category: 'coffee',
        price: 175,
        image: '',
        description: '',
        sizes: [],
        addons: [],
        available: true,
      },
    ],
    staff: [
      { id: 'dg-s1', name: 'Michael', role: 'Cashier', isOnDuty: true },
      { id: 'dg-s2', name: 'Rina', role: 'Barista', isOnDuty: true },
    ],
    orders: [
      makeOrder(
        [
          {
            productId: 'dg-americano',
            productName: 'Americano',
            size: null,
            addons: [],
            quantity: 2,
            unitPrice: 120,
            totalPrice: 240,
          },
        ],
        'done',
        'card',
        hoursAgo(3),
        'Michael',
      ),
      makeOrder(
        [
          {
            productId: 'dg-latte',
            productName: 'Cafe Latte',
            size: null,
            addons: [],
            quantity: 1,
            unitPrice: 150,
            totalPrice: 150,
          },
        ],
        'done',
        'cash',
        hoursAgo(2.5),
        'Michael',
      ),
      makeOrder(
        [
          {
            productId: 'dg-mocha',
            productName: 'Cafe Mocha',
            size: null,
            addons: [],
            quantity: 3,
            unitPrice: 175,
            totalPrice: 525,
          },
        ],
        'done',
        'card',
        hoursAgo(2),
        'Michael',
      ),
      makeOrder(
        [
          {
            productId: 'dg-americano',
            productName: 'Americano',
            size: null,
            addons: [],
            quantity: 1,
            unitPrice: 120,
            totalPrice: 120,
          },
        ],
        'done',
        'cash',
        hoursAgo(1.5),
        'Michael',
      ),
      makeOrder(
        [
          {
            productId: 'dg-latte',
            productName: 'Cafe Latte',
            size: null,
            addons: [],
            quantity: 2,
            unitPrice: 150,
            totalPrice: 300,
          },
        ],
        'preparing',
        'card',
        minutesAgo(45),
        'Michael',
      ),
      makeOrder(
        [
          {
            productId: 'dg-mocha',
            productName: 'Cafe Mocha',
            size: null,
            addons: [],
            quantity: 1,
            unitPrice: 175,
            totalPrice: 175,
          },
        ],
        'pending',
        'cash',
        minutesAgo(10),
        'Michael',
      ),
    ],
  },
  {
    id: 'sizzle-burger',
    name: 'Sizzle Burger',
    subtitle: 'Smashed Burgers & Fries',
    icon: 'beef',
    color: '#E07A5F',
    status: 'busy',
    revenueTarget: 20000,
    settings: {
      storeName: 'Sizzle Burger',
      storeSubtitle: 'Smashed Burgers & Fries',
      taxRate: 12,
      receiptFooter: 'Thanks for choosing Sizzle!',
      cashierName: 'Carlos',
      currency: '₱',
      logoUrl: '',
    },
    categories: [
      { id: 'burgers', name: 'Burgers', icon: 'beef' },
      { id: 'sides', name: 'Sides', icon: 'fries' },
      { id: 'drinks', name: 'Drinks', icon: 'cup-soda' },
    ],
    products: [
      {
        id: 'sb-classic',
        name: 'Classic Smash',
        category: 'burgers',
        price: 189,
        image: '',
        description: '',
        sizes: [],
        addons: [],
        available: true,
      },
      {
        id: 'sb-cheese',
        name: 'Double Cheese',
        category: 'burgers',
        price: 249,
        image: '',
        description: '',
        sizes: [],
        addons: [],
        available: true,
      },
      {
        id: 'sb-fries',
        name: 'Loaded Fries',
        category: 'sides',
        price: 129,
        image: '',
        description: '',
        sizes: [],
        addons: [],
        available: true,
      },
    ],
    staff: [
      { id: 'sb-s1', name: 'Carlos', role: 'Cashier', isOnDuty: true },
      { id: 'sb-s2', name: 'Jay', role: 'Cook', isOnDuty: true },
      { id: 'sb-s3', name: 'Aira', role: 'Cook', isOnDuty: true },
    ],
    orders: [
      makeOrder(
        [
          {
            productId: 'sb-classic',
            productName: 'Classic Smash',
            size: null,
            addons: [],
            quantity: 3,
            unitPrice: 189,
            totalPrice: 567,
          },
        ],
        'done',
        'card',
        hoursAgo(3),
        'Carlos',
      ),
      makeOrder(
        [
          {
            productId: 'sb-cheese',
            productName: 'Double Cheese',
            size: null,
            addons: [],
            quantity: 2,
            unitPrice: 249,
            totalPrice: 498,
          },
          {
            productId: 'sb-fries',
            productName: 'Loaded Fries',
            size: null,
            addons: [],
            quantity: 2,
            unitPrice: 129,
            totalPrice: 258,
          },
        ],
        'done',
        'card',
        hoursAgo(2.5),
        'Carlos',
      ),
      makeOrder(
        [
          {
            productId: 'sb-classic',
            productName: 'Classic Smash',
            size: null,
            addons: [],
            quantity: 4,
            unitPrice: 189,
            totalPrice: 756,
          },
        ],
        'done',
        'cash',
        hoursAgo(2),
        'Carlos',
      ),
      makeOrder(
        [
          {
            productId: 'sb-cheese',
            productName: 'Double Cheese',
            size: null,
            addons: [],
            quantity: 1,
            unitPrice: 249,
            totalPrice: 249,
          },
        ],
        'done',
        'card',
        hoursAgo(1),
        'Carlos',
      ),
      makeOrder(
        [
          {
            productId: 'sb-fries',
            productName: 'Loaded Fries',
            size: null,
            addons: [],
            quantity: 5,
            unitPrice: 129,
            totalPrice: 645,
          },
        ],
        'preparing',
        'cash',
        minutesAgo(20),
        'Carlos',
      ),
      makeOrder(
        [
          {
            productId: 'sb-classic',
            productName: 'Classic Smash',
            size: null,
            addons: [],
            quantity: 2,
            unitPrice: 189,
            totalPrice: 378,
          },
        ],
        'preparing',
        'card',
        minutesAgo(12),
        'Carlos',
      ),
      makeOrder(
        [
          {
            productId: 'sb-cheese',
            productName: 'Double Cheese',
            size: null,
            addons: [],
            quantity: 3,
            unitPrice: 249,
            totalPrice: 747,
          },
        ],
        'pending',
        'cash',
        minutesAgo(5),
        'Carlos',
      ),
    ],
  },
  {
    id: 'tokyo-ramen',
    name: 'Tokyo Ramen House',
    subtitle: 'Authentic Japanese Ramen',
    icon: 'soup',
    color: '#D4A574',
    status: 'open',
    revenueTarget: 18000,
    settings: {
      storeName: 'Tokyo Ramen House',
      storeSubtitle: 'Authentic Japanese Ramen',
      taxRate: 12,
      receiptFooter: 'Arigatou gozaimasu!',
      cashierName: 'Ken',
      currency: '₱',
      logoUrl: '',
    },
    categories: [
      { id: 'ramen', name: 'Ramen', icon: 'soup' },
      { id: 'sides', name: 'Sides', icon: 'egg' },
      { id: 'drinks', name: 'Drinks', icon: 'cup-soda' },
    ],
    products: [
      {
        id: 'tr-tonkotsu',
        name: 'Tonkotsu Ramen',
        category: 'ramen',
        price: 299,
        image: '',
        description: '',
        sizes: [],
        addons: [],
        available: true,
      },
      {
        id: 'tr-miso',
        name: 'Miso Ramen',
        category: 'ramen',
        price: 279,
        image: '',
        description: '',
        sizes: [],
        addons: [],
        available: true,
      },
      {
        id: 'tr-gyoza',
        name: 'Gyoza (6pcs)',
        category: 'sides',
        price: 149,
        image: '',
        description: '',
        sizes: [],
        addons: [],
        available: true,
      },
    ],
    staff: [
      { id: 'tr-s1', name: 'Ken', role: 'Cashier', isOnDuty: true },
      { id: 'tr-s2', name: 'Yuki', role: 'Chef', isOnDuty: true },
    ],
    orders: [
      makeOrder(
        [
          {
            productId: 'tr-tonkotsu',
            productName: 'Tonkotsu Ramen',
            size: null,
            addons: [],
            quantity: 2,
            unitPrice: 299,
            totalPrice: 598,
          },
        ],
        'done',
        'card',
        hoursAgo(2.5),
        'Ken',
      ),
      makeOrder(
        [
          {
            productId: 'tr-miso',
            productName: 'Miso Ramen',
            size: null,
            addons: [],
            quantity: 1,
            unitPrice: 279,
            totalPrice: 279,
          },
          {
            productId: 'tr-gyoza',
            productName: 'Gyoza (6pcs)',
            size: null,
            addons: [],
            quantity: 1,
            unitPrice: 149,
            totalPrice: 149,
          },
        ],
        'done',
        'cash',
        hoursAgo(2),
        'Ken',
      ),
      makeOrder(
        [
          {
            productId: 'tr-tonkotsu',
            productName: 'Tonkotsu Ramen',
            size: null,
            addons: [],
            quantity: 3,
            unitPrice: 299,
            totalPrice: 897,
          },
        ],
        'done',
        'card',
        hoursAgo(1.5),
        'Ken',
      ),
      makeOrder(
        [
          {
            productId: 'tr-gyoza',
            productName: 'Gyoza (6pcs)',
            size: null,
            addons: [],
            quantity: 2,
            unitPrice: 149,
            totalPrice: 298,
          },
        ],
        'preparing',
        'cash',
        minutesAgo(30),
        'Ken',
      ),
      makeOrder(
        [
          {
            productId: 'tr-miso',
            productName: 'Miso Ramen',
            size: null,
            addons: [],
            quantity: 1,
            unitPrice: 279,
            totalPrice: 279,
          },
        ],
        'pending',
        'card',
        minutesAgo(8),
        'Ken',
      ),
    ],
  },
  {
    id: 'sweet-treats',
    name: 'Sweet Treats Bakery',
    subtitle: 'Cakes, Pastries & Desserts',
    icon: 'cake-slice',
    color: '#C97B84',
    status: 'open',
    revenueTarget: 12000,
    settings: {
      storeName: 'Sweet Treats Bakery',
      storeSubtitle: 'Cakes, Pastries & Desserts',
      taxRate: 12,
      receiptFooter: 'Life is sweet!',
      cashierName: 'Anna',
      currency: '₱',
      logoUrl: '',
    },
    categories: [
      { id: 'cakes', name: 'Cakes', icon: 'cake' },
      { id: 'pastries', name: 'Pastries', icon: 'croissant' },
    ],
    products: [
      {
        id: 'st-ube',
        name: 'Ube Cake Slice',
        category: 'cakes',
        price: 165,
        image: '',
        description: '',
        sizes: [],
        addons: [],
        available: true,
      },
      {
        id: 'st-choco',
        name: 'Choco Lava',
        category: 'cakes',
        price: 185,
        image: '',
        description: '',
        sizes: [],
        addons: [],
        available: true,
      },
      {
        id: 'st-ensaymada',
        name: 'Ensaymada',
        category: 'pastries',
        price: 85,
        image: '',
        description: '',
        sizes: [],
        addons: [],
        available: true,
      },
    ],
    staff: [
      { id: 'st-s1', name: 'Anna', role: 'Cashier', isOnDuty: true },
      { id: 'st-s2', name: 'Marie', role: 'Baker', isOnDuty: false },
    ],
    orders: [
      makeOrder(
        [
          {
            productId: 'st-ube',
            productName: 'Ube Cake Slice',
            size: null,
            addons: [],
            quantity: 4,
            unitPrice: 165,
            totalPrice: 660,
          },
        ],
        'done',
        'cash',
        hoursAgo(3),
        'Anna',
      ),
      makeOrder(
        [
          {
            productId: 'st-choco',
            productName: 'Choco Lava',
            size: null,
            addons: [],
            quantity: 2,
            unitPrice: 185,
            totalPrice: 370,
          },
        ],
        'done',
        'card',
        hoursAgo(2),
        'Anna',
      ),
      makeOrder(
        [
          {
            productId: 'st-ensaymada',
            productName: 'Ensaymada',
            size: null,
            addons: [],
            quantity: 6,
            unitPrice: 85,
            totalPrice: 510,
          },
        ],
        'done',
        'cash',
        hoursAgo(1),
        'Anna',
      ),
      makeOrder(
        [
          {
            productId: 'st-ube',
            productName: 'Ube Cake Slice',
            size: null,
            addons: [],
            quantity: 1,
            unitPrice: 165,
            totalPrice: 165,
          },
        ],
        'pending',
        'card',
        minutesAgo(15),
        'Anna',
      ),
    ],
  },
  {
    id: 'fresh-juice',
    name: 'Fresh Juice Bar',
    subtitle: 'Cold-Pressed & Smoothies',
    icon: 'glass-water',
    color: '#7CB68E',
    status: 'open',
    revenueTarget: 10000,
    settings: {
      storeName: 'Fresh Juice Bar',
      storeSubtitle: 'Cold-Pressed & Smoothies',
      taxRate: 12,
      receiptFooter: 'Stay fresh, stay healthy!',
      cashierName: 'Liza',
      currency: '₱',
      logoUrl: '',
    },
    categories: [
      { id: 'juices', name: 'Juices', icon: 'glass-water' },
      { id: 'smoothies', name: 'Smoothies', icon: 'cup-soda' },
    ],
    products: [
      {
        id: 'fj-mango',
        name: 'Mango Juice',
        category: 'juices',
        price: 110,
        image: '',
        description: '',
        sizes: [],
        addons: [],
        available: true,
      },
      {
        id: 'fj-green',
        name: 'Green Detox',
        category: 'juices',
        price: 140,
        image: '',
        description: '',
        sizes: [],
        addons: [],
        available: true,
      },
      {
        id: 'fj-berry',
        name: 'Berry Smoothie',
        category: 'smoothies',
        price: 160,
        image: '',
        description: '',
        sizes: [],
        addons: [],
        available: true,
      },
    ],
    staff: [{ id: 'fj-s1', name: 'Liza', role: 'Cashier', isOnDuty: true }],
    orders: [
      makeOrder(
        [
          {
            productId: 'fj-mango',
            productName: 'Mango Juice',
            size: null,
            addons: [],
            quantity: 3,
            unitPrice: 110,
            totalPrice: 330,
          },
        ],
        'done',
        'cash',
        hoursAgo(2.5),
        'Liza',
      ),
      makeOrder(
        [
          {
            productId: 'fj-green',
            productName: 'Green Detox',
            size: null,
            addons: [],
            quantity: 2,
            unitPrice: 140,
            totalPrice: 280,
          },
        ],
        'done',
        'card',
        hoursAgo(1.5),
        'Liza',
      ),
      makeOrder(
        [
          {
            productId: 'fj-berry',
            productName: 'Berry Smoothie',
            size: null,
            addons: [],
            quantity: 1,
            unitPrice: 160,
            totalPrice: 160,
          },
        ],
        'preparing',
        'cash',
        minutesAgo(25),
        'Liza',
      ),
    ],
  },
  {
    id: 'pinoy-grill',
    name: 'Pinoy Grill',
    subtitle: 'Filipino Favorites',
    icon: 'flame',
    color: '#E8963A',
    status: 'closed',
    revenueTarget: 25000,
    settings: {
      storeName: 'Pinoy Grill',
      storeSubtitle: 'Filipino Favorites',
      taxRate: 12,
      receiptFooter: 'Kain na!',
      cashierName: 'Rico',
      currency: '₱',
      logoUrl: '',
    },
    categories: [
      { id: 'rice-meals', name: 'Rice Meals', icon: 'utensils' },
      { id: 'grilled', name: 'Grilled', icon: 'flame' },
    ],
    products: [
      {
        id: 'pg-sisig',
        name: 'Sizzling Sisig',
        category: 'rice-meals',
        price: 199,
        image: '',
        description: '',
        sizes: [],
        addons: [],
        available: true,
      },
      {
        id: 'pg-liempo',
        name: 'Grilled Liempo',
        category: 'grilled',
        price: 219,
        image: '',
        description: '',
        sizes: [],
        addons: [],
        available: true,
      },
      {
        id: 'pg-inasal',
        name: 'Chicken Inasal',
        category: 'grilled',
        price: 189,
        image: '',
        description: '',
        sizes: [],
        addons: [],
        available: true,
      },
    ],
    staff: [
      { id: 'pg-s1', name: 'Rico', role: 'Cashier', isOnDuty: false },
      { id: 'pg-s2', name: 'Danny', role: 'Grill Master', isOnDuty: false },
    ],
    orders: [
      makeOrder(
        [
          {
            productId: 'pg-sisig',
            productName: 'Sizzling Sisig',
            size: null,
            addons: [],
            quantity: 5,
            unitPrice: 199,
            totalPrice: 995,
          },
        ],
        'done',
        'cash',
        hoursAgo(5),
        'Rico',
      ),
      makeOrder(
        [
          {
            productId: 'pg-liempo',
            productName: 'Grilled Liempo',
            size: null,
            addons: [],
            quantity: 3,
            unitPrice: 219,
            totalPrice: 657,
          },
        ],
        'done',
        'card',
        hoursAgo(4.5),
        'Rico',
      ),
      makeOrder(
        [
          {
            productId: 'pg-inasal',
            productName: 'Chicken Inasal',
            size: null,
            addons: [],
            quantity: 4,
            unitPrice: 189,
            totalPrice: 756,
          },
        ],
        'done',
        'cash',
        hoursAgo(4),
        'Rico',
      ),
    ],
  },
]

const historicalSales = [
  { day: 1, hour: 10 }, { day: 1, hour: 12 }, { day: 1, hour: 14 }, { day: 1, hour: 17 },
  { day: 2, hour: 9 }, { day: 2, hour: 11 }, { day: 2, hour: 13 }, { day: 2, hour: 16 }, { day: 2, hour: 19 },
  { day: 3, hour: 10 }, { day: 3, hour: 12 }, { day: 3, hour: 15 }, { day: 3, hour: 18 },
  { day: 4, hour: 11 }, { day: 4, hour: 13 }, { day: 4, hour: 16 },
  { day: 5, hour: 9 }, { day: 5, hour: 12 }, { day: 5, hour: 14 }, { day: 5, hour: 17 }, { day: 5, hour: 20 },
  { day: 6, hour: 10 }, { day: 6, hour: 13 }, { day: 6, hour: 15 }, { day: 6, hour: 18 },
  { day: 7, hour: 11 }, { day: 7, hour: 14 }, { day: 7, hour: 16 },
  { day: 10, hour: 10 }, { day: 10, hour: 13 }, { day: 10, hour: 17 },
  { day: 14, hour: 11 }, { day: 14, hour: 14 }, { day: 14, hour: 16 }, { day: 14, hour: 19 },
  { day: 18, hour: 10 }, { day: 18, hour: 12 }, { day: 18, hour: 15 },
  { day: 21, hour: 9 }, { day: 21, hour: 13 }, { day: 21, hour: 17 }, { day: 21, hour: 20 },
  { day: 25, hour: 11 }, { day: 25, hour: 14 }, { day: 25, hour: 18 },
  { day: 28, hour: 10 }, { day: 28, hour: 13 }, { day: 28, hour: 16 }, { day: 28, hour: 19 },
]

const storeHistoricalConfig: { storeId: string; productId: string; productName: string; price: number; cashier: string; qtyRange: [number, number] }[] = [
  { storeId: 'daily-grind', productId: 'dg-americano', productName: 'Americano', price: 120, cashier: 'Michael', qtyRange: [1, 3] },
  { storeId: 'daily-grind', productId: 'dg-latte', productName: 'Cafe Latte', price: 150, cashier: 'Michael', qtyRange: [1, 2] },
  { storeId: 'sizzle-burger', productId: 'sb-classic', productName: 'Classic Smash', price: 189, cashier: 'Carlos', qtyRange: [2, 4] },
  { storeId: 'sizzle-burger', productId: 'sb-cheese', productName: 'Double Cheese', price: 249, cashier: 'Carlos', qtyRange: [1, 3] },
  { storeId: 'tokyo-ramen', productId: 'tr-tonkotsu', productName: 'Tonkotsu Ramen', price: 299, cashier: 'Ken', qtyRange: [1, 3] },
  { storeId: 'tokyo-ramen', productId: 'tr-miso', productName: 'Miso Ramen', price: 279, cashier: 'Ken', qtyRange: [1, 2] },
  { storeId: 'sweet-treats', productId: 'st-ube', productName: 'Ube Cake Slice', price: 165, cashier: 'Anna', qtyRange: [2, 5] },
  { storeId: 'sweet-treats', productId: 'st-choco', productName: 'Choco Lava', price: 185, cashier: 'Anna', qtyRange: [1, 3] },
  { storeId: 'fresh-juice', productId: 'fj-mango', productName: 'Mango Juice', price: 110, cashier: 'Liza', qtyRange: [2, 4] },
  { storeId: 'fresh-juice', productId: 'fj-berry', productName: 'Berry Smoothie', price: 160, cashier: 'Liza', qtyRange: [1, 2] },
  { storeId: 'pinoy-grill', productId: 'pg-sisig', productName: 'Sizzling Sisig', price: 199, cashier: 'Rico', qtyRange: [2, 5] },
  { storeId: 'pinoy-grill', productId: 'pg-liempo', productName: 'Grilled Liempo', price: 219, cashier: 'Rico', qtyRange: [1, 3] },
]

let seed = 42
function seededRandom() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }

storeHistoricalConfig.forEach((cfg) => {
  const store = foodCourtStores.find((s) => s.id === cfg.storeId)
  if (!store) return
  historicalSales.forEach((sale) => {
    const qty = cfg.qtyRange[0] + Math.floor(seededRandom() * (cfg.qtyRange[1] - cfg.qtyRange[0] + 1))
    const method: Order['paymentMethod'] = seededRandom() > 0.5 ? 'card' : 'cash'
    store.orders.push(
      makeOrder(
        [{ productId: cfg.productId, productName: cfg.productName, size: null, addons: [], quantity: qty, unitPrice: cfg.price, totalPrice: cfg.price * qty }],
        'done',
        method,
        daysAgo(sale.day, sale.hour),
        cfg.cashier,
      ),
    )
  })
})
