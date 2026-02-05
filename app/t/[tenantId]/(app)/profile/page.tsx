import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTenantConfig } from '@/lib/tenants'
import { requireAuth } from '@/lib/auth'
import { appPath } from '@/lib/tenant-path'
import { ProfileForm } from '@/components/profile-form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Shield, ChevronRight } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params
  const tenant = getTenantConfig(tenantId)
  return {
    title: tenant ? `Perfil - ${tenant.name}` : 'Perfil',
    description: 'Gestiona tu información personal',
  }
}

export default async function ProfilePage({
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
  
  const { user } = authResult
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mi perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y preferencias
        </p>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfileForm user={user} tenant={tenant} />
        </div>
        
        <div className="space-y-4">
          {/* Security link */}
          <Link href={appPath(tenantId, 'profile/security')}>
            <Card className="rounded-2xl border-border/50 hover:bg-accent/50 transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-4 p-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: tenant.colors.primary }}
                >
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Seguridad</p>
                  <p className="text-sm text-muted-foreground">
                    Cambiar contraseña y configuración de seguridad
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
          
          {/* Account info */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Información de cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cuenta creada</span>
                <span>{new Date(user.createdAt).toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tenant</span>
                <span className="font-medium">{tenant.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID de usuario</span>
                <span className="font-mono text-xs">{user.id}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
