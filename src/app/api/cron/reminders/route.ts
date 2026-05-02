import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { resend } from '@/lib/resend'

// Since this is a server endpoint, we use the service role key to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const today = new Date()
    const todayDate = today.getDate()
    const remindersSent = []

    // 1. Process Loans
    const { data: loans } = await supabase.from('loans').select('*, profiles(email, full_name)')
    for (const loan of loans || []) {
      const startDate = new Date(loan.start_date)
      if (startDate.getDate() === todayDate) {
         // Anniversary! Send reminder
         const userEmail = loan.profiles?.email
         if (userEmail) {
           const msg = Number(loan.interest_rate) > 0 ? 'Reminder: Your monthly loan interest is due.' : 'Reminder: Your monthly loan principal installment is due.'
           await resend.emails.send({
             from: 'Family Ledger <noreply@familyledger.com>',
             to: [userEmail],
             subject: 'Payment Reminder: Family Ledger',
             html: `<p>Hi ${loan.profiles.full_name},</p><p>${msg}</p>`,
           })
           remindersSent.push(userEmail)
         }
      }
    }

    // 2. Process Committees
    const { data: committees } = await supabase.from('committees').select('*, profiles(email, full_name)')
    for (const comm of committees || []) {
      const startDate = new Date(comm.start_date)
      if (startDate.getDate() === todayDate) {
         const userEmail = comm.profiles?.email
         if (userEmail) {
           await resend.emails.send({
             from: 'Family Ledger <noreply@familyledger.com>',
             to: [userEmail],
             subject: 'Committee Installment Due',
             html: `<p>Hi ${comm.profiles.full_name},</p><p>Reminder: Your monthly committee installment of ₹${comm.monthly_installment} is due.</p>`,
           })
           remindersSent.push(userEmail)
         }
      }
    }

    // 3. Process Investments
    const { data: investments } = await supabase.from('investments').select('*, profiles(email, full_name)')
    for (const inv of investments || []) {
      const startDate = new Date(inv.start_date)
      if (startDate.getDate() === todayDate) {
         const userEmail = inv.profiles?.email
         if (userEmail) {
           await resend.emails.send({
             from: 'Family Ledger <noreply@familyledger.com>',
             to: [userEmail],
             subject: 'Investment Profit Collection',
             html: `<p>Hi ${inv.profiles.full_name},</p><p>Reminder: It is time to collect your monthly investment profit of ₹${inv.expected_monthly_profit}.</p>`,
           })
           remindersSent.push(userEmail)
         }
      }
    }

    return NextResponse.json({ success: true, remindersSent })
  } catch (error: any) {
    console.error('Cron Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
