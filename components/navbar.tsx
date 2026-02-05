'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { TenantConfig, User } from '@/lib/types'
import { appPath, authPath } from '@/lib/tenant-path'
import { logout } from '@/lib/api'
import { 
  Wallet, 
  Menu, 
  User as UserIcon, 
  Shield, 
  LogOut,
  Bell
} from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

interface NavbarProps {
  tenant: TenantConfig
  user: User
  onMenuClick?: () => void
}

export function Navbar({ tenant, user, onMenuClick }: NavbarProps) {
  const router = useRouter()
  
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  async function handleLogout() {
    await logout()
    router.push(authPath(tenant.id, 'login'))
    router.refresh()
  }
  
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link 
            href={appPath(tenant.id, 'dashboard')}
            className="flex items-center gap-2"
          >
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: tenant.colors.primary }}
            >
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg hidden sm:inline">{tenant.name}</span>
          </Link>
        </div>
        
        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative" aria-label="Notificaciones">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
          </Button>
          
          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback 
                    className="text-white text-sm font-medium"
                    style={{ backgroundColor: tenant.colors.primary }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={appPath(tenant.id, 'profile')} className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Mi perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={appPath(tenant.id, 'profile/security')} className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Seguridad</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
