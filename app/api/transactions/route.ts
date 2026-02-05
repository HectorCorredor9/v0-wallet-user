import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getMockTransactions } from '@/lib/mock-data'
import { isValidTenant } from '@/lib/tenants'
import type { Transaction, Currency, TransactionType, TransactionStatus } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId')
    
    if (!tenantId || !isValidTenant(tenantId)) {
      return NextResponse.json({ error: 'Tenant inválido' }, { status: 400 })
    }
    
    const session = await getSession()
    
    if (!session || session.tenantId !== tenantId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    
    // Get all transactions
    let transactions = getMockTransactions(session.tenantId, session.userId)
    
    // Apply filters
    const currency = searchParams.get('currency') as Currency | null
    const type = searchParams.get('type') as TransactionType | null
    const status = searchParams.get('status') as TransactionStatus | null
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const amountMin = searchParams.get('amountMin')
    const amountMax = searchParams.get('amountMax')
    const search = searchParams.get('search')
    
    if (currency) {
      transactions = transactions.filter(t => t.currency === currency)
    }
    
    if (type) {
      transactions = transactions.filter(t => t.type === type)
    }
    
    if (status) {
      transactions = transactions.filter(t => t.status === status)
    }
    
    if (dateFrom) {
      const fromDate = new Date(dateFrom)
      transactions = transactions.filter(t => new Date(t.createdAt) >= fromDate)
    }
    
    if (dateTo) {
      const toDate = new Date(dateTo)
      transactions = transactions.filter(t => new Date(t.createdAt) <= toDate)
    }
    
    if (amountMin) {
      transactions = transactions.filter(t => t.amount >= Number(amountMin))
    }
    
    if (amountMax) {
      transactions = transactions.filter(t => t.amount <= Number(amountMax))
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      transactions = transactions.filter(
        t => t.description.toLowerCase().includes(searchLower) ||
             t.reference.toLowerCase().includes(searchLower)
      )
    }
    
    // Pagination
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10
    const total = transactions.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const items = transactions.slice(start, start + limit)
    
    return NextResponse.json({
      items,
      total,
      page,
      limit,
      totalPages,
    })
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
