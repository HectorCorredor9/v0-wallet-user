import type {
  User,
  Wallet,
  Transaction,
  Card,
  LoginResponse,
  ApiResponse,
  TransactionFilters,
  PaginatedResponse,
  TenantConfig,
} from './types'

const API_BASE = '/api'

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Error en la solicitud' }
    }
    
    return { success: true, data }
  } catch (error) {
    return { success: false, error: 'Error de conexión' }
  }
}

// Auth API
export async function login(tenantId: string, email: string, password: string): Promise<ApiResponse<LoginResponse>> {
  return fetchApi<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ tenantId, email, password }),
  })
}

export async function logout(): Promise<ApiResponse<void>> {
  return fetchApi<void>('/auth/logout', { method: 'POST' })
}

export async function getMe(): Promise<ApiResponse<User>> {
  return fetchApi<User>('/auth/me')
}

// Tenant API
export async function getTenant(tenantId: string): Promise<ApiResponse<TenantConfig>> {
  return fetchApi<TenantConfig>(`/tenant?tenantId=${tenantId}`)
}

// Wallet API
export async function getWallet(tenantId: string): Promise<ApiResponse<Wallet>> {
  return fetchApi<Wallet>(`/wallet?tenantId=${tenantId}`)
}

// Transactions API
export async function getTransactions(
  tenantId: string,
  filters?: TransactionFilters,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
  const params = new URLSearchParams({ tenantId, page: page.toString(), limit: limit.toString() })
  
  if (filters) {
    if (filters.currency) params.set('currency', filters.currency)
    if (filters.type) params.set('type', filters.type)
    if (filters.status) params.set('status', filters.status)
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
    if (filters.dateTo) params.set('dateTo', filters.dateTo)
    if (filters.amountMin) params.set('amountMin', filters.amountMin.toString())
    if (filters.amountMax) params.set('amountMax', filters.amountMax.toString())
    if (filters.search) params.set('search', filters.search)
  }
  
  return fetchApi<PaginatedResponse<Transaction>>(`/transactions?${params.toString()}`)
}

// Cards API
export async function getCards(tenantId: string): Promise<ApiResponse<Card[]>> {
  return fetchApi<Card[]>(`/cards?tenantId=${tenantId}`)
}

export async function getCard(tenantId: string, cardId: string): Promise<ApiResponse<Card>> {
  return fetchApi<Card>(`/cards/${cardId}?tenantId=${tenantId}`)
}

export async function toggleCardStatus(tenantId: string, cardId: string): Promise<ApiResponse<Card>> {
  return fetchApi<Card>(`/cards/${cardId}/toggle`, {
    method: 'POST',
    body: JSON.stringify({ tenantId }),
  })
}

// User profile API
export async function updateProfile(tenantId: string, data: Partial<User>): Promise<ApiResponse<User>> {
  return fetchApi<User>('/profile', {
    method: 'PATCH',
    body: JSON.stringify({ tenantId, ...data }),
  })
}

export async function changePassword(
  tenantId: string,
  currentPassword: string,
  newPassword: string
): Promise<ApiResponse<void>> {
  return fetchApi<void>('/profile/password', {
    method: 'POST',
    body: JSON.stringify({ tenantId, currentPassword, newPassword }),
  })
}
