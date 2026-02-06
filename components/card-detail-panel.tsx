'use client'

import { useState } from 'react'
import type { Card as CardType, TenantConfig, Transaction } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { RecentTransactions } from '@/components/recent-transactions'
import {
  getCardStatusLabel,
  maskCardNumber,
  formatCardExpiry,
  formatCurrency,
  copyToClipboard,
} from '@/lib/format'
import { toggleCardStatus } from '@/lib/api'
import { cn } from '@/lib/utils'
import {
  Lock,
  Unlock,
  Copy,
  Check,
  Loader2,
  Wallet,
  DollarSign,
  Calendar,
  Wifi,
  CreditCard,
} from 'lucide-react'

interface CardDetailPanelProps {
  card: CardType
  tenant: TenantConfig
  transactions: Transaction[]
  onStatusChange?: (newStatus: 'active' | 'blocked') => void
}

const statusStyles: Record<string, string> = {
  active: 'bg-success/10 text-success border-success/20',
  blocked: 'bg-destructive/10 text-destructive border-destructive/20',
  expired: 'bg-warning/10 text-warning border-warning/20',
  cancelled: 'bg-muted text-muted-foreground border-border',
}

export function CardDetailPanel({
  card,
  tenant,
  transactions,
  onStatusChange,
}: CardDetailPanelProps) {
  const [isToggling, setIsToggling] = useState(false)
  const [copied, setCopied] = useState(false)

  const canToggle = card.status === 'active' || card.status === 'blocked'

  async function handleToggleStatus() {
    if (!canToggle) return
    setIsToggling(true)
    try {
      const result = await toggleCardStatus(tenant.id, card.id)
      if (result.success && result.data) {
        onStatusChange?.(result.data.status as 'active' | 'blocked')
      }
    } catch (error) {
      console.error('Error toggling card status:', error)
    } finally {
      setIsToggling(false)
    }
  }

  async function handleCopyNumber() {
    const masked = maskCardNumber(card.last4)
    const success = await copyToClipboard(masked)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Card hero visual */}
      <div
        className="relative rounded-2xl p-6 text-white overflow-hidden"
        style={{
          background:
            card.status === 'blocked'
              ? 'linear-gradient(135deg, #6b7280, #374151)'
              : `linear-gradient(135deg, ${tenant.colors.gradientFrom}, ${tenant.colors.gradientTo})`,
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

        <div className="relative space-y-6">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 rotate-90 text-white/60" />
                <span className="text-sm text-white/70 font-medium uppercase tracking-wider">
                  {card.brand === 'visa' ? 'VISA' : 'MASTERCARD'}
                </span>
                <Badge
                  variant="outline"
                  className={cn('text-xs', statusStyles[card.status])}
                >
                  {getCardStatusLabel(card.status)}
                </Badge>
              </div>
              <p className="text-lg font-semibold text-white/90">{card.nickname}</p>
            </div>

            {/* Chip */}
            <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-400/80 to-yellow-600/80" />
          </div>

          {/* Card number */}
          <div className="flex items-center gap-3">
            <p className="font-mono text-2xl tracking-widest">
              {maskCardNumber(card.last4)}
            </p>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:bg-white/10 hover:text-white"
              onClick={handleCopyNumber}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copiar numero</span>
            </Button>
          </div>

          {/* Bottom row */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-white/60 uppercase mb-1">Titular</p>
              <p className="text-base font-medium">{card.cardholderName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60 uppercase mb-1">Vence</p>
              <p className="text-base font-mono">
                {formatCardExpiry(card.expiryMonth, card.expiryYear)}
              </p>
            </div>
          </div>
        </div>

        {/* Blocked overlay */}
        {card.status === 'blocked' && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Lock className="h-12 w-12 text-white/50" />
          </div>
        )}
      </div>

      {/* Quick action */}
      {canToggle && (
        <Button
          variant="outline"
          className="w-full rounded-xl gap-2"
          onClick={handleToggleStatus}
          disabled={isToggling}
        >
          {isToggling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : card.status === 'active' ? (
            <Lock className="h-4 w-4" />
          ) : (
            <Unlock className="h-4 w-4" />
          )}
          {card.status === 'active' ? 'Bloquear tarjeta' : 'Desbloquear tarjeta'}
        </Button>
      )}

      {/* Info grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Limits */}
        <Card className="rounded-2xl border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Limites</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <LimitRow
              label="Por transaccion"
              value={formatCurrency(card.limits.perTransaction, 'COP')}
              icon={DollarSign}
            />
            <Separator className="bg-border/50" />
            <LimitRow
              label="Diario"
              value={formatCurrency(card.limits.daily, 'COP')}
              icon={Calendar}
            />
            <Separator className="bg-border/50" />
            <LimitRow
              label="Mensual"
              value={formatCurrency(card.limits.monthly, 'COP')}
              icon={Calendar}
            />
          </CardContent>
        </Card>

        {/* Linked account */}
        <Card className="rounded-2xl border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cuenta vinculada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/50">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: tenant.colors.primary }}
              >
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">Billetera Principal</p>
                <p className="text-xs text-muted-foreground font-mono truncate">
                  {card.linkedAccountId}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent transactions */}
      <RecentTransactions transactions={transactions} tenant={tenant} />
    </div>
  )
}

/* ---- Limit row sub-component ---- */
function LimitRow({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-accent/60 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  )
}
