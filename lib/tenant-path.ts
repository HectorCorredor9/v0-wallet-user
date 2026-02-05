/**
 * Helper function to build tenant-scoped paths
 * All routes must live under /t/[tenantId]/...
 */
export function tenantPath(tenantId: string, path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `/t/${tenantId}${cleanPath === '/' ? '' : cleanPath}`
}

/**
 * Build auth routes
 */
export function authPath(tenantId: string, route: 'login' | 'forgot-password' | 'reset-password' = 'login'): string {
  return tenantPath(tenantId, `/auth/${route}`)
}

/**
 * Build app routes
 */
export function appPath(
  tenantId: string,
  route: 'dashboard' | 'transactions' | 'cards' | 'profile' | 'profile/security' = 'dashboard'
): string {
  return tenantPath(tenantId, `/${route}`)
}

/**
 * Build card detail route
 */
export function cardDetailPath(tenantId: string, cardId: string): string {
  return tenantPath(tenantId, `/cards/${cardId}`)
}
