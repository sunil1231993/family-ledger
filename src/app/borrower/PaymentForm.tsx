'use client'

import { useState } from 'react'
import { submitPaymentRequest } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function PaymentForm({ loans }: { loans: any[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      await submitPaymentRequest(formData)
      toast.success('Payment logged successfully! Waiting for admin approval.')
    } catch (error) {
      toast.error('Failed to log payment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount Paid (₹)</Label>
        <Input 
          id="amount" 
          name="amount" 
          type="number" 
          min="1" 
          required 
          className="bg-zinc-950 border-zinc-800"
          placeholder="e.g. 5000"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category (Optional)</Label>
        <select 
          id="category"
          name="category"
          className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
        >
          <option value="generic">-- General Payment --</option>
          <option value="principal">Loan Principal</option>
          <option value="interest">Loan Interest</option>
          <option value="committee">Committee Installment</option>
          <option value="investment_profit">Investment Profit</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Payment Description</Label>
        <Input 
          id="description" 
          name="description" 
          type="text" 
          required 
          className="bg-zinc-950 border-zinc-800"
          placeholder="e.g. Monthly Interest for Jan"
        />
      </div>

      {loans && loans.length > 0 && (
        <div className="space-y-2 hidden">
           {/* If we want to map to a specific loan later, we can add a select dropdown */}
           <input type="hidden" name="loan_id" value={loans[0].id} />
        </div>
      )}

      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Log Payment'}
      </Button>
    </form>
  )
}
