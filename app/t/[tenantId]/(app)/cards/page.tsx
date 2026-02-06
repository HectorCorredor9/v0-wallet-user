import { notFound } from 'next/navigation'
import { getTenantConfig } from '@/lib/tenants'
import { requireAuth } from '@/lib/auth'
import { getMockCards, getMockTransactions } from '@/lib/mock-data'
import { CardsDashboard } from '@/components/cards-dashboard'

export async function generateMetadata({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params
  const tenant = getTenantConfig(tenantId)
  return {
    title: tenant ? `Mis Tarjetas - ${tenant.name}` : 'Mis Tarjetas',
    description: 'Gestiona y consulta tus tarjetas virtuales y fisicas',
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
  const transactions = getMockTransactions(tenantId, user.id, 50)

  return <CardsDashboard cards={cards} tenant={tenant} transactions={transactions} />
}
