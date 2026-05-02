import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'

export default async function CommitteesPage() {
  const supabase = await createClient()
  const { data: committees } = await supabase.from('committees').select('*, profiles(full_name)').order('created_at', { ascending: false })

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Committees</h2>
        <p className="text-zinc-400 mt-2">View active committee records.</p>
      </div>

      <div className="grid gap-4">
        {committees?.map(comm => (
          <Card key={comm.id} className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="font-bold text-lg">{comm.profiles?.full_name}</p>
                {comm.description && <p className="text-zinc-400 text-sm mt-1">{comm.description}</p>}
                <p className="text-zinc-500 text-xs mt-2">Valid: {new Date(comm.start_date).toLocaleDateString()} to {new Date(comm.end_date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-pink-400">₹{Number(comm.total_amount).toLocaleString('en-IN')}</p>
                <p className="text-zinc-500 text-sm">₹{Number(comm.monthly_installment).toLocaleString('en-IN')}/mo Installment</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
