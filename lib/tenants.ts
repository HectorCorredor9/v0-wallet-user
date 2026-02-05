import type { TenantConfig } from './types'

export const TENANTS: Record<string, TenantConfig> = {
  tebca: {
    id: 'tebca',
    name: 'Tebca',
    logo: '/tenants/tebca-logo.svg',
    colors: {
      primary: '#004C97',
      primaryForeground: '#FFFFFF',
      secondary: '#0066CC',
      gradientFrom: '#004C97',
      gradientTo: '#0077B6',
    },
  },
  demo: {
    id: 'demo',
    name: 'Demo Bank',
    logo: '/tenants/demo-logo.svg',
    colors: {
      primary: '#10B981',
      primaryForeground: '#FFFFFF',
      secondary: '#059669',
      gradientFrom: '#10B981',
      gradientTo: '#34D399',
    },
  },
}

export function getTenantConfig(tenantId: string): TenantConfig | null {
  return TENANTS[tenantId] || null
}

export function isValidTenant(tenantId: string): boolean {
  return tenantId in TENANTS
}

export function getAllTenantIds(): string[] {
  return Object.keys(TENANTS)
}

// CSS custom properties for tenant branding
export function getTenantCSSVariables(tenant: TenantConfig): Record<string, string> {
  return {
    '--brand-primary': tenant.colors.primary,
    '--brand-primary-foreground': tenant.colors.primaryForeground,
    '--brand-secondary': tenant.colors.secondary,
    '--brand-gradient-from': tenant.colors.gradientFrom,
    '--brand-gradient-to': tenant.colors.gradientTo,
  }
}
