'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { TenantConfig } from '@/lib/types'
import { appPath } from '@/lib/tenant-path'
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  CreditCard, 
  User,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  tenant: TenantConfig
  isOpen?: boolean
  onClose?: () => void
}

const navItems = [
  { 
    label: 'Dashboard', 
    path: 'dashboard', 
    icon: LayoutDashboard 
  },
  { 
    label: 'Transacciones', 
    path: 'transactions', 
    icon: ArrowLeftRight 
  },
  { 
    label: 'Tarjetas', 
    path: 'cards', 
    icon: CreditCard 
  },
  { 
    label: 'Perfil', 
    path: 'profile', 
    icon: User 
  },
]

export function Sidebar({ tenant, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 border-r border-border/50 bg-card transition-transform duration-300 lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100vh-4rem)] lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="font-semibold">{tenant.name}</span>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar menú">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-1 p-4">
          {navItems.map((item) => {
            const href = appPath(tenant.id, item.path as 'dashboard' | 'transactions' | 'cards' | 'profile')
            const isActive = pathname === href || pathname.startsWith(href + '/')
            
            return (
              <Link
                key={item.path}
                href={href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-white'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
                style={isActive ? { backgroundColor: tenant.colors.primary } : undefined}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border/50 p-4">
          <div className="rounded-xl bg-accent/50 p-3">
            <p className="text-xs text-muted-foreground">
              Wallet ID
            </p>
            <p className="text-sm font-mono font-medium truncate">
              {tenant.id}-wallet-001
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
