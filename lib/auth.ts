import { cookies } from 'next/headers'
import type { Session, User } from './types'
import { getMockUser } from './mock-data'

const SESSION_COOKIE_NAME = 'wallet-session'

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
  
  if (!sessionCookie?.value) {
    return null
  }
  
  try {
    const session = JSON.parse(sessionCookie.value) as Session
    return session
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  
  if (!session) {
    return null
  }
  
  // In a real app, this would fetch from database
  return getMockUser(session.tenantId, session.userId)
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

export async function requireAuth(tenantId: string): Promise<{ session: Session; user: User } | null> {
  const session = await getSession()
  
  if (!session || session.tenantId !== tenantId) {
    return null
  }
  
  const user = getMockUser(session.tenantId, session.userId)
  return { session, user }
}

// Client-side session helpers
export function createSessionCookie(session: Session): string {
  return JSON.stringify(session)
}

export function parseSessionCookie(value: string): Session | null {
  try {
    return JSON.parse(value) as Session
  } catch {
    return null
  }
}
