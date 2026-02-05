import { NextRequest, NextResponse } from 'next/server'
import { getTenantConfig } from '@/lib/tenants'

export async function GET(request: NextRequest) {
  const tenantId = request.nextUrl.searchParams.get('tenantId')
  
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId es requerido' }, { status: 400 })
  }
  
  const tenant = getTenantConfig(tenantId)
  
  if (!tenant) {
    return NextResponse.json({ error: 'Tenant no encontrado' }, { status: 404 })
  }
  
  return NextResponse.json(tenant)
}
