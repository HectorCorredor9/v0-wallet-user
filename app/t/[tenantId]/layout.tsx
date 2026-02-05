import React from "react"
import { notFound } from 'next/navigation'
import { getTenantConfig } from '@/lib/tenants'

export async function generateMetadata({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params
  const tenant = getTenantConfig(tenantId)
  
  if (!tenant) {
    return { title: 'No encontrado' }
  }
  
  return {
    title: {
      default: tenant.name,
      template: `%s | ${tenant.name}`,
    },
    description: `Billetera digital de ${tenant.name}`,
  }
}

export default async function TenantLayout({
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
  
  return children
}
