import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PaymentForm } from './PaymentForm'

export default async function BorrowerDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: loans } = await supabase.from('loans').select('*').eq('user_id', user.id)
  const { data: transactions } = await supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false })

  const totalOwed = loans?.reduce((sum, loan) => sum + Number(loan.principal_amount), 0) || 0

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader>
            <CardTitle>Your Active Balance</CardTitle>
            <CardDescription className="text-zinc-400">Total principal amount currently owed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight text-indigo-400">
              ₹{totalOwed.toLocaleString('en-IN')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader>
            <CardTitle>Log a Payment</CardTitle>
            <CardDescription className="text-zinc-400">Submit a record of a payment you made.</CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentForm loans={loans || []} />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions && transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center p-4 border border-zinc-800 rounded-lg bg-zinc-950/50">
                  <div>
                    <p className="font-medium text-zinc-200">{tx.description}</p>
                    <p className="text-xs text-zinc-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-400">₹{Number(tx.amount).toLocaleString('en-IN')}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tx.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                      tx.status === 'pending' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm">No recent transactions found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
