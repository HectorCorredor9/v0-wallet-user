'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { Transaction, TenantConfig } from '@/lib/types'
import { formatCurrency, formatRelativeTime, getTransactionTypeLabel, getTransactionStatusLabel } from '@/lib/format'
import { appPath } from '@/lib/tenant-path'
import { cn } from '@/lib/utils'
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  CreditCard, 
  RotateCcw, 
  Banknote,
  ArrowRight,
  Clock
} from 'lucide-react'

interface RecentTransactionsProps {
  transactions: Transaction[]
  tenant: TenantConfig
  isLoading?: boolean
}

const typeIcons = {
  transfer_in: ArrowDownLeft,
  transfer_out: ArrowUpRight,
  topup: Plus,
  payment: CreditCard,
  refund: RotateCcw,
  withdrawal: Banknote,
}

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  completed: 'default',
  pending: 'secondary',
  failed: 'destructive',
  cancelled: 'outline',
}

export function RecentTransactions({ transactions, tenant, isLoading }: RecentTransactionsProps) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl border-border/50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">Últimas transacciones</CardTitle>
          <Skeleton className="h-8 w-20" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }
  
  if (transactions.length === 0) {
    return (
      <Card className="rounded-2xl border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-base font-medium">Últimas transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              No tienes transacciones aún
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="rounded-2xl border-border/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Últimas transacciones</CardTitle>
        <Link href={appPath(tenant.id, 'transactions')}>
          <Button variant="ghost" size="sm" className="text-xs">
            Ver todas
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-1">
        {transactions.slice(0, 5).map((transaction) => {
          const Icon = typeIcons[transaction.type]
          const isIncoming = ['transfer_in', 'topup', 'refund'].includes(transaction.type)
          
          return (
            <Link
              key={transaction.id}
              href={`${appPath(tenant.id, 'transactions')}?highlight=${transaction.id}`}
              className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-accent/50 transition-colors group"
            >
              <div 
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  isIncoming ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-foreground">
                  {transaction.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{getTransactionTypeLabel(transaction.type)}</span>
                  <span>·</span>
                  <span>{formatRelativeTime(transaction.createdAt)}</span>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  'text-sm font-semibold',
                  isIncoming ? 'text-success' : 'text-foreground'
                )}>
                  {isIncoming ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
                </p>
                <Badge 
                  variant={statusVariants[transaction.status]}
                  className="text-[10px] px-1.5 py-0"
                >
                  {getTransactionStatusLabel(transaction.status)}
                </Badge>
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
