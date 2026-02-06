'use client'

import React from "react"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { authPath, appPath } from '@/lib/tenant-path'
import { login } from '@/lib/api'
import { Loader2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams<{ tenantId: string }>()
  const tenantId = params.tenantId
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const redirectUrl = searchParams.get('redirect') || appPath(tenantId, 'dashboard')
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const result = await login(tenantId, email, password)
      
      if (result.success) {
        router.push(redirectUrl)
        router.refresh()
      } else {
        setError(result.error || 'Error al iniciar sesión')
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Card className="border-border/50 shadow-xl rounded-2xl mx-auto max-w-md">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold text-center">Iniciar sesión</CardTitle>
        <CardDescription className="text-center">
          Ingresa tus credenciales para acceder a tu cuenta
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
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl h-11"
              autoComplete="email"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link
                href={authPath(tenantId, 'forgot-password')}
                className="text-sm text-brand-primary hover:underline"
                style={{ color: 'var(--brand-primary)' }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="rounded-xl h-11"
              autoComplete="current-password"
            />
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
                Ingresando...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </Button>
        </form>
        
        <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
          <p>
            ¿No tienes cuenta?{' '}
            <Link
              href={authPath(tenantId, 'register')}
              className="font-medium text-foreground hover:underline"
              style={{ color: 'var(--brand-primary)' }}
            >
              Registrate aqui
            </Link>
          </p>
          <p className="text-xs">
            ¿Demo? Usa cualquier email y contrasena (min. 6 caracteres)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
