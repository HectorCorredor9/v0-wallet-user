'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RegistrationStepper } from '@/components/registration-stepper'
import { Loader2, AlertCircle, ShieldCheck, HelpCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export interface VerificationData {
  idNumber: string
  cardNumber: string
  pin: string
}

interface RegisterStepVerifyProps {
  onVerified: (data: VerificationData) => void
}

export function RegisterStepVerify({ onVerified }: RegisterStepVerifyProps) {
  const { toast } = useToast()
  const [idNumber, setIdNumber] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function formatCardNumber(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  function handleCardNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber(formatted)
  }

  function handleIdNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '')
    setIdNumber(digits)
  }

  function handlePinChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 6)
    setPin(digits)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const rawCard = cardNumber.replace(/\s/g, '')

    if (idNumber.length < 6) {
      setError('El numero de documento debe tener al menos 6 digitos.')
      return
    }
    if (rawCard.length !== 16) {
      setError('El numero de tarjeta debe tener 16 digitos.')
      return
    }
    if (pin.length < 4 || pin.length > 6) {
      setError('El PIN debe tener entre 4 y 6 digitos.')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API verification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate a random success/failure for demo
      const success = Math.random() > 0.2 // 80% success rate

      if (success) {
        onVerified({ idNumber, cardNumber: rawCard, pin })
      } else {
        const errorMessage = 'No se pudo verificar tu identidad. Revisa los datos e intenta de nuevo.'
        setError(errorMessage)
        toast({
          variant: 'destructive',
          title: 'Error de verificacion',
          description: errorMessage,
        })
      }
    } catch {
      const errorMessage = 'Error de conexion. Intenta de nuevo.'
      setError(errorMessage)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <RegistrationStepper
        currentStep={1}
        totalSteps={2}
        labels={['Verificacion', 'Registro']}
      />

      <Card className="border-border/50 shadow-xl rounded-2xl">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold text-center">
            Verificacion de identidad
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tus datos para verificar tu identidad antes de registrarte
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
              <Label htmlFor="idNumber">Numero de documento (DNI)</Label>
              <Input
                id="idNumber"
                type="text"
                inputMode="numeric"
                placeholder="Ej. 12345678"
                value={idNumber}
                onChange={handleIdNumberChange}
                required
                minLength={6}
                className="rounded-xl h-11"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Numero de tarjeta</Label>
              <Input
                id="cardNumber"
                type="text"
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={handleCardNumberChange}
                required
                className="rounded-xl h-11 font-mono tracking-wider"
                autoComplete="cc-number"
                maxLength={19}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin">PIN</Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                placeholder="****"
                value={pin}
                onChange={handlePinChange}
                required
                minLength={4}
                maxLength={6}
                className="rounded-xl h-11 font-mono tracking-widest"
                autoComplete="off"
              />
            </div>

            <div className="flex items-start gap-2 rounded-xl bg-muted/50 p-3">
              <ShieldCheck className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tus datos estan protegidos con cifrado de extremo a extremo. 
                Esta informacion solo se usa para verificar tu identidad y no se almacena.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-medium text-brand-primary-foreground"
              style={{ backgroundColor: 'var(--brand-primary)' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Verificar'
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Necesitas ayuda?
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
