"use client"

import { useState } from 'react'
import { generateReorderSuggestions } from '@/ai/flows/generate-reorder-suggestions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Wand2, Loader2 } from 'lucide-react'
import { products } from '@/lib/data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function ReorderSuggestions() {
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    setSuggestions(null)

    try {
      const inventoryData = products.map(p => `${p.name}: ${p.stock} units`).join('\n')
      const salesData = products.map(p => `${p.name}: ${p.sales} units sold recently`).join('\n')

      const result = await generateReorderSuggestions({ inventoryData, salesData })
      setSuggestions(result.reorderSuggestions)
    } catch (e) {
      setError('Failed to generate suggestions. Please try again.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Wand2 className="mr-2 h-4 w-4" />
          Get Reorder Suggestions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>AI Reordering Suggestions</DialogTitle>
          <DialogDescription>
            Use generative AI to analyze your inventory and sales data for smart reordering recommendations.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {loading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4">Generating suggestions...</p>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {suggestions && (
            <Alert>
              <Wand2 className="h-4 w-4" />
              <AlertTitle>Suggestions from AI</AlertTitle>
              <AlertDescription>
                <pre className="whitespace-pre-wrap font-sans text-sm">{suggestions}</pre>
              </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Generate Suggestions'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
