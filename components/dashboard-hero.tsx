'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { TenantConfig, User } from '@/lib/types'
import { copyToClipboard } from '@/lib/format'
import { Copy, Check } from 'lucide-react'

interface DashboardHeroProps {
  tenant: TenantConfig
  user: User
}

export function DashboardHero({ tenant, user }: DashboardHeroProps) {
  const [copied, setCopied] = useState(false)
  
  const greeting = getGreeting()
  const firstName = user.name.split(' ')[0]
  
  async function handleCopy() {
    const success = await copyToClipboard(user.walletId)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  return (
    <div 
      className="rounded-2xl p-6 text-white relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${tenant.colors.gradientFrom}, ${tenant.colors.gradientTo})` 
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        <p className="text-white/80 text-sm">{greeting}</p>
        <h1 className="text-2xl font-bold mt-1">{firstName}</h1>
        
        <div className="mt-4 flex items-center gap-2">
          <div className="bg-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <span className="text-xs text-white/70">Wallet ID:</span>
            <code className="text-xs font-mono">{user.walletId}</code>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/10 hover:text-white"
            onClick={handleCopy}
            aria-label={copied ? 'Copiado' : 'Copiar Wallet ID'}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días,'
  if (hour < 18) return 'Buenas tardes,'
  return 'Buenas noches,'
}
