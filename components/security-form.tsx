'use client'

import React from "react"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { TenantConfig } from '@/lib/types'
import { changePassword } from '@/lib/api'
import { Loader2, CheckCircle2, AlertCircle, Shield } from 'lucide-react'

interface SecurityFormProps {
  tenant: TenantConfig
}

export function SecurityForm({ tenant }: SecurityFormProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    
    if (newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres')
      return
    }
    
    setIsLoading(true)
    
    try {
      const result = await changePassword(tenant.id, currentPassword, newPassword)
      
      if (result.success) {
        setSuccess(true)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => setSuccess(false), 5000)
      } else {
        setError(result.error || 'Error al cambiar la contraseña')
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
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: tenant.colors.primary }}
          >
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle>Cambiar contraseña</CardTitle>
            <CardDescription>
              Actualiza tu contraseña regularmente para mayor seguridad
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="rounded-xl border-success/20 bg-success/10 text-success">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Contraseña actualizada correctamente</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="current-password">Contraseña actual</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="rounded-xl h-11"
              autoComplete="current-password"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva contraseña</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="rounded-xl h-11"
              autoComplete="new-password"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="rounded-xl h-11"
              autoComplete="new-password"
            />
          </div>
          
          <div className="text-xs text-muted-foreground bg-accent/50 rounded-xl p-3">
            <p className="font-medium mb-1">Requisitos de contraseña:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Mínimo 8 caracteres</li>
              <li>Se recomienda combinar letras, números y símbolos</li>
            </ul>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              className="rounded-xl text-white"
              style={{ backgroundColor: tenant.colors.primary }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Actualizar contraseña'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
