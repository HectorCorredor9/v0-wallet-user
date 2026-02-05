'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import type { TransactionFilters as Filters, Currency, TransactionType, TransactionStatus } from '@/lib/types'
import { CURRENCIES } from '@/lib/types'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface TransactionFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onReset: () => void
}

const transactionTypes: { value: TransactionType; label: string }[] = [
  { value: 'transfer_in', label: 'Transferencia recibida' },
  { value: 'transfer_out', label: 'Transferencia enviada' },
  { value: 'topup', label: 'Recarga' },
  { value: 'payment', label: 'Pago' },
  { value: 'refund', label: 'Reembolso' },
  { value: 'withdrawal', label: 'Retiro' },
]

const transactionStatuses: { value: TransactionStatus; label: string }[] = [
  { value: 'completed', label: 'Completado' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'failed', label: 'Fallido' },
  { value: 'cancelled', label: 'Cancelado' },
]

export function TransactionFiltersComponent({ filters, onFiltersChange, onReset }: TransactionFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<Filters>(filters)
  
  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== '').length
  
  function handleSearchChange(search: string) {
    onFiltersChange({ ...filters, search: search || undefined })
  }
  
  function handleCurrencyChange(currency: string) {
    onFiltersChange({ ...filters, currency: currency === 'all' ? undefined : currency as Currency })
  }
  
  function handleApplyFilters() {
    onFiltersChange(localFilters)
    setIsOpen(false)
  }
  
  function handleResetFilters() {
    setLocalFilters({})
    onReset()
    setIsOpen(false)
  }
  
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por descripción o referencia..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 rounded-xl h-10"
        />
      </div>
      
      {/* Currency quick filter */}
      <Select value={filters.currency || 'all'} onValueChange={handleCurrencyChange}>
        <SelectTrigger className="w-full sm:w-32 rounded-xl h-10">
          <SelectValue placeholder="Moneda" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {Object.entries(CURRENCIES).map(([code, info]) => (
            <SelectItem key={code} value={code}>
              {info.symbol} {code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Advanced filters */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="rounded-xl h-10 gap-2 bg-transparent">
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {activeFilterCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Filtros avanzados</SheetTitle>
            <SheetDescription>
              Filtra las transacciones por diferentes criterios
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 py-6">
            {/* Type */}
            <div className="space-y-2">
              <Label>Tipo de transacción</Label>
              <Select 
                value={localFilters.type || 'all'} 
                onValueChange={(v) => setLocalFilters({ ...localFilters, type: v === 'all' ? undefined : v as TransactionType })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {transactionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Status */}
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select 
                value={localFilters.status || 'all'} 
                onValueChange={(v) => setLocalFilters({ ...localFilters, status: v === 'all' ? undefined : v as TransactionStatus })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {transactionStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Date range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Desde</Label>
                <Input
                  type="date"
                  value={localFilters.dateFrom || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, dateFrom: e.target.value || undefined })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Hasta</Label>
                <Input
                  type="date"
                  value={localFilters.dateTo || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, dateTo: e.target.value || undefined })}
                  className="rounded-xl"
                />
              </div>
            </div>
            
            {/* Amount range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Monto mínimo</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={localFilters.amountMin || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, amountMin: e.target.value ? Number(e.target.value) : undefined })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Monto máximo</Label>
                <Input
                  type="number"
                  placeholder="Sin límite"
                  value={localFilters.amountMax || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, amountMax: e.target.value ? Number(e.target.value) : undefined })}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
          
          <SheetFooter className="gap-2">
            <Button variant="outline" onClick={handleResetFilters} className="flex-1 rounded-xl bg-transparent">
              <X className="mr-2 h-4 w-4" />
              Limpiar
            </Button>
            <Button onClick={handleApplyFilters} className="flex-1 rounded-xl">
              Aplicar filtros
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
