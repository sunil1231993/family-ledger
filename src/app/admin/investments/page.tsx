import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'

export default async function InvestmentsPage() {
  const supabase = await createClient()
  const { data: investments } = await supabase.from('investments').select('*, profiles(full_name)').order('created_at', { ascending: false })

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Investments</h2>
        <p className="text-zinc-400 mt-2">View all active investments and expected profits.</p>
      </div>

      <div className="grid gap-4">
        {investments?.map(inv => (
          <Card key={inv.id} className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="font-bold text-lg">{inv.profiles?.full_name}</p>
                {inv.description && <p className="text-zinc-400 text-sm mt-1">{inv.description}</p>}
                <p className="text-zinc-500 text-xs mt-2">Start Date: {new Date(inv.start_date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-400">₹{Number(inv.principal_amount).toLocaleString('en-IN')}</p>
                <p className="text-zinc-500 text-sm">₹{Number(inv.expected_monthly_profit).toLocaleString('en-IN')}/mo Profit</p>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {(!investments || investments.length === 0) && (
          <div className="text-center p-8 text-zinc-500 border border-zinc-800 rounded-xl bg-zinc-900/50">
            No investments found.
          </div>
        )}
      </div>
    </div>
  )
}
