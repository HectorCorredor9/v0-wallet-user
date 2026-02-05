// Currency types
export type Currency = 'COP' | 'USD' | 'EUR'

export interface CurrencyInfo {
  code: Currency
  name: string
  symbol: string
  locale: string
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  COP: { code: 'COP', name: 'Peso Colombiano', symbol: '$', locale: 'es-CO' },
  USD: { code: 'USD', name: 'Dólar Estadounidense', symbol: '$', locale: 'en-US' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE' },
}

// Tenant types
export interface TenantConfig {
  id: string
  name: string
  logo: string
  colors: {
    primary: string
    primaryForeground: string
    secondary: string
    gradientFrom: string
    gradientTo: string
  }
}

// User types
export interface User {
  id: string
  tenantId: string
  email: string
  name: string
  phone?: string
  address?: string
  avatarUrl?: string
  walletId: string
  createdAt: string
}

export interface Session {
  tenantId: string
  userId: string
  token: string
}

// Wallet types
export interface WalletBalance {
  currency: Currency
  available: number
  pending: number
  total: number
}

export interface Wallet {
  id: string
  userId: string
  tenantId: string
  balances: WalletBalance[]
  defaultCurrency: Currency
}

// Transaction types
export type TransactionType = 'transfer_in' | 'transfer_out' | 'topup' | 'payment' | 'refund' | 'withdrawal'
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'cancelled'
export type TransactionChannel = 'app' | 'web' | 'api' | 'pos'

export interface Transaction {
  id: string
  walletId: string
  tenantId: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  currency: Currency
  description: string
  reference: string
  channel: TransactionChannel
  createdAt: string
  updatedAt: string
  metadata?: Record<string, unknown>
}

// Card types
export type CardBrand = 'visa' | 'mastercard'
export type CardStatus = 'active' | 'blocked' | 'expired' | 'cancelled'

export interface Card {
  id: string
  userId: string
  tenantId: string
  brand: CardBrand
  last4: string
  expiryMonth: number
  expiryYear: number
  status: CardStatus
  cardholderName: string
  linkedAccountId: string
  limits: {
    daily: number
    monthly: number
    perTransaction: number
  }
  createdAt: string
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
  tenantId: string
}

export interface LoginResponse {
  user: User
  token: string
}

// Filters
export interface TransactionFilters {
  currency?: Currency
  type?: TransactionType
  status?: TransactionStatus
  dateFrom?: string
  dateTo?: string
  amountMin?: number
  amountMax?: number
  search?: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
