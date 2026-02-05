'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Alert variant="destructive" className="max-w-md rounded-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Algo salió mal</AlertTitle>
        <AlertDescription>
          Ha ocurrido un error al cargar esta página. Por favor, intenta de nuevo.
        </AlertDescription>
      </Alert>
      <Button onClick={reset} variant="outline" className="rounded-xl bg-transparent">
        <RefreshCw className="mr-2 h-4 w-4" />
        Intentar de nuevo
      </Button>
    </div>
  )
}
