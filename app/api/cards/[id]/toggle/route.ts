import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getMockCard } from '@/lib/mock-data'
import { isValidTenant } from '@/lib/tenants'

// In-memory store for card status changes (in real app, this would be a database)
const cardStatusOverrides: Map<string, 'active' | 'blocked'> = new Map()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { tenantId } = await request.json()
    
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
    
    // Check current status (including any overrides)
    const cardKey = `${tenantId}-${id}`
    const currentStatus = cardStatusOverrides.get(cardKey) || card.status
    
    // Only active or blocked cards can be toggled
    if (currentStatus !== 'active' && currentStatus !== 'blocked') {
      return NextResponse.json(
        { error: 'Solo se pueden bloquear/desbloquear tarjetas activas o bloqueadas' },
        { status: 400 }
      )
    }
    
    // Toggle status
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active'
    cardStatusOverrides.set(cardKey, newStatus)
    
    return NextResponse.json({
      ...card,
      status: newStatus,
    })
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// Helper to get card with status override
export function getCardWithOverride(tenantId: string, cardId: string, baseCard: typeof import('@/lib/types').Card | null) {
  if (!baseCard) return null
  const cardKey = `${tenantId}-${cardId}`
  const override = cardStatusOverrides.get(cardKey)
  if (override) {
    return { ...baseCard, status: override }
  }
  return baseCard
}
