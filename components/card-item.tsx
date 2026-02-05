'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Card as CardType, TenantConfig } from '@/lib/types'
import { 
  getCardStatusLabel, 
  getCardBrandLabel, 
  maskCardNumber, 
  formatCardExpiry 
} from '@/lib/format'
import { cardDetailPath } from '@/lib/tenant-path'
import { cn } from '@/lib/utils'
import { toggleCardStatus } from '@/lib/api'
import { MoreVertical, Eye, Lock, Unlock, Loader2 } from 'lucide-react'

interface CardItemProps {
  card: CardType
  tenant: TenantConfig
  onStatusChange?: (cardId: string, newStatus: 'active' | 'blocked') => void
}

const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success border-success/20',
  blocked: 'bg-destructive/10 text-destructive border-destructive/20',
  expired: 'bg-warning/10 text-warning border-warning/20',
  cancelled: 'bg-muted text-muted-foreground border-border',
}

export function CardItem({ card, tenant, onStatusChange }: CardItemProps) {
  const [isToggling, setIsToggling] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(card.status)
  
  async function handleToggleStatus() {
    if (currentStatus !== 'active' && currentStatus !== 'blocked') return
    
    setIsToggling(true)
    try {
      const result = await toggleCardStatus(tenant.id, card.id)
      if (result.success && result.data) {
        const newStatus = result.data.status as 'active' | 'blocked'
        setCurrentStatus(newStatus)
        onStatusChange?.(card.id, newStatus)
      }
    } catch (error) {
      console.error('Error toggling card status:', error)
    } finally {
      setIsToggling(false)
    }
  }
  
  const canToggle = currentStatus === 'active' || currentStatus === 'blocked'
  
  return (
    <Card className="group rounded-2xl border-border/50 overflow-hidden transition-shadow hover:shadow-lg">
      {/* Card visual */}
      <div 
        className="relative h-44 p-5 text-white flex flex-col justify-between"
        style={{ 
          background: currentStatus === 'blocked' 
            ? 'linear-gradient(135deg, #6b7280, #374151)'
            : `linear-gradient(135deg, ${tenant.colors.gradientFrom}, ${tenant.colors.gradientTo})`
        }}
      >
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs text-white/70">
              {card.brand === 'visa' ? 'VISA' : 'MASTERCARD'}
            </p>
            <Badge 
              variant="outline" 
              className={cn('text-xs', statusColors[currentStatus])}
            >
              {getCardStatusLabel(currentStatus)}
            </Badge>
          </div>
          
          {/* Chip */}
          <div className="w-10 h-7 rounded bg-gradient-to-br from-yellow-400/80 to-yellow-600/80" />
        </div>
        
        {/* Card number */}
        <div className="space-y-3">
          <p className="font-mono text-lg tracking-wider">
            {maskCardNumber(card.last4)}
          </p>
          
          {/* Bottom row */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] text-white/60 uppercase">Titular</p>
              <p className="text-sm font-medium">{card.cardholderName}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/60 uppercase">Vence</p>
              <p className="text-sm font-mono">{formatCardExpiry(card.expiryMonth, card.expiryYear)}</p>
            </div>
          </div>
        </div>
        
        {/* Blocked overlay */}
        {currentStatus === 'blocked' && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Lock className="h-8 w-8 text-white/70" />
          </div>
        )}
      </div>
      
      {/* Actions */}
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <Link href={cardDetailPath(tenant.id, card.id)}>
            <Button variant="ghost" size="sm" className="rounded-lg gap-2">
              <Eye className="h-4 w-4" />
              Ver detalles
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Acciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem asChild>
                <Link href={cardDetailPath(tenant.id, card.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalles
                </Link>
              </DropdownMenuItem>
              {canToggle && (
                <DropdownMenuItem onClick={handleToggleStatus} disabled={isToggling}>
                  {isToggling ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : currentStatus === 'active' ? (
                    <Lock className="mr-2 h-4 w-4" />
                  ) : (
                    <Unlock className="mr-2 h-4 w-4" />
                  )}
                  {currentStatus === 'active' ? 'Bloquear tarjeta' : 'Desbloquear tarjeta'}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
