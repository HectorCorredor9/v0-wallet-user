'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { authPath } from '@/lib/tenant-path'
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const params = useParams<{ tenantId: string }>()
  const tenantId = params.tenantId
  
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitted(true)
    setIsLoading(false)
  }
  
  if (isSubmitted) {
    return (
      <Card className="border-border/50 shadow-xl rounded-2xl mx-auto max-w-md">
        <CardHeader className="space-y-1 pb-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Revisa tu correo</CardTitle>
          <CardDescription className="text-center">
            Hemos enviado un enlace de recuperación a <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
          </p>
          <Link href={authPath(tenantId, 'login')}>
            <Button variant="outline" className="w-full rounded-xl h-11 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio de sesión
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="border-border/50 shadow-xl rounded-2xl mx-auto max-w-md">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold text-center">Recuperar contraseña</CardTitle>
        <CardDescription className="text-center">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <Button
            type="submit"
            className="w-full h-11 rounded-xl font-medium text-white"
            style={{ backgroundColor: 'var(--brand-primary)' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar enlace'
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <Link
            href={authPath(tenantId, 'login')}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Volver al inicio de sesión
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
