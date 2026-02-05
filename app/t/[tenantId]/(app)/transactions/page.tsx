import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getTenantConfig } from '@/lib/tenants'
import { requireAuth } from '@/lib/auth'
import { getMockTransactions } from '@/lib/mock-data'
import { TransactionsTable } from '@/components/transactions-table'
import { Skeleton } from '@/components/ui/skeleton'

export async function generateMetadata({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params
  const tenant = getTenantConfig(tenantId)
  return {
    title: tenant ? `Transacciones - ${tenant.name}` : 'Transacciones',
    description: 'Historial de transacciones de tu billetera',
  }
}

export default async function TransactionsPage({
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
  const transactions = getMockTransactions(tenantId, user.id, 100)
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transacciones</h1>
        <p className="text-muted-foreground">
          Historial completo de movimientos de tu billetera
        </p>
      </div>
      
      <Suspense fallback={<TransactionsTableSkeleton />}>
        <TransactionsTable initialTransactions={transactions} tenant={tenant} />
      </Suspense>
    </div>
  )
}

function TransactionsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="border border-border/50 rounded-2xl overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-border/50 last:border-0">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-5 w-24 flex-1" />
            <Skeleton className="h-5 w-32 hidden md:block" />
          </div>
        ))}
      </div>
    </div>
  )
}
