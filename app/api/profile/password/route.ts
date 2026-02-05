import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { isValidTenant } from '@/lib/tenants'

export async function POST(request: NextRequest) {
  try {
    const { tenantId, currentPassword, newPassword } = await request.json()
    
    if (!tenantId || !isValidTenant(tenantId)) {
      return NextResponse.json({ error: 'Tenant inválido' }, { status: 400 })
    }
    
    const session = await getSession()
    
    if (!session || session.tenantId !== tenantId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Contraseña actual y nueva son requeridas' },
        { status: 400 }
      )
    }
    
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'La nueva contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }
    
    // In a real app, this would verify current password and update the database
    // For mock purposes, we accept any current password
    
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
