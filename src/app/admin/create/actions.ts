'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createLoan(formData: FormData) {
  const supabase = await createClient()
  const userId = formData.get('user_id') as string
  const principal = Number(formData.get('principal_amount'))
  const interest = Number(formData.get('interest_rate'))
  const startDate = formData.get('start_date') as string

  const { error } = await supabase.from('loans').insert({
    user_id: userId,
    principal_amount: principal,
    interest_rate: interest,
    start_date: startDate
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/admin/create')
}

export async function createInvestment(formData: FormData) {
  const supabase = await createClient()
  const userId = formData.get('user_id') as string
  const principal = Number(formData.get('principal_amount'))
  const expectedProfit = Number(formData.get('expected_monthly_profit'))
  const startDate = formData.get('start_date') as string

  const { error } = await supabase.from('investments').insert({
    user_id: userId,
    principal_amount: principal,
    expected_monthly_profit: expectedProfit,
    start_date: startDate
  })

  if (error) throw new Error(error.message)
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

  const { error } = await supabase.from('committees').insert({
    user_id: userId,
    total_amount: totalAmount,
    monthly_installment: monthlyInstallment,
    start_date: startDate,
    end_date: endDate
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/admin/create')
}
