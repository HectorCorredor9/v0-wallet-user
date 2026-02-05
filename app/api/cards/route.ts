import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getMockCards } from '@/lib/mock-data'
import { isValidTenant } from '@/lib/tenants'

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.nextUrl.searchParams.get('tenantId')
    
    if (!tenantId || !isValidTenant(tenantId)) {
      return NextResponse.json({ error: 'Tenant inválido' }, { status: 400 })
    }
    
    const session = await getSession()
    
    if (!session || session.tenantId !== tenantId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    
    const cards = getMockCards(session.tenantId, session.userId)
    return NextResponse.json(cards)
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
