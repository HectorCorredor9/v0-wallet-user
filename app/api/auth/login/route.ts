import { NextRequest, NextResponse } from 'next/server'
import { validateMockLogin } from '@/lib/mock-data'
import { createSessionCookie } from '@/lib/auth'
import { isValidTenant } from '@/lib/tenants'
import type { Session } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { tenantId, email, password } = await request.json()
    
    if (!tenantId || !isValidTenant(tenantId)) {
      return NextResponse.json({ error: 'Tenant inválido' }, { status: 400 })
    }
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 })
    }
    
    const user = validateMockLogin(tenantId, email, password)
    
    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }
    
    const session: Session = {
      tenantId,
      userId: user.id,
      token: `mock-token-${Date.now()}`,
    }
    
    const response = NextResponse.json({ user, token: session.token })
    
    response.cookies.set('wallet-session', createSessionCookie(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    
    return response
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
