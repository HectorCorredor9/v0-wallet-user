import type { Currency, TransactionType, TransactionStatus, CardStatus, CardBrand } from './types'
import { CURRENCIES } from './types'

// Format currency amount
export function formatCurrency(amount: number, currency: Currency): string {
  const info = CURRENCIES[currency]
  return new Intl.NumberFormat(info.locale, {
    style: 'currency',
    currency: info.code,
    minimumFractionDigits: currency === 'COP' ? 0 : 2,
    maximumFractionDigits: currency === 'COP' ? 0 : 2,
  }).format(amount)
}

// Format date
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(date)
}

// Format date with time
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Format relative time
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      if (diffMinutes < 1) return 'Ahora mismo'
      return `Hace ${diffMinutes} min`
    }
    return `Hace ${diffHours}h`
  }
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
  
  return formatDate(dateString)
}

// Transaction type labels
export function getTransactionTypeLabel(type: TransactionType): string {
  const labels: Record<TransactionType, string> = {
    transfer_in: 'Transferencia recibida',
    transfer_out: 'Transferencia enviada',
    topup: 'Recarga',
    payment: 'Pago',
    refund: 'Reembolso',
    withdrawal: 'Retiro',
  }
  return labels[type]
}

// Transaction type icons (for matching with Lucide icons)
export function getTransactionTypeIcon(type: TransactionType): string {
  const icons: Record<TransactionType, string> = {
    transfer_in: 'ArrowDownLeft',
    transfer_out: 'ArrowUpRight',
    topup: 'Plus',
    payment: 'CreditCard',
    refund: 'RotateCcw',
    withdrawal: 'Banknote',
  }
  return icons[type]
}

// Transaction status labels
export function getTransactionStatusLabel(status: TransactionStatus): string {
  const labels: Record<TransactionStatus, string> = {
    completed: 'Completado',
    pending: 'Pendiente',
    failed: 'Fallido',
    cancelled: 'Cancelado',
  }
  return labels[status]
}

// Card status labels
export function getCardStatusLabel(status: CardStatus): string {
  const labels: Record<CardStatus, string> = {
    active: 'Activa',
    blocked: 'Bloqueada',
    expired: 'Expirada',
    cancelled: 'Cancelada',
  }
  return labels[status]
}

// Card brand labels
export function getCardBrandLabel(brand: CardBrand): string {
  const labels: Record<CardBrand, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
  }
  return labels[brand]
}

// Mask card number
export function maskCardNumber(last4: string): string {
  return `•••• •••• •••• ${last4}`
}

// Format card expiry
export function formatCardExpiry(month: number, year: number): string {
  return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
