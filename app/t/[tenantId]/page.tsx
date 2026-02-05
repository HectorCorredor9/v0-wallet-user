import { redirect } from 'next/navigation'
import { authPath } from '@/lib/tenant-path'

export default async function TenantPage({ 
  params 
}: { 
  params: Promise<{ tenantId: string }> 
}) {
  const { tenantId } = await params
  redirect(authPath(tenantId, 'login'))
}
