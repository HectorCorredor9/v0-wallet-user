'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { authPath } from '@/lib/tenant-path'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useParams<{ tenantId: string }>()
  const tenantId = params.tenantId
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSuccess(true)
    setIsLoading(false)
    
    // Redirect after a short delay
    setTimeout(() => {
      router.push(authPath(tenantId, 'login'))
    }, 3000)
  }
  
  if (isSuccess) {
    return (
      <Card className="border-border/50 shadow-xl rounded-2xl">
        <CardHeader className="space-y-1 pb-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Contraseña actualizada</CardTitle>
          <CardDescription className="text-center">
            Tu contraseña ha sido restablecida exitosamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Serás redirigido al inicio de sesión en unos segundos...
          </p>
          <Link href={authPath(tenantId, 'login')}>
            <Button
              className="w-full h-11 rounded-xl font-medium text-white"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              Ir al inicio de sesión
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="border-border/50 shadow-xl rounded-2xl">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold text-center">Nueva contraseña</CardTitle>
        <CardDescription className="text-center">
          Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="password">Nueva contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="rounded-xl h-11"
              autoComplete="new-password"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar contraseña</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="rounded-xl h-11"
              autoComplete="new-password"
            />
          </div>
          
          <div className="text-xs text-muted-foreground">
            La contraseña debe tener al menos 8 caracteres
          </div>
          
          <Button
            type="submit"
            className="w-full h-11 rounded-xl font-medium text-white"
            style={{ backgroundColor: 'var(--brand-primary)' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Restablecer contraseña'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
