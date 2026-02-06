'use client'

import type { Card, TenantConfig } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { getCardStatusLabel, maskCardNumber, formatCardExpiry } from '@/lib/format'
import { cn } from '@/lib/utils'
import { CreditCard, Lock, Wifi } from 'lucide-react'

interface CardListItemProps {
  card: Card
  tenant: TenantConfig
  isSelected: boolean
  onSelect: () => void
}

const statusStyles: Record<string, string> = {
  active: 'bg-success/10 text-success border-success/20',
  blocked: 'bg-destructive/10 text-destructive border-destructive/20',
  expired: 'bg-warning/10 text-warning border-warning/20',
  cancelled: 'bg-muted text-muted-foreground border-border',
}

export function CardListItem({ card, tenant, isSelected, onSelect }: CardListItemProps) {
  const isActive = card.status === 'active'

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full text-left rounded-2xl border p-4 transition-all duration-200',
        'hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isSelected
          ? 'border-transparent shadow-lg ring-2'
          : 'border-border/50 bg-card hover:border-border'
      )}
      style={
        isSelected
          ? { ringColor: tenant.colors.primary, borderColor: tenant.colors.primary, boxShadow: `0 4px 20px ${tenant.colors.primary}20` }
          : undefined
      }
    >
      {/* Mini card visual */}
      <div
        className={cn(
          'relative rounded-xl p-3 mb-3 overflow-hidden',
          card.status === 'blocked' && 'opacity-60'
        )}
        style={{
          background:
            card.status === 'blocked'
              ? 'linear-gradient(135deg, #6b7280, #374151)'
              : `linear-gradient(135deg, ${tenant.colors.gradientFrom}, ${tenant.colors.gradientTo})`,
        }}
      >
        {/* Decorative circle */}
        <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />

        <div className="relative flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Wifi className="h-3.5 w-3.5 rotate-90" />
            <span className="text-[10px] font-medium uppercase tracking-wider opacity-80">
              {card.brand === 'visa' ? 'VISA' : 'MC'}
            </span>
          </div>
          <span className="font-mono text-xs tracking-wider">
            {'****'} {card.last4}
          </span>
        </div>

        {/* Blocked overlay icon */}
        {card.status === 'blocked' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Lock className="h-5 w-5 text-white/60" />
          </div>
        )}
      </div>

      {/* Card info */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{card.nickname}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Vence {formatCardExpiry(card.expiryMonth, card.expiryYear)}
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn('text-[10px] shrink-0', statusStyles[card.status])}
        >
          {getCardStatusLabel(card.status)}
        </Badge>
      </div>
    </button>
  )
}
