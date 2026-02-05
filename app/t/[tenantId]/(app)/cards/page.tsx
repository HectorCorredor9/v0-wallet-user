import { notFound } from 'next/navigation'
import { getTenantConfig } from '@/lib/tenants'
import { requireAuth } from '@/lib/auth'
import { getMockCards } from '@/lib/mock-data'
import { CardItem } from '@/components/card-item'
import { Card, CardContent } from '@/components/ui/card'
import { CreditCard, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export async function generateMetadata({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params
  const tenant = getTenantConfig(tenantId)
  return {
    title: tenant ? `Tarjetas - ${tenant.name}` : 'Tarjetas',
    description: 'Gestiona tus tarjetas virtuales y físicas',
  }
}

export default async function CardsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>
}) {
  const { tenantId } = await params
  const tenant = getTenantConfig(tenantId)
  
  if (!tenant) {
    notFound()
  }
  
  const authResult = await requireAuth(tenantId)
  
  if (!authResult) {
    notFound()
  }
  
  const { user } = authResult
  const cards = getMockCards(tenantId, user.id)
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tarjetas</h1>
          <p className="text-muted-foreground">
            Administra tus tarjetas virtuales y físicas
          </p>
        </div>
        <Button 
          className="rounded-xl text-white gap-2"
          style={{ backgroundColor: tenant.colors.primary }}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nueva tarjeta</span>
        </Button>
      </div>
      
      {cards.length === 0 ? (
        <Card className="rounded-2xl border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-medium">No tienes tarjetas</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Solicita tu primera tarjeta para empezar a usar tu billetera
            </p>
            <Button 
              className="rounded-xl text-white gap-2"
              style={{ backgroundColor: tenant.colors.primary }}
            >
              <Plus className="h-4 w-4" />
              Solicitar tarjeta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <CardItem key={card.id} card={card} tenant={tenant} />
          ))}
        </div>
      )}
    </div>
  )
}
