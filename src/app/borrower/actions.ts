'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitPaymentRequest(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  const amount = formData.get('amount') as string
  const description = formData.get('description') as string
  const loanId = formData.get('loan_id') as string | null
  const category = (formData.get('category') as string) || 'generic'

  const { error } = await supabase.from('transactions').insert({
    user_id: user.id,
    amount: Number(amount),
    type: 'credit',
    status: 'pending',
    description: description,
    category: category,
    loan_id: loanId || null
  })

  if (error) {
    console.error('Error submitting payment:', error)
    throw new Error('Failed to submit payment request')
  }

  revalidatePath('/borrower')
  return { success: true }
}
