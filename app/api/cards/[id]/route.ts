import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getMockCard } from '@/lib/mock-data'
import { isValidTenant } from '@/lib/tenants'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tenantId = request.nextUrl.searchParams.get('tenantId')
    
    if (!tenantId || !isValidTenant(tenantId)) {
      return NextResponse.json({ error: 'Tenant inválido' }, { status: 400 })
    }
    
    const session = await getSession()
    
    if (!session || session.tenantId !== tenantId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    
    const card = getMockCard(session.tenantId, id, session.userId)
    
    if (!card) {
      return NextResponse.json({ error: 'Tarjeta no encontrada' }, { status: 404 })
    }
    
    return NextResponse.json(card)
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
