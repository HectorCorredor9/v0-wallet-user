'use client'

import React from "react"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { User, TenantConfig } from '@/lib/types'
import { updateProfile } from '@/lib/api'
import { Loader2, CheckCircle2, AlertCircle, User as UserIcon } from 'lucide-react'

interface ProfileFormProps {
  user: User
  tenant: TenantConfig
}

export function ProfileForm({ user, tenant }: ProfileFormProps) {
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone || '')
  const [address, setAddress] = useState(user.address || '')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)
    
    try {
      const result = await updateProfile(tenant.id, { name, phone, address })
      
      if (result.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(result.error || 'Error al actualizar el perfil')
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Card className="rounded-2xl border-border/50">
      <CardHeader>
        <CardTitle>Información personal</CardTitle>
        <CardDescription>
          Actualiza tu información de contacto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback 
                className="text-2xl font-bold text-white"
                style={{ backgroundColor: tenant.colors.primary }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                Wallet ID: {user.walletId}
              </p>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="rounded-xl border-success/20 bg-success/10 text-success">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Perfil actualizado correctamente</AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-xl h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+57 300 123 4567"
                className="rounded-xl h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="rounded-xl h-11 bg-muted"
              />
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle, número, ciudad"
                className="rounded-xl h-11"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              className="rounded-xl text-white"
              style={{ backgroundColor: tenant.colors.primary }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar cambios'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
