import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getMockUser } from '@/lib/mock-data'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    
    const user = getMockUser(session.tenantId, session.userId)
    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
