'use client'

import React from "react"

import { useEffect } from 'react'
import Link from 'next/link'
import type { TenantConfig } from '@/lib/types'
import { getTenantCSSVariables } from '@/lib/tenants'
import { tenantPath } from '@/lib/tenant-path'
import { Wallet } from 'lucide-react'

interface AuthShellProps {
  tenant: TenantConfig
  children: React.ReactNode
}

export function AuthShell({ tenant, children }: AuthShellProps) {
  useEffect(() => {
    const cssVars = getTenantCSSVariables(tenant)
    Object.entries(cssVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
    
    return () => {
      Object.keys(cssVars).forEach(key => {
        document.documentElement.style.removeProperty(key)
      })
    }
  }, [tenant])
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link 
            href={tenantPath(tenant.id, '/auth/login')}
            className="flex items-center gap-2 text-foreground"
          >
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: tenant.colors.primary }}
            >
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">{tenant.name}</span>
          </Link>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/50 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {tenant.name}. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
