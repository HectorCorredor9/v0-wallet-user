'use client'

import { useState, useMemo } from 'react'
import type { Card as CardType, TenantConfig, Transaction } from '@/lib/types'
import { CardListItem } from '@/components/card-list-item'
import { CardDetailPanel } from '@/components/card-detail-panel'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CreditCard, Plus, Search, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CardsDashboardProps {
  cards: CardType[]
  tenant: TenantConfig
  transactions: Transaction[]
}

export function CardsDashboard({ cards, tenant, transactions }: CardsDashboardProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(
    cards.length > 0 ? cards[0].id : null
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [cardStatuses, setCardStatuses] = useState<Record<string, CardType['status']>>(
    () => Object.fromEntries(cards.map(c => [c.id, c.status]))
  )

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return cards
    const q = searchQuery.toLowerCase().trim()
    return cards.filter(
      (card) =>
        card.last4.includes(q) ||
        card.nickname.toLowerCase().includes(q)
    )
  }, [cards, searchQuery])

  const selectedCard = useMemo(
    () => cards.find((c) => c.id === selectedCardId) ?? null,
    [cards, selectedCardId]
  )

  const selectedCardTransactions = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'payment' || t.type === 'withdrawal')
        .slice(0, 5),
    [transactions]
  )

  function handleCardSelect(cardId: string) {
    setSelectedCardId(cardId)
  }

  function handleStatusChange(cardId: string, newStatus: 'active' | 'blocked') {
    setCardStatuses(prev => ({ ...prev, [cardId]: newStatus }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mis Tarjetas</h1>
          <p className="text-muted-foreground">
            Administra y consulta tus tarjetas
          </p>
        </div>
        <Button
          disabled
          className="rounded-xl gap-2 text-foreground opacity-50 cursor-not-allowed"
          style={{ backgroundColor: tenant.colors.primary, color: tenant.colors.primaryForeground }}
        >
          <Plus className="h-4 w-4" />
          Agregar tarjeta
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por alias o ultimos 4 digitos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 rounded-xl"
        />
      </div>

      {/* 2-column layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Cards List */}
        <div
          className={cn(
            'w-full lg:w-[380px] lg:shrink-0',
            selectedCard && 'hidden lg:block'
          )}
        >
          <CardsList
            cards={filteredCards}
            cardStatuses={cardStatuses}
            selectedCardId={selectedCardId}
            tenant={tenant}
            onSelect={handleCardSelect}
            searchQuery={searchQuery}
          />
        </div>

        {/* Right column - Card Detail */}
        <div
          className={cn(
            'flex-1 min-w-0',
            !selectedCard && 'hidden lg:block'
          )}
        >
          {/* Mobile back button */}
          {selectedCard && (
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mb-4 -ml-2 rounded-xl gap-2"
              onClick={() => setSelectedCardId(null)}
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a la lista
            </Button>
          )}

          {selectedCard ? (
            <CardDetailPanel
              card={{ ...selectedCard, status: cardStatuses[selectedCard.id] ?? selectedCard.status }}
              tenant={tenant}
              transactions={selectedCardTransactions}
              onStatusChange={(newStatus) => handleStatusChange(selectedCard.id, newStatus)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/30 py-20 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">
                Selecciona una tarjeta
              </h3>
              <p className="text-sm text-muted-foreground/70 mt-1 max-w-xs">
                Elige una tarjeta de la lista para ver sus detalles, limites y transacciones recientes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---- Cards List Sub-component ---- */
function CardsList({
  cards,
  cardStatuses,
  selectedCardId,
  tenant,
  onSelect,
  searchQuery,
}: {
  cards: CardType[]
  cardStatuses: Record<string, CardType['status']>
  selectedCardId: string | null
  tenant: TenantConfig
  onSelect: (id: string) => void
  searchQuery: string
}) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/30 py-12 text-center">
        <CreditCard className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <h3 className="text-base font-medium text-muted-foreground">
          {searchQuery
            ? 'Sin resultados'
            : 'No tienes tarjetas'}
        </h3>
        <p className="text-sm text-muted-foreground/70 mt-1">
          {searchQuery
            ? 'Intenta con otro termino de busqueda'
            : 'Solicita tu primera tarjeta para comenzar'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Desktop: vertical scroll list */}
      <div className="hidden lg:block">
        <ScrollArea className="h-[calc(100vh-320px)]">
          <div className="space-y-2 pr-3">
            {cards.map((card) => (
              <CardListItem
                key={card.id}
                card={{ ...card, status: cardStatuses[card.id] ?? card.status }}
                tenant={tenant}
                isSelected={card.id === selectedCardId}
                onSelect={() => onSelect(card.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="lg:hidden -mx-4 px-4">
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          {cards.map((card) => (
            <div key={card.id} className="snap-start shrink-0 w-[280px]">
              <CardListItem
                card={{ ...card, status: cardStatuses[card.id] ?? card.status }}
                tenant={tenant}
                isSelected={card.id === selectedCardId}
                onSelect={() => onSelect(card.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
