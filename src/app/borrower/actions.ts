'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendEmail } from '@/lib/email'

export async function submitPaymentRequest(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Fetch borrower profile
  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()

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

  // Notify Admin
  const { data: admins } = await supabase.from('profiles').select('email').eq('role', 'admin')
  const adminEmails = admins?.map(a => a.email).filter(Boolean) as string[]
  
  if (adminEmails && adminEmails.length > 0) {
    await sendEmail({
      to: adminEmails,
      subject: 'New Payment Request: Family Ledger',
      html: `
        <h2>New Payment Request</h2>
        <p><strong>Family Member:</strong> ${profile?.full_name}</p>
        <p><strong>Amount:</strong> ₹${Number(amount).toLocaleString()}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Description:</strong> ${description || 'N/A'}</p>
        <p>Please log in to the Admin Dashboard to review and approve this request.</p>
      `
    })
  }

  revalidatePath('/borrower')
  return { success: true }
}
