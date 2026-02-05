'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TenantConfig, Currency } from '@/lib/types'
import { CURRENCIES } from '@/lib/types'
import { Send, Plus, Loader2, CheckCircle2 } from 'lucide-react'

interface QuickActionsProps {
  tenant: TenantConfig
}

export function QuickActions({ tenant }: QuickActionsProps) {
  return (
    <div className="flex gap-3">
      <TransferDialog tenant={tenant} />
      <TopupDialog tenant={tenant} />
    </div>
  )
}

function TransferDialog({ tenant }: { tenant: TenantConfig }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [currency, setCurrency] = useState<Currency>('COP')
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSuccess(true)
    setTimeout(() => {
      setOpen(false)
      setIsSuccess(false)
      setAmount('')
      setRecipient('')
    }, 2000)
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="flex-1 h-12 rounded-xl text-white gap-2"
          style={{ backgroundColor: tenant.colors.primary }}
        >
          <Send className="h-4 w-4" />
          Transferir
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold">Transferencia exitosa</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Tu transferencia ha sido procesada correctamente
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Nueva transferencia</DialogTitle>
              <DialogDescription>
                Envía dinero a otra billetera o cuenta bancaria
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Destinatario</Label>
                <Input
                  id="recipient"
                  placeholder="Email o número de billetera"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  required
                  className="rounded-xl h-11"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="amount">Monto</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda</Label>
                  <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CURRENCIES).map(([code, info]) => (
                        <SelectItem key={code} value={code}>
                          {info.symbol} {code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl text-white"
                  style={{ backgroundColor: tenant.colors.primary }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Enviar transferencia'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function TopupDialog({ tenant }: { tenant: TenantConfig }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<Currency>('COP')
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSuccess(true)
    setTimeout(() => {
      setOpen(false)
      setIsSuccess(false)
      setAmount('')
    }, 2000)
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 h-12 rounded-xl gap-2 bg-transparent">
          <Plus className="h-4 w-4" />
          Recargar
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold">Recarga exitosa</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Tu recarga ha sido procesada correctamente
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Recargar billetera</DialogTitle>
              <DialogDescription>
                Añade fondos a tu billetera desde tu cuenta bancaria
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="topup-amount">Monto</Label>
                  <Input
                    id="topup-amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topup-currency">Moneda</Label>
                  <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CURRENCIES).map(([code, info]) => (
                        <SelectItem key={code} value={code}>
                          {info.symbol} {code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="rounded-xl bg-accent/50 p-3">
                <p className="text-xs text-muted-foreground">
                  La recarga se procesará desde tu cuenta bancaria vinculada. El monto estará disponible en unos minutos.
                </p>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl text-white"
                  style={{ backgroundColor: tenant.colors.primary }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Confirmar recarga'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
