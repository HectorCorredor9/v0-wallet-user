import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTenantConfig } from '@/lib/tenants'
import { requireAuth } from '@/lib/auth'
import { appPath } from '@/lib/tenant-path'
import { SecurityForm } from '@/components/security-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params
  const tenant = getTenantConfig(tenantId)
  return {
    title: tenant ? `Seguridad - ${tenant.name}` : 'Seguridad',
    description: 'Configuración de seguridad de tu cuenta',
  }
}

export default async function SecurityPage({
  params,
}: {
  params: Promise<{ tenantId: string }>
}) {
  const { tenantId } = await params
  const tenant = getTenantConfig(tenantId)
  
  if (!tenant) {
    notFound()
  }
  
  const authResult = await requireAuth(tenantId)
  
  if (!authResult) {
    notFound()
  }
  
  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href={appPath(tenantId, 'profile')}>
        <Button variant="ghost" className="rounded-xl gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a perfil
        </Button>
      </Link>
      
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Seguridad</h1>
        <p className="text-muted-foreground">
          Gestiona la seguridad de tu cuenta
        </p>
      </div>
      
      <div className="max-w-xl">
        <SecurityForm tenant={tenant} />
      </div>
    </div>
  )
}
