'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Transaction, TransactionFilters, TenantConfig } from '@/lib/types'
import { 
  formatCurrency, 
  formatDate, 
  getTransactionTypeLabel, 
  getTransactionStatusLabel 
} from '@/lib/format'
import { cn } from '@/lib/utils'
import { TransactionFiltersComponent } from './transaction-filters'
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  MoreHorizontal,
  Copy,
  ExternalLink,
  FileText,
  ChevronLeft,
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  CreditCard,
  RotateCcw,
  Banknote,
  Inbox
} from 'lucide-react'

interface TransactionsTableProps {
  initialTransactions: Transaction[]
  tenant: TenantConfig
}

type SortField = 'createdAt' | 'amount'
type SortOrder = 'asc' | 'desc'

const PAGE_SIZE = 10

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

export function TransactionsTable({ initialTransactions, tenant }: TransactionsTableProps) {
  const searchParams = useSearchParams()
  const highlightId = searchParams.get('highlight')
  
  const [filters, setFilters] = useState<TransactionFilters>({ currency: 'COP' })
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let result = [...initialTransactions]
    
    // Apply filters
    if (filters.currency) {
      result = result.filter(t => t.currency === filters.currency)
    }
    if (filters.type) {
      result = result.filter(t => t.type === filters.type)
    }
    if (filters.status) {
      result = result.filter(t => t.status === filters.status)
    }
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom)
      result = result.filter(t => new Date(t.createdAt) >= from)
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo)
      result = result.filter(t => new Date(t.createdAt) <= to)
    }
    if (filters.amountMin !== undefined) {
      result = result.filter(t => t.amount >= filters.amountMin!)
    }
    if (filters.amountMax !== undefined) {
      result = result.filter(t => t.amount <= filters.amountMax!)
    }
    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(t => 
        t.description.toLowerCase().includes(search) ||
        t.reference.toLowerCase().includes(search)
      )
    }
    
    // Sort
    result.sort((a, b) => {
      let comparison = 0
      if (sortField === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
    
    return result
  }, [initialTransactions, filters, sortField, sortOrder])
  
  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE)
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )
  
  // Scroll to highlighted transaction
  useEffect(() => {
    if (highlightId) {
      const element = document.getElementById(`txn-${highlightId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.classList.add('bg-accent')
        setTimeout(() => element.classList.remove('bg-accent'), 2000)
      }
    }
  }, [highlightId])
  
  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }
  
  function handleFiltersChange(newFilters: TransactionFilters) {
    setFilters(newFilters)
    setPage(1)
  }
  
  function handleResetFilters() {
    setFilters({ currency: 'COP' })
    setPage(1)
  }
  
  function getSortIcon(field: SortField) {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }
  
  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text)
  }
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <TransactionFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />
      
      {paginatedTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-border/50 rounded-2xl bg-card">
          <Inbox className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium">No hay transacciones</h3>
          <p className="text-sm text-muted-foreground mt-1">
            No se encontraron transacciones con los filtros aplicados
          </p>
          <Button variant="outline" onClick={handleResetFilters} className="mt-4 rounded-xl bg-transparent">
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <>
          <div className="border border-border/50 rounded-2xl overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[140px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('createdAt')}
                      className="-ml-3 h-8"
                    >
                      Fecha
                      {getSortIcon('createdAt')}
                    </Button>
                  </TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('amount')}
                      className="-ml-3 h-8"
                    >
                      Monto
                      {getSortIcon('amount')}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Descripción</TableHead>
                  <TableHead className="hidden lg:table-cell">Canal</TableHead>
                  <TableHead className="hidden lg:table-cell">Referencia</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.map((transaction) => {
                  const Icon = typeIcons[transaction.type]
                  const isIncoming = ['transfer_in', 'topup', 'refund'].includes(transaction.type)
                  
                  return (
                    <TableRow 
                      key={transaction.id}
                      id={`txn-${transaction.id}`}
                      className="group cursor-pointer transition-colors"
                      tabIndex={0}
                    >
                      <TableCell className="font-medium">
                        {formatDate(transaction.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className={cn(
                              'w-8 h-8 rounded-lg flex items-center justify-center',
                              isIncoming ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="hidden sm:inline text-sm">
                            {getTransactionTypeLabel(transaction.type)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[transaction.status]}>
                          {getTransactionStatusLabel(transaction.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          'font-semibold',
                          isIncoming ? 'text-success' : ''
                        )}>
                          {isIncoming ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                        {transaction.description}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell capitalize">
                        {transaction.channel}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell font-mono text-xs">
                        {transaction.reference}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Acciones</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem onClick={() => copyToClipboard(transaction.reference)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copiar referencia
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Descargar comprobante
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-2">
            <p className="text-sm text-muted-foreground">
              Mostrando {((page - 1) * PAGE_SIZE) + 1} - {Math.min(page * PAGE_SIZE, filteredTransactions.length)} de {filteredTransactions.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg bg-transparent"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg bg-transparent"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
