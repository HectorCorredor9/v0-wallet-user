'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface StepperProps {
  currentStep: number
  totalSteps: number
  labels: string[]
}

export function RegistrationStepper({ currentStep, totalSteps, labels }: StepperProps) {
  return (
    <nav aria-label="Progreso del registro" className="w-full">
      <ol className="flex items-center gap-0">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1
          const isCompleted = step < currentStep
          const isCurrent = step === currentStep

          return (
            <li
              key={step}
              className={cn('flex items-center', step < totalSteps && 'flex-1')}
            >
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                    isCompleted &&
                      'border-transparent bg-brand-primary text-brand-primary-foreground',
                    isCurrent &&
                      'border-brand-primary bg-brand-primary/10 text-brand-primary',
                    !isCompleted &&
                      !isCurrent &&
                      'border-muted-foreground/30 bg-muted text-muted-foreground'
                  )}
                  style={
                    isCompleted
                      ? { backgroundColor: 'var(--brand-primary)', color: 'var(--brand-primary-foreground)' }
                      : isCurrent
                        ? { borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }
                        : undefined
                  }
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium whitespace-nowrap',
                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {labels[i]}
                </span>
              </div>

              {step < totalSteps && (
                <div
                  className={cn(
                    'mx-2 h-0.5 flex-1 rounded-full transition-colors',
                    isCompleted ? 'bg-brand-primary' : 'bg-muted'
                  )}
                  style={isCompleted ? { backgroundColor: 'var(--brand-primary)' } : undefined}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
      <p className="sr-only">
        Paso {currentStep} de {totalSteps}: {labels[currentStep - 1]}
      </p>
    </nav>
  )
}
