import React from "react"
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTenantConfig } from '@/lib/tenants'
import { requireAuth } from '@/lib/auth'
import { getMockCard, getMockCardTransactions } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/format'
import { appPath } from '@/lib/tenant-path'
import { CardDetailHeader } from '@/components/card-detail-header'
import { RecentTransactions } from '@/components/recent-transactions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Wallet, DollarSign, Calendar } from 'lucide-react'

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ tenantId: string; id: string }> 
}) {
  const { tenantId, id } = await params
  const tenant = getTenantConfig(tenantId)
  const card = getMockCard(tenantId, id)
  return {
    title: tenant && card 
      ? `Tarjeta ****${card.last4} - ${tenant.name}` 
      : 'Detalle de tarjeta',
    description: 'Información detallada de tu tarjeta',
  }
}

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ tenantId: string; id: string }>
}) {
  const { tenantId, id } = await params
  const tenant = getTenantConfig(tenantId)
  
  if (!tenant) {
    notFound()
  }
  
  const authResult = await requireAuth(tenantId)
  
  if (!authResult) {
    notFound()
  }
  
  const { user } = authResult
  const card = getMockCard(tenantId, id, user.id)
  
  if (!card) {
    notFound()
  }
  
  const cardTransactions = getMockCardTransactions(tenantId, id, user.id, 5)
  
  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href={appPath(tenantId, 'cards')}>
        <Button variant="ghost" className="rounded-xl gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a tarjetas
        </Button>
      </Link>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card hero */}
          <CardDetailHeader card={card} tenant={tenant} />
          
          {/* Limits */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Límites</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <LimitItem
                  label="Por transacción"
                  value={formatCurrency(card.limits.perTransaction, 'COP')}
                  icon={DollarSign}
                />
                <LimitItem
                  label="Diario"
                  value={formatCurrency(card.limits.daily, 'COP')}
                  icon={Calendar}
                />
                <LimitItem
                  label="Mensual"
                  value={formatCurrency(card.limits.monthly, 'COP')}
                  icon={Calendar}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Linked account */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Cuenta vinculada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/50">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: tenant.colors.primary }}
                >
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">Billetera Principal</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {card.linkedAccountId}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column */}
        <div className="lg:col-span-1">
          <RecentTransactions 
            transactions={cardTransactions} 
            tenant={tenant} 
          />
        </div>
      </div>
    </div>
  )
}

function LimitItem({ 
  label, 
  value, 
  icon: Icon 
}: { 
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/50">
      <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  )
}
