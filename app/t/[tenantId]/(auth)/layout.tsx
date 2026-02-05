import React from "react"
import { notFound } from 'next/navigation'
import { getTenantConfig } from '@/lib/tenants'
import { AuthShell } from '@/components/auth-shell'

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tenantId: string }>
}) {
  const { tenantId } = await params
  const tenant = getTenantConfig(tenantId)
  
  if (!tenant) {
    notFound()
  }
  
  return <AuthShell tenant={tenant}>{children}</AuthShell>
}
