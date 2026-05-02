'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTransactionStatus(transactionId: string, status: 'approved' | 'rejected') {
  const supabase = await createClient()

  // First, verify we are admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Not authorized')

  // Begin update logic
  const { data: tx, error: fetchError } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', transactionId)
    .single()

  if (fetchError || !tx) throw new Error('Transaction not found')
  if (tx.status !== 'pending') throw new Error('Transaction is not pending')

  const { error: updateError } = await supabase
    .from('transactions')
    .update({ status })
    .eq('id', transactionId)

  if (updateError) throw new Error('Failed to update transaction')

  // If approved, update respective balances based on the transaction category.
  if (status === 'approved' && tx.type === 'credit') {
    if (tx.category === 'principal' && tx.loan_id) {
      const { data: loan } = await supabase.from('loans').select('principal_amount').eq('id', tx.loan_id).single()
      if (loan) {
        const newPrincipal = Math.max(0, Number(loan.principal_amount) - Number(tx.amount))
        await supabase.from('loans').update({ principal_amount: newPrincipal }).eq('id', tx.loan_id)
      }
    } else if (tx.category === 'committee' && tx.committee_id) {
       // Could update a paid amount here if we add that tracking later
    } else if (tx.category === 'interest') {
       // Just logs it as interest paid, principal remains same
    }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/requests')
  
  return { success: true }
}
