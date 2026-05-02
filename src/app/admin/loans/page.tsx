import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'

export default async function LoansPage() {
  const supabase = await createClient()
  const { data: loans } = await supabase.from('loans').select('*, profiles(full_name)').order('created_at', { ascending: false })

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Active Loans</h2>
        <p className="text-zinc-400 mt-2">View all disbursed loans.</p>
      </div>

      <div className="grid gap-4">
        {loans?.map(loan => (
          <Card key={loan.id} className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="font-bold text-lg">{loan.profiles?.full_name}</p>
                {loan.description && <p className="text-zinc-400 text-sm mt-1">{loan.description}</p>}
                <p className="text-zinc-500 text-xs mt-2">Start Date: {new Date(loan.start_date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-400">₹{Number(loan.principal_amount).toLocaleString('en-IN')}</p>
                <p className="text-zinc-500 text-sm">{Number(loan.interest_rate) > 0 ? `${loan.interest_rate}% Interest` : 'Interest Free'}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
