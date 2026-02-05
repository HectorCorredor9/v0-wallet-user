'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Card, TenantConfig } from '@/lib/types'
import { 
  getCardStatusLabel, 
  maskCardNumber, 
  formatCardExpiry,
  copyToClipboard
} from '@/lib/format'
import { toggleCardStatus } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Lock, Unlock, Copy, Check, Loader2 } from 'lucide-react'

interface CardDetailHeaderProps {
  card: Card
  tenant: TenantConfig
  onStatusChange?: (newStatus: 'active' | 'blocked') => void
}

const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success border-success/20',
  blocked: 'bg-destructive/10 text-destructive border-destructive/20',
  expired: 'bg-warning/10 text-warning border-warning/20',
  cancelled: 'bg-muted text-muted-foreground border-border',
}

export function CardDetailHeader({ card, tenant, onStatusChange }: CardDetailHeaderProps) {
  const [isToggling, setIsToggling] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(card.status)
  const [copied, setCopied] = useState(false)
  
  async function handleToggleStatus() {
    if (currentStatus !== 'active' && currentStatus !== 'blocked') return
    
    setIsToggling(true)
    try {
      const result = await toggleCardStatus(tenant.id, card.id)
      if (result.success && result.data) {
        const newStatus = result.data.status as 'active' | 'blocked'
        setCurrentStatus(newStatus)
        onStatusChange?.(newStatus)
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
  
  const canToggle = currentStatus === 'active' || currentStatus === 'blocked'
  
  return (
    <div 
      className="relative rounded-2xl p-6 text-white overflow-hidden"
      style={{ 
        background: currentStatus === 'blocked' 
          ? 'linear-gradient(135deg, #6b7280, #374151)'
          : `linear-gradient(135deg, ${tenant.colors.gradientFrom}, ${tenant.colors.gradientTo})`
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
              <span className="text-sm text-white/70">
                {card.brand === 'visa' ? 'VISA' : 'MASTERCARD'}
              </span>
              <Badge 
                variant="outline" 
                className={cn('text-xs', statusColors[currentStatus])}
              >
                {getCardStatusLabel(currentStatus)}
              </Badge>
            </div>
            <div className="w-14 h-10 rounded-md bg-gradient-to-br from-yellow-400/80 to-yellow-600/80" />
          </div>
          
          {/* Actions */}
          {canToggle && (
            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl bg-white/10 hover:bg-white/20 text-white border-0"
              onClick={handleToggleStatus}
              disabled={isToggling}
            >
              {isToggling ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : currentStatus === 'active' ? (
                <Lock className="mr-2 h-4 w-4" />
              ) : (
                <Unlock className="mr-2 h-4 w-4" />
              )}
              {currentStatus === 'active' ? 'Bloquear' : 'Desbloquear'}
            </Button>
          )}
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
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
            <p className="text-base font-mono">{formatCardExpiry(card.expiryMonth, card.expiryYear)}</p>
          </div>
        </div>
      </div>
      
      {/* Blocked overlay */}
      {currentStatus === 'blocked' && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <Lock className="h-12 w-12 text-white/50" />
        </div>
      )}
    </div>
  )
}
