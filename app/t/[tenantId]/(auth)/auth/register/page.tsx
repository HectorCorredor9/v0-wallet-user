'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { RegisterStepVerify, type VerificationData } from '@/components/register-step-verify'
import { RegisterStepForm } from '@/components/register-step-form'
import { Toaster } from '@/components/ui/toaster'

export default function RegisterPage() {
  const params = useParams<{ tenantId: string }>()
  const tenantId = params.tenantId

  const [step, setStep] = useState<1 | 2>(1)
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null)

  function handleVerified(data: VerificationData) {
    setVerificationData(data)
    setStep(2)
  }

  function handleBack() {
    setStep(1)
  }

  return (
    <>
      {step === 1 && <RegisterStepVerify onVerified={handleVerified} />}
      {step === 2 && verificationData && (
        <RegisterStepForm
          verificationData={verificationData}
          onBack={handleBack}
          tenantId={tenantId}
        />
      )}
      <Toaster />
    </>
  )
}
