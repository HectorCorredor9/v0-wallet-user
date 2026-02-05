'use client'

import React from "react"

import { useState, useEffect } from 'react'
import type { TenantConfig, User } from '@/lib/types'
import { getTenantCSSVariables } from '@/lib/tenants'
import { Navbar } from './navbar'
import { Sidebar } from './sidebar'

interface AppShellProps {
  tenant: TenantConfig
  user: User
  children: React.ReactNode
}

export function AppShell({ tenant, user, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
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
    <div className="min-h-screen bg-background">
      <Navbar 
        tenant={tenant} 
        user={user} 
        onMenuClick={() => setSidebarOpen(true)} 
      />
      
      <div className="flex">
        <Sidebar 
          tenant={tenant} 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
