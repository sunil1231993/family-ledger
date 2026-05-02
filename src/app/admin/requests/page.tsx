import { createClient } from '@/lib/supabase/server'
import { RequestList } from './RequestList'

export default async function AdminRequestsPage() {
  const supabase = await createClient()

  // Fetch pending transactions and join with profile to get the user's name
  const { data: pendingTransactions } = await supabase
    .from('transactions')
    .select(`
      *,
      profiles ( full_name )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Payment Requests</h2>
        <p className="text-zinc-400 mt-2">Approve or reject pending payments submitted by users.</p>
      </div>

      <RequestList pendingTransactions={pendingTransactions || []} />
    </div>
  )
}
