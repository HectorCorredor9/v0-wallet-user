import { notFound } from 'next/navigation'
import { getTenantConfig } from '@/lib/tenants'
import { requireAuth } from '@/lib/auth'
import { getMockWallet, getMockTransactions } from '@/lib/mock-data'
import { DashboardHero } from '@/components/dashboard-hero'
import { BalanceMultiCurrency } from '@/components/balance-multi-currency'
import { QuickActions } from '@/components/quick-actions'
import { RecentTransactions } from '@/components/recent-transactions'

export async function generateMetadata({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params
  const tenant = getTenantConfig(tenantId)
  return {
    title: tenant ? `Dashboard - ${tenant.name}` : 'Dashboard',
    description: 'Tu billetera digital',
  }
}

export default async function DashboardPage({
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
  const wallet = getMockWallet(tenantId, user.id)
  const transactions = getMockTransactions(tenantId, user.id, 50)
  
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <DashboardHero tenant={tenant} user={user} />
      
      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Balance & Actions */}
        <div className="lg:col-span-2 space-y-6">
          <BalanceMultiCurrency wallet={wallet} tenant={tenant} />
          <QuickActions tenant={tenant} />
        </div>
        
        {/* Right Column - Recent Transactions */}
        <div className="lg:col-span-1">
          <RecentTransactions transactions={transactions} tenant={tenant} />
        </div>
      </div>
    </div>
  )
}
