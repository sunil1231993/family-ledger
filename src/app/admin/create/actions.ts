'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendEmail } from '@/lib/email'

export async function createLoan(formData: FormData) {
  const supabase = await createClient()
  const userId = formData.get('user_id') as string
  const principal = Number(formData.get('principal_amount'))
  const interest = Number(formData.get('interest_rate'))
  const startDate = formData.get('start_date') as string
  const description = formData.get('description') as string

  const { error } = await supabase.from('loans').insert({
    user_id: userId,
    principal_amount: principal,
    interest_rate: interest,
    start_date: startDate,
    description: description
  })

  if (error) throw new Error(error.message)

  // Fetch borrower email to notify them
  const { data: profile } = await supabase.from('profiles').select('email, full_name').eq('id', userId).single()
  if (profile?.email) {
    await sendEmail({
      to: profile.email,
      subject: 'New Loan Created: Family Ledger',
      html: `
        <h2>Hi ${profile.full_name},</h2>
        <p>A new loan has been registered for you in the Family Ledger.</p>
        <ul>
          <li><strong>Amount:</strong> ₹${principal.toLocaleString()}</li>
          <li><strong>Interest Rate:</strong> ${interest}%</li>
          <li><strong>Start Date:</strong> ${startDate}</li>
          ${description ? `<li><strong>Description:</strong> ${description}</li>` : ''}
        </ul>
        <p>Log in to your dashboard to view details and submit payments.</p>
      `
    })
  }

  revalidatePath('/admin')
  revalidatePath('/admin/create')
}

export async function createInvestment(formData: FormData) {
  const supabase = await createClient()
  const userId = formData.get('user_id') as string
  const principal = Number(formData.get('principal_amount'))
  const expectedProfit = Number(formData.get('expected_monthly_profit'))
  const startDate = formData.get('start_date') as string
  const description = formData.get('description') as string

  const { error } = await supabase.from('investments').insert({
    user_id: userId,
    principal_amount: principal,
    expected_monthly_profit: expectedProfit,
    start_date: startDate,
    description: description
  })

  if (error) throw new Error(error.message)

  // Fetch borrower email to notify them
  const { data: profile } = await supabase.from('profiles').select('email, full_name').eq('id', userId).single()
  if (profile?.email) {
    await sendEmail({
      to: profile.email,
      subject: 'New Investment Registered: Family Ledger',
      html: `
        <h2>Hi ${profile.full_name},</h2>
        <p>A new investment has been registered for you in the Family Ledger.</p>
        <ul>
          <li><strong>Principal:</strong> ₹${principal.toLocaleString()}</li>
          <li><strong>Expected Monthly Profit:</strong> ₹${expectedProfit.toLocaleString()}</li>
          <li><strong>Start Date:</strong> ${startDate}</li>
          ${description ? `<li><strong>Description:</strong> ${description}</li>` : ''}
        </ul>
        <p>Log in to your dashboard to track your returns.</p>
      `
    })
  }

  revalidatePath('/admin')
  revalidatePath('/admin/create')
}

export async function createCommittee(formData: FormData) {
  const supabase = await createClient()
  const userId = formData.get('user_id') as string
  const totalAmount = Number(formData.get('total_amount'))
  const monthlyInstallment = Number(formData.get('monthly_installment'))
  const startDate = formData.get('start_date') as string
  const endDate = formData.get('end_date') as string
  const description = formData.get('description') as string

  const { error } = await supabase.from('committees').insert({
    user_id: userId,
    total_amount: totalAmount,
    monthly_installment: monthlyInstallment,
    start_date: startDate,
    end_date: endDate,
    description: description
  })

  if (error) throw new Error(error.message)

  // Fetch borrower email to notify them
  const { data: profile } = await supabase.from('profiles').select('email, full_name').eq('id', userId).single()
  if (profile?.email) {
    await sendEmail({
      to: profile.email,
      subject: 'New Committee Registered: Family Ledger',
      html: `
        <h2>Hi ${profile.full_name},</h2>
        <p>A new committee record has been created for you in the Family Ledger.</p>
        <ul>
          <li><strong>Total Amount:</strong> ₹${totalAmount.toLocaleString()}</li>
          <li><strong>Monthly Installment:</strong> ₹${monthlyInstallment.toLocaleString()}</li>
          <li><strong>Duration:</strong> ${startDate} to ${endDate}</li>
          ${description ? `<li><strong>Description:</strong> ${description}</li>` : ''}
        </ul>
      `
    })
  }

  revalidatePath('/admin')
  revalidatePath('/admin/create')
}
