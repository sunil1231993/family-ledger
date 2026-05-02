'use client'

import { useState } from 'react'
import { updateTransactionStatus } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Check, X } from 'lucide-react'

export function RequestList({ pendingTransactions }: { pendingTransactions: any[] }) {
  const [processingId, setProcessingId] = useState<string | null>(null)

  async function handleAction(id: string, status: 'approved' | 'rejected') {
    setProcessingId(id)
    try {
      await updateTransactionStatus(id, status)
      toast.success(`Transaction ${status} successfully`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update transaction')
    } finally {
      setProcessingId(null)
    }
  }

  if (!pendingTransactions || pendingTransactions.length === 0) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-8 text-center text-zinc-500">
          No pending payment requests.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {pendingTransactions.map((tx) => (
        <Card key={tx.id} className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-medium text-lg">{tx.profiles?.full_name}</h3>
              <p className="text-zinc-400">{tx.description}</p>
              <div className="flex gap-2 mt-2 text-sm text-zinc-500">
                <span>Date: {new Date(tx.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span>Type: {tx.type}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-2xl font-bold text-indigo-400">
                ₹{Number(tx.amount).toLocaleString('en-IN')}
              </div>
              <div className="flex gap-2">
                <Button 
                  size="icon"
                  variant="outline"
                  className="bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                  disabled={processingId === tx.id}
                  onClick={() => handleAction(tx.id, 'approved')}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon"
                  variant="outline"
                  className="bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white"
                  disabled={processingId === tx.id}
                  onClick={() => handleAction(tx.id, 'rejected')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
