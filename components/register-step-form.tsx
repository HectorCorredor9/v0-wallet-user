'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RegistrationStepper } from '@/components/registration-stepper'
import type { VerificationData } from '@/components/register-step-verify'
import { Loader2, AlertCircle, CheckCircle2, CalendarIcon, ArrowLeft, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// Config flag — determines email field behavior
const config = {
  useEmailBp: false,
}

const registrationSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'El apellido paterno debe tener al menos 2 caracteres'),
  surName: z.string().min(2, 'El apellido materno debe tener al menos 2 caracteres'),
  idType: z.enum(['DNI', 'Pasaporte', 'Otro'], { required_error: 'Selecciona un tipo de documento' }),
  idNumber: z.string().min(6, 'El numero de documento debe tener al menos 6 digitos'),
  birthDate: z.date({ required_error: 'Selecciona tu fecha de nacimiento' }),
  gender: z.enum(['M', 'F'], { required_error: 'Selecciona tu genero' }),
  email: z.string().email('Ingresa un correo electronico valido'),
  landLine: z.string().optional(),
  mobilePhone: z
    .string()
    .min(7, 'El celular debe tener al menos 7 digitos')
    .regex(/^[0-9+\-\s()]+$/, 'Formato de telefono invalido'),
  phoneType: z.enum(['Casa', 'Trabajo', 'Otro']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  department: z.string().optional(),
  postalCode: z.string().optional(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar los terminos y condiciones' }),
  }),
  acceptPrivacy: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar la politica de privacidad' }),
  }),
})

type RegistrationFormValues = z.infer<typeof registrationSchema>

interface RegisterStepFormProps {
  verificationData: VerificationData
  onBack: () => void
  tenantId: string
}

export function RegisterStepForm({ verificationData, onBack, tenantId }: RegisterStepFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [idEditable, setIdEditable] = useState(false)

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      surName: '',
      idType: 'DNI',
      idNumber: verificationData.idNumber,
      birthDate: undefined,
      gender: undefined,
      email: '',
      landLine: '',
      mobilePhone: '',
      phoneType: undefined,
      address: '',
      city: '',
      department: '',
      postalCode: '',
      acceptTerms: undefined as unknown as true,
      acceptPrivacy: undefined as unknown as true,
    },
  })

  async function onSubmit(data: RegistrationFormValues) {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSubmitSuccess(true)
      toast({
        title: 'Registro exitoso',
        description: 'Tu cuenta ha sido creada correctamente.',
      })
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo completar el registro. Intenta de nuevo.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="space-y-6">
        <RegistrationStepper
          currentStep={2}
          totalSteps={2}
          labels={['Verificacion', 'Registro']}
        />
        <Card className="border-border/50 shadow-xl rounded-2xl">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              <CheckCircle2 className="h-8 w-8 text-brand-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Registro completado</h2>
            <p className="text-center text-muted-foreground max-w-sm">
              Tu cuenta ha sido creada exitosamente. Ya puedes iniciar sesion con tus credenciales.
            </p>
            <Button
              className="mt-4 rounded-xl text-brand-primary-foreground"
              style={{ backgroundColor: 'var(--brand-primary)' }}
              onClick={() => {
                window.location.href = `/t/${tenantId}/auth/login`
              }}
            >
              Ir a iniciar sesion
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const emailFieldName = config.useEmailBp ? 'emailBp' : 'email'
  const emailFieldLabel = config.useEmailBp ? 'Email BP' : 'Correo electronico'

  return (
    <div className="space-y-6">
      <RegistrationStepper
        currentStep={2}
        totalSteps={2}
        labels={['Verificacion', 'Registro']}
      />

      <Card className="border-border/50 shadow-xl rounded-2xl">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Volver al paso anterior"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <CardTitle className="text-2xl font-bold">Formulario de registro</CardTitle>
              <CardDescription>
                Completa tus datos personales para crear tu cuenta
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Section: Personal Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  Informacion personal
                </h3>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nombre <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Juan"
                            className="rounded-xl h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Segundo nombre</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Carlos"
                            className="rounded-xl h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Apellido paterno <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Garcia"
                            className="rounded-xl h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="surName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Apellido materno <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Lopez"
                            className="rounded-xl h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section: Identification */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  Identificacion
                </h3>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="idType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Tipo de documento <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl h-11 w-full">
                              <SelectValue placeholder="Selecciona..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DNI">DNI</SelectItem>
                            <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="idNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Numero de documento <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="12345678"
                              className={cn(
                                'rounded-xl h-11',
                                !idEditable && 'bg-muted text-muted-foreground'
                              )}
                              readOnly={!idEditable}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        {!idEditable ? (
                          <FormDescription className="flex items-center gap-1">
                            Pre-llenado del paso anterior.{' '}
                            <button
                              type="button"
                              onClick={() => setIdEditable(true)}
                              className="underline text-foreground hover:text-brand-primary transition-colors"
                            >
                              Editar
                            </button>
                          </FormDescription>
                        ) : (
                          <div className="flex items-start gap-1.5 text-xs text-warning">
                            <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            <span>Si editas este campo, debera coincidir con tu documento.</span>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Fecha de nacimiento <span className="text-destructive">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full rounded-xl h-11 justify-start text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value
                                  ? format(field.value, 'PPP', { locale: es })
                                  : 'Selecciona una fecha'}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date('1920-01-01')
                              }
                              captionLayout="dropdown"
                              fromYear={1920}
                              toYear={new Date().getFullYear()}
                              defaultMonth={field.value || new Date(1990, 0)}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Genero <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-6 pt-2"
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="M" id="gender-m" />
                              <Label htmlFor="gender-m" className="font-normal cursor-pointer">
                                Masculino
                              </Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="F" id="gender-f" />
                              <Label htmlFor="gender-f" className="font-normal cursor-pointer">
                                Femenino
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section: Contact */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  Contacto
                </h3>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>
                          {emailFieldLabel} <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="tu@email.com"
                            className="rounded-xl h-11"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobilePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Celular <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+57 300 123 4567"
                            className="rounded-xl h-11"
                            autoComplete="tel"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="landLine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefono fijo</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="(01) 234 5678"
                            className="rounded-xl h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de telefono adicional</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl h-11 w-full">
                              <SelectValue placeholder="Selecciona..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Casa">Casa</SelectItem>
                            <SelectItem value="Trabajo">Trabajo</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section: Address (optional) */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  Direccion
                </h3>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Direccion</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Calle, numero, colonia"
                            className="rounded-xl h-11"
                            autoComplete="street-address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Bogota"
                            className="rounded-xl h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departamento / Estado</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Cundinamarca"
                            className="rounded-xl h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Codigo postal</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="110111"
                            className="rounded-xl h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section: Terms & Conditions */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  Terminos y condiciones
                </h3>
                <Separator />

                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-3">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 rounded border-input accent-brand-primary"
                          checked={field.value === true}
                          onChange={(e) => field.onChange(e.target.checked ? true : undefined)}
                          style={{ accentColor: 'var(--brand-primary)' }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal text-sm cursor-pointer">
                          Acepto los{' '}
                          <a href="#" className="underline hover:text-brand-primary transition-colors">
                            terminos y condiciones
                          </a>{' '}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acceptPrivacy"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-3">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 rounded border-input accent-brand-primary"
                          checked={field.value === true}
                          onChange={(e) => field.onChange(e.target.checked ? true : undefined)}
                          style={{ accentColor: 'var(--brand-primary)' }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal text-sm cursor-pointer">
                          Acepto la{' '}
                          <a href="#" className="underline hover:text-brand-primary transition-colors">
                            politica de privacidad
                          </a>{' '}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl h-11"
                  onClick={onBack}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl h-11 font-medium text-brand-primary-foreground"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    'Crear cuenta'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
