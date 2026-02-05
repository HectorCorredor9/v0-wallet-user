import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getMockUser } from '@/lib/mock-data'
import { isValidTenant } from '@/lib/tenants'

export async function PATCH(request: NextRequest) {
  try {
    const { tenantId, name, phone, address } = await request.json()
    
    if (!tenantId || !isValidTenant(tenantId)) {
      return NextResponse.json({ error: 'Tenant inválido' }, { status: 400 })
    }
    
    const session = await getSession()
    
    if (!session || session.tenantId !== tenantId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    
    // In a real app, this would update the database
    const user = getMockUser(session.tenantId, session.userId)
    
    const updatedUser = {
      ...user,
      name: name || user.name,
      phone: phone || user.phone,
      address: address || user.address,
    }
    
    return NextResponse.json(updatedUser)
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
