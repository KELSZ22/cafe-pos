export interface ProductAddon {
  id: string
  name: string
  price: number
}

export interface ProductSize {
  id: string
  label: string
  priceModifier: number
}

export interface Product {
  id: string
  name: string
  nameFil: string
  category: string
  price: number
  image: string
  description: string
  sizes: ProductSize[]
  addons: ProductAddon[]
  available: boolean
}

export interface Category {
  id: string
  name: string
  nameFil: string
  icon: string
}

export interface OrderItem {
  productId: string
  productName: string
  size: ProductSize | null
  addons: ProductAddon[]
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Order {
  id: string
  orderNumber: number
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  status: 'pending' | 'preparing' | 'done' | 'cancelled'
  paymentMethod: 'cash' | 'card'
  createdAt: string
  cashierName: string
}

export interface StoreSettings {
  storeName: string
  storeSubtitle: string
  taxRate: number
  receiptFooter: string
  cashierName: string
  currency: string
  logoUrl: string
}

export const defaultSettings: StoreSettings = {
  storeName: 'Daily Grind Cafe',
  storeSubtitle: 'Crafted Coffee and Tea',
  taxRate: 12,
  receiptFooter: 'Salamat po sa pagbisita sa Daily Grind! Balik ka ha ♥',
  cashierName: 'Michael',
  currency: '₱',
  logoUrl: '',
}

export const categories: Category[] = [
  { id: 'coffee', name: 'Coffee', nameFil: 'Kape', icon: 'coffee' },
  {
    id: 'non-coffee',
    name: 'Non-Coffee',
    nameFil: 'Walang Kape',
    icon: 'cup-soda',
  },
  { id: 'tea', name: 'Tea', nameFil: 'Tsaa', icon: 'leaf' },
  { id: 'dessert', name: 'Dessert', nameFil: 'Panghimagas', icon: 'cake' },
  {
    id: 'smoothie',
    name: 'Smoothie',
    nameFil: 'Smoothie',
    icon: 'glass-water',
  },
]

export const defaultSizes: ProductSize[] = [
  { id: 'regular', label: 'Regular', priceModifier: 0 },
  { id: 'large', label: 'Large', priceModifier: 30 },
]

export const defaultAddons: ProductAddon[] = [
  { id: 'extra-shot', name: 'Extra Shot', price: 30 },
  { id: 'vanilla-syrup', name: 'Vanilla Syrup', price: 20 },
  { id: 'hazelnut-syrup', name: 'Hazelnut Syrup', price: 20 },
  { id: 'caramel-syrup', name: 'Caramel Syrup', price: 20 },
  { id: 'whipped-cream', name: 'Whipped Cream', price: 25 },
  { id: 'oat-milk', name: 'Oat Milk', price: 35 },
]

export const dessertAddons: ProductAddon[] = [
  { id: 'extra-cream', name: 'Extra Cream', price: 25 },
  { id: 'chocolate-drizzle', name: 'Chocolate Drizzle', price: 20 },
]

export const allGlobalAddons: ProductAddon[] = [
  ...defaultAddons,
  ...dessertAddons,
]
export const allGlobalSizes: ProductSize[] = defaultSizes

const coffeeImages = [
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1534778101976-62847782c213?w=300&h=300&fit=crop',
]

const teaImages = [
  'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=300&h=300&fit=crop',
]

const dessertImages = [
  'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=300&fit=crop',
]

const smoothieImages = [
  'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=300&h=300&fit=crop',
]

export const products: Product[] = [
  // Coffee
  {
    id: 'americano',
    name: 'Americano',
    nameFil: 'Kapeng Amerikano',
    category: 'coffee',
    price: 120,
    image: coffeeImages[0]!,
    description: 'Classic espresso with hot water',
    sizes: defaultSizes,
    addons: defaultAddons,
    available: true,
  },
  {
    id: 'cafe-latte',
    name: 'Cafe Latte',
    nameFil: 'Kapeng Latte',
    category: 'coffee',
    price: 150,
    image: coffeeImages[1]!,
    description: 'Espresso with steamed milk',
    sizes: defaultSizes,
    addons: defaultAddons,
    available: true,
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    nameFil: 'Kapuchino',
    category: 'coffee',
    price: 150,
    image: coffeeImages[2]!,
    description: 'Espresso with steamed milk foam',
    sizes: defaultSizes,
    addons: defaultAddons,
    available: true,
  },
  {
    id: 'vanilla-latte',
    name: 'Vanilla Latte',
    nameFil: 'Banilya Latte',
    category: 'coffee',
    price: 170,
    image: coffeeImages[3]!,
    description: 'Espresso with vanilla and steamed milk',
    sizes: defaultSizes,
    addons: defaultAddons,
    available: true,
  },
  {
    id: 'caramel-macchiato',
    name: 'Caramel Macchiato',
    nameFil: 'Karamel Makiyato',
    category: 'coffee',
    price: 180,
    image:
      'https://imgs.search.brave.com/EUtMhPYxwNIXZESt6FppyuDiUzdMJ5PyMd8dZq9HxlM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEzLzE3LzcyLzA1/LzM2MF9GXzEzMTc3/MjA1NjJfaEJ2Y1Rp/QTlyUDVQY0dVaTBG/T2N3TmtmWnNhSHVP/c3ouanBn',
    description: 'Espresso with caramel and steamed milk',
    sizes: defaultSizes,
    addons: defaultAddons,
    available: true,
  },
  {
    id: 'mocha',
    name: 'Cafe Mocha',
    nameFil: 'Kapeng Moka',
    category: 'coffee',
    price: 175,
    image: coffeeImages[5]!,
    description: 'Espresso with chocolate and steamed milk',
    sizes: defaultSizes,
    addons: defaultAddons,
    available: true,
  },
  // Non-Coffee
  {
    id: 'chocolate-latte',
    name: 'Chocolate Latte',
    nameFil: 'Tsokolateng Latte',
    category: 'non-coffee',
    price: 155,
    image:
      'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=300&h=300&fit=crop',
    description: 'Rich chocolate with steamed milk',
    sizes: defaultSizes,
    addons: [defaultAddons[4]!, defaultAddons[5]!],
    available: true,
  },
  {
    id: 'strawberry-latte',
    name: 'Strawberry Latte',
    nameFil: 'Istroberi Latte',
    category: 'non-coffee',
    price: 165,
    image:
      'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=300&h=300&fit=crop',
    description: 'Sweet strawberry with milk',
    sizes: defaultSizes,
    addons: [defaultAddons[4]!],
    available: true,
  },
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    nameFil: 'Matsa Latte',
    category: 'non-coffee',
    price: 175,
    image:
      'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=300&h=300&fit=crop',
    description: 'Premium matcha with steamed milk',
    sizes: defaultSizes,
    addons: [defaultAddons[4]!, defaultAddons[5]!],
    available: true,
  },
  {
    id: 'ube-latte',
    name: 'Ube Latte',
    nameFil: 'Ubeng Latte',
    category: 'non-coffee',
    price: 175,
    image:
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=300&fit=crop',
    description: 'Creamy purple yam latte',
    sizes: defaultSizes,
    addons: [defaultAddons[4]!],
    available: true,
  },
  // Tea
  {
    id: 'green-tea',
    name: 'Green Tea',
    nameFil: 'Berdeng Tsaa',
    category: 'tea',
    price: 100,
    image: teaImages[0]!,
    description: 'Traditional green tea',
    sizes: defaultSizes,
    addons: [],
    available: true,
  },
  {
    id: 'calamansi-tea',
    name: 'Calamansi Honey Tea',
    nameFil: 'Kalamansi at Pulot-Pukyutan',
    category: 'tea',
    price: 110,
    image: teaImages[1]!,
    description: 'Fresh calamansi with local honey',
    sizes: defaultSizes,
    addons: [],
    available: true,
  },
  {
    id: 'chamomile-tea',
    name: 'Chamomile Tea',
    nameFil: 'Tsaang Kamomile',
    category: 'tea',
    price: 100,
    image: teaImages[2]!,
    description: 'Calming chamomile herbal tea',
    sizes: defaultSizes,
    addons: [],
    available: true,
  },
  {
    id: 'earl-grey',
    name: 'Earl Grey',
    nameFil: 'Earl Grey Tsaa',
    category: 'tea',
    price: 110,
    image:
      'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=300&fit=crop',
    description: 'Classic bergamot black tea',
    sizes: defaultSizes,
    addons: [],
    available: true,
  },
  // Dessert
  {
    id: 'ensaymada',
    name: 'Ensaymada',
    nameFil: 'Ensaymadang Espesyal',
    category: 'dessert',
    price: 85,
    image: dessertImages[0]!,
    description: 'Soft buttery Filipino bread with cheese',
    sizes: [],
    addons: dessertAddons,
    available: true,
  },
  {
    id: 'leche-flan',
    name: 'Leche Flan',
    nameFil: 'Letse Flan',
    category: 'dessert',
    price: 120,
    image: dessertImages[1]!,
    description: 'Classic Filipino caramel custard',
    sizes: [],
    addons: dessertAddons,
    available: true,
  },
  {
    id: 'ube-cheesecake',
    name: 'Ube Cheesecake',
    nameFil: 'Ubeng Cheesecake',
    category: 'dessert',
    price: 165,
    image: dessertImages[2]!,
    description: 'Creamy ube-flavored cheesecake',
    sizes: [],
    addons: dessertAddons,
    available: true,
  },
  {
    id: 'buko-pandan',
    name: 'Buko Pandan Cake',
    nameFil: 'Bukong Pandan Keyk',
    category: 'dessert',
    price: 140,
    image: dessertImages[3]!,
    description: 'Coconut pandan chiffon slice',
    sizes: [],
    addons: dessertAddons,
    available: true,
  },
  // Smoothie
  {
    id: 'mango-smoothie',
    name: 'Mango Smoothie',
    nameFil: 'Mangang Smoothie',
    category: 'smoothie',
    price: 160,
    image: smoothieImages[0]!,
    description: 'Fresh Philippine mango smoothie',
    sizes: defaultSizes,
    addons: [defaultAddons[4]!],
    available: true,
  },
  {
    id: 'berry-smoothie',
    name: 'Mixed Berry Smoothie',
    nameFil: 'Halong Berries Smoothie',
    category: 'smoothie',
    price: 175,
    image: smoothieImages[1]!,
    description: 'Blend of fresh berries',
    sizes: defaultSizes,
    addons: [defaultAddons[4]!],
    available: true,
  },
]

function generateOrderNumber(): number {
  return Math.floor(1000 + Math.random() * 9000)
}

const now = new Date()

export const sampleOrders: Order[] = [
  {
    id: 'order-1',
    orderNumber: generateOrderNumber(),
    items: [
      {
        productId: 'americano',
        productName: 'Americano',
        size: { id: 'large', label: 'Large', priceModifier: 30 },
        addons: [{ id: 'extra-shot', name: 'Extra Shot', price: 30 }],
        quantity: 2,
        unitPrice: 180,
        totalPrice: 360,
      },
      {
        productId: 'ensaymada',
        productName: 'Ensaymada',
        size: null,
        addons: [],
        quantity: 1,
        unitPrice: 85,
        totalPrice: 85,
      },
    ],
    subtotal: 445,
    tax: 53,
    total: 498,
    status: 'done',
    paymentMethod: 'card',
    createdAt: new Date(now.getTime() - 3600000 * 2).toISOString(),
    cashierName: 'Michael',
  },
  {
    id: 'order-2',
    orderNumber: generateOrderNumber(),
    items: [
      {
        productId: 'matcha-latte',
        productName: 'Matcha Latte',
        size: { id: 'regular', label: 'Regular', priceModifier: 0 },
        addons: [],
        quantity: 1,
        unitPrice: 175,
        totalPrice: 175,
      },
    ],
    subtotal: 175,
    tax: 21,
    total: 196,
    status: 'done',
    paymentMethod: 'cash',
    createdAt: new Date(now.getTime() - 3600000).toISOString(),
    cashierName: 'Michael',
  },
  {
    id: 'order-3',
    orderNumber: generateOrderNumber(),
    items: [
      {
        productId: 'cafe-latte',
        productName: 'Cafe Latte',
        size: { id: 'large', label: 'Large', priceModifier: 30 },
        addons: [{ id: 'vanilla-syrup', name: 'Vanilla Syrup', price: 20 }],
        quantity: 1,
        unitPrice: 200,
        totalPrice: 200,
      },
      {
        productId: 'leche-flan',
        productName: 'Leche Flan',
        size: null,
        addons: [],
        quantity: 2,
        unitPrice: 120,
        totalPrice: 240,
      },
    ],
    subtotal: 440,
    tax: 53,
    total: 493,
    status: 'preparing',
    paymentMethod: 'card',
    createdAt: new Date(now.getTime() - 1800000).toISOString(),
    cashierName: 'Michael',
  },
  {
    id: 'order-4',
    orderNumber: generateOrderNumber(),
    items: [
      {
        productId: 'green-tea',
        productName: 'Green Tea',
        size: { id: 'regular', label: 'Regular', priceModifier: 0 },
        addons: [],
        quantity: 1,
        unitPrice: 100,
        totalPrice: 100,
      },
    ],
    subtotal: 100,
    tax: 12,
    total: 112,
    status: 'pending',
    paymentMethod: 'card',
    createdAt: new Date(now.getTime() - 600000).toISOString(),
    cashierName: 'Michael',
  },
  {
    id: 'order-5',
    orderNumber: generateOrderNumber(),
    items: [
      {
        productId: 'caramel-macchiato',
        productName: 'Caramel Macchiato',
        size: { id: 'large', label: 'Large', priceModifier: 30 },
        addons: [
          { id: 'extra-shot', name: 'Extra Shot', price: 30 },
          { id: 'whipped-cream', name: 'Whipped Cream', price: 25 },
        ],
        quantity: 1,
        unitPrice: 265,
        totalPrice: 265,
      },
      {
        productId: 'ube-cheesecake',
        productName: 'Ube Cheesecake',
        size: null,
        addons: [],
        quantity: 1,
        unitPrice: 165,
        totalPrice: 165,
      },
    ],
    subtotal: 430,
    tax: 52,
    total: 482,
    status: 'done',
    paymentMethod: 'cash',
    createdAt: new Date(now.getTime() - 7200000).toISOString(),
    cashierName: 'Michael',
  },
]
