import type {
  User,
  Wallet,
  Transaction,
  Card,
  Currency,
  TransactionType,
  TransactionStatus,
  TransactionChannel,
  CardBrand,
  CardStatus,
} from './types'

// Seeded random for deterministic data
function seededRandom(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return function() {
    hash = Math.sin(hash) * 10000
    return hash - Math.floor(hash)
  }
}

// Generate mock user for a tenant
export function getMockUser(tenantId: string, userId: string = 'user-001'): User {
  const rand = seededRandom(`${tenantId}-${userId}`)
  const names: Record<string, string> = {
    tebca: 'Carlos Rodríguez',
    demo: 'María García',
  }
  
  return {
    id: userId,
    tenantId,
    email: `usuario@${tenantId}.com`,
    name: names[tenantId] || `Usuario ${tenantId}`,
    phone: `+57 300 ${Math.floor(rand() * 9000000 + 1000000)}`,
    address: 'Calle 100 #15-20, Bogotá, Colombia',
    walletId: `wallet-${tenantId}-${userId}`,
    createdAt: '2024-01-15T10:00:00Z',
  }
}

// Generate mock wallet for a tenant
export function getMockWallet(tenantId: string, userId: string = 'user-001'): Wallet {
  const rand = seededRandom(`${tenantId}-wallet-${userId}`)
  
  const copBalance = Math.floor(rand() * 50000000) + 1000000
  const usdBalance = Math.floor(rand() * 10000) + 500
  const eurBalance = Math.floor(rand() * 8000) + 300
  
  return {
    id: `wallet-${tenantId}-${userId}`,
    userId,
    tenantId,
    defaultCurrency: 'COP',
    balances: [
      {
        currency: 'COP',
        available: copBalance,
        pending: Math.floor(rand() * 500000),
        total: copBalance + Math.floor(rand() * 500000),
      },
      {
        currency: 'USD',
        available: usdBalance,
        pending: Math.floor(rand() * 100),
        total: usdBalance + Math.floor(rand() * 100),
      },
      {
        currency: 'EUR',
        available: eurBalance,
        pending: Math.floor(rand() * 50),
        total: eurBalance + Math.floor(rand() * 50),
      },
    ],
  }
}

// Generate mock transactions for a tenant
export function getMockTransactions(tenantId: string, userId: string = 'user-001', count: number = 50): Transaction[] {
  const rand = seededRandom(`${tenantId}-transactions-${userId}`)
  const transactions: Transaction[] = []
  
  const types: TransactionType[] = ['transfer_in', 'transfer_out', 'topup', 'payment', 'refund', 'withdrawal']
  const statuses: TransactionStatus[] = ['completed', 'pending', 'failed', 'cancelled']
  const channels: TransactionChannel[] = ['app', 'web', 'api', 'pos']
  const currencies: Currency[] = ['COP', 'USD', 'EUR']
  
  const descriptions: Record<TransactionType, string[]> = {
    transfer_in: ['Transferencia recibida de Juan Pérez', 'Pago de nómina', 'Reembolso de compra'],
    transfer_out: ['Transferencia a María López', 'Pago de servicios', 'Envío a familiar'],
    topup: ['Recarga desde Bancolombia', 'Recarga PSE', 'Depósito en efectivo'],
    payment: ['Pago en Rappi', 'Compra en Amazon', 'Netflix suscripción', 'Uber Eats'],
    refund: ['Devolución Mercado Libre', 'Reembolso parcial', 'Cancelación de pedido'],
    withdrawal: ['Retiro cajero', 'Retiro corresponsal', 'Transferencia a banco'],
  }
  
  const now = new Date()
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(rand() * types.length)]
    const status = rand() > 0.15 ? 'completed' : statuses[Math.floor(rand() * statuses.length)]
    const currency = currencies[Math.floor(rand() * currencies.length)]
    const channel = channels[Math.floor(rand() * channels.length)]
    const descList = descriptions[type]
    const description = descList[Math.floor(rand() * descList.length)]
    
    let amount: number
    if (currency === 'COP') {
      amount = Math.floor(rand() * 5000000) + 10000
    } else if (currency === 'USD') {
      amount = Math.floor(rand() * 2000) + 10
    } else {
      amount = Math.floor(rand() * 1500) + 10
    }
    
    const daysAgo = Math.floor(rand() * 90)
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    
    transactions.push({
      id: `txn-${tenantId}-${i.toString().padStart(4, '0')}`,
      walletId: `wallet-${tenantId}-${userId}`,
      tenantId,
      type,
      status,
      amount,
      currency,
      description,
      reference: `REF-${Math.floor(rand() * 1000000).toString().padStart(8, '0')}`,
      channel,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    })
  }
  
  // Sort by date descending
  return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Generate mock cards for a tenant
export function getMockCards(tenantId: string, userId: string = 'user-001'): Card[] {
  const rand = seededRandom(`${tenantId}-cards-${userId}`)
  const brands: CardBrand[] = ['visa', 'mastercard']
  
  const user = getMockUser(tenantId, userId)
  
  return [
    {
      id: `card-${tenantId}-001`,
      userId,
      tenantId,
      nickname: 'Tarjeta Principal',
      brand: brands[Math.floor(rand() * brands.length)],
      last4: Math.floor(rand() * 9000 + 1000).toString(),
      expiryMonth: Math.floor(rand() * 12) + 1,
      expiryYear: 2027,
      status: 'active',
      cardholderName: user.name.toUpperCase(),
      linkedAccountId: `wallet-${tenantId}-${userId}`,
      limits: {
        daily: 10000000,
        monthly: 50000000,
        perTransaction: 5000000,
      },
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: `card-${tenantId}-002`,
      userId,
      tenantId,
      nickname: 'Compras Online',
      brand: brands[Math.floor(rand() * brands.length)],
      last4: Math.floor(rand() * 9000 + 1000).toString(),
      expiryMonth: Math.floor(rand() * 12) + 1,
      expiryYear: 2026,
      status: 'active',
      cardholderName: user.name.toUpperCase(),
      linkedAccountId: `wallet-${tenantId}-${userId}`,
      limits: {
        daily: 5000000,
        monthly: 20000000,
        perTransaction: 2000000,
      },
      createdAt: '2023-06-01T10:00:00Z',
    },
    {
      id: `card-${tenantId}-003`,
      userId,
      tenantId,
      nickname: 'Viajes',
      brand: 'visa',
      last4: Math.floor(rand() * 9000 + 1000).toString(),
      expiryMonth: Math.floor(rand() * 12) + 1,
      expiryYear: 2028,
      status: 'active',
      cardholderName: user.name.toUpperCase(),
      linkedAccountId: `wallet-${tenantId}-${userId}`,
      limits: {
        daily: 15000000,
        monthly: 80000000,
        perTransaction: 10000000,
      },
      createdAt: '2024-06-20T10:00:00Z',
    },
    {
      id: `card-${tenantId}-004`,
      userId,
      tenantId,
      nickname: 'Ahorros',
      brand: 'mastercard',
      last4: Math.floor(rand() * 9000 + 1000).toString(),
      expiryMonth: Math.floor(rand() * 12) + 1,
      expiryYear: 2027,
      status: 'blocked',
      cardholderName: user.name.toUpperCase(),
      linkedAccountId: `wallet-${tenantId}-${userId}`,
      limits: {
        daily: 3000000,
        monthly: 10000000,
        perTransaction: 1000000,
      },
      createdAt: '2024-03-10T10:00:00Z',
    },
    {
      id: `card-${tenantId}-005`,
      userId,
      tenantId,
      nickname: 'Suscripciones',
      brand: 'visa',
      last4: Math.floor(rand() * 9000 + 1000).toString(),
      expiryMonth: 3,
      expiryYear: 2025,
      status: 'expired',
      cardholderName: user.name.toUpperCase(),
      linkedAccountId: `wallet-${tenantId}-${userId}`,
      limits: {
        daily: 2000000,
        monthly: 8000000,
        perTransaction: 500000,
      },
      createdAt: '2022-11-05T10:00:00Z',
    },
  ]
}

// Get a specific card
export function getMockCard(tenantId: string, cardId: string, userId: string = 'user-001'): Card | null {
  const cards = getMockCards(tenantId, userId)
  return cards.find(c => c.id === cardId) || null
}

// Get card transactions
export function getMockCardTransactions(tenantId: string, cardId: string, userId: string = 'user-001', count: number = 5): Transaction[] {
  const allTransactions = getMockTransactions(tenantId, userId)
  // Filter to payment and withdrawal types (card-related)
  return allTransactions
    .filter(t => t.type === 'payment' || t.type === 'withdrawal')
    .slice(0, count)
}

// Validate login credentials (mock)
export function validateMockLogin(tenantId: string, email: string, password: string): User | null {
  // For demo purposes, accept any password with valid email format
  if (email && password && password.length >= 6) {
    return getMockUser(tenantId)
  }
  return null
}
