'use client'

import React from "react"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import type { Wallet, Currency, TenantConfig } from '@/lib/types'
import { CURRENCIES } from '@/lib/types'
import { formatCurrency } from '@/lib/format'
import { TrendingUp, TrendingDown, Clock } from 'lucide-react'

interface BalanceMultiCurrencyProps {
  wallet: Wallet | null
  tenant: TenantConfig
  isLoading?: boolean
}

export function BalanceMultiCurrency({ wallet, tenant, isLoading }: BalanceMultiCurrencyProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(wallet?.defaultCurrency || 'COP')
  
  if (isLoading) {
    return (
      <Card className="rounded-2xl border-border/50 shadow-lg overflow-hidden">
        <div 
          className="h-2"
          style={{ background: `linear-gradient(to right, ${tenant.colors.gradientFrom}, ${tenant.colors.gradientTo})` }}
        />
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-16 flex-1" />
            <Skeleton className="h-16 flex-1" />
          </div>
        </CardContent>
      </Card>
    )
  }
  
  const balance = wallet?.balances.find(b => b.currency === selectedCurrency)
  const currencyInfo = CURRENCIES[selectedCurrency]
  
  return (
    <Card className="rounded-2xl border-border/50 shadow-lg overflow-hidden">
      <div 
        className="h-2"
        style={{ background: `linear-gradient(to right, ${tenant.colors.gradientFrom}, ${tenant.colors.gradientTo})` }}
      />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-muted-foreground">
            Saldo disponible
          </CardTitle>
          <Tabs value={selectedCurrency} onValueChange={(v) => setSelectedCurrency(v as Currency)}>
            <TabsList className="h-8 rounded-lg">
              {Object.keys(CURRENCIES).map((curr) => (
                <TabsTrigger 
                  key={curr} 
                  value={curr}
                  className="text-xs px-2 rounded-md data-[state=active]:text-white"
                  style={{ 
                    '--tw-ring-color': tenant.colors.primary,
                  } as React.CSSProperties}
                  data-active-style={selectedCurrency === curr ? { backgroundColor: tenant.colors.primary } : undefined}
                >
                  {curr}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p 
            className="text-4xl font-bold tracking-tight"
            style={{ color: tenant.colors.primary }}
          >
            {balance ? formatCurrency(balance.available, selectedCurrency) : '$0'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {currencyInfo.name}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-accent/50 p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Pendiente</span>
            </div>
            <p className="text-lg font-semibold">
              {balance ? formatCurrency(balance.pending, selectedCurrency) : '$0'}
            </p>
          </div>
          <div className="rounded-xl bg-accent/50 p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Total</span>
            </div>
            <p className="text-lg font-semibold">
              {balance ? formatCurrency(balance.total, selectedCurrency) : '$0'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
