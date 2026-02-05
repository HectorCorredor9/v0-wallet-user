import React from "react"
import { redirect, notFound } from 'next/navigation'
import { getTenantConfig } from '@/lib/tenants'
import { requireAuth } from '@/lib/auth'
import { authPath } from '@/lib/tenant-path'
import { AppShell } from '@/components/app-shell'

export default async function AppLayout({
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
  
  const authResult = await requireAuth(tenantId)
  
  if (!authResult) {
    redirect(authPath(tenantId, 'login'))
  }
  
  const { user } = authResult
  
  return <AppShell tenant={tenant} user={user}>{children}</AppShell>
}
