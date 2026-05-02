import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Banknote, Users, Activity, IndianRupee } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch some summary data
  const { data: loans } = await supabase.from('loans').select('principal_amount')
  const { data: transactions } = await supabase.from('transactions').select('amount, status, type')
  
  const totalPrincipal = loans?.reduce((sum, loan) => sum + Number(loan.principal_amount), 0) || 0
  const totalApprovedCredits = transactions?.filter(t => t.status === 'approved' && t.type === 'credit')
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0
    
  const cashOnStreet = totalPrincipal
  const cashOnHand = totalApprovedCredits

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Money on Street</CardTitle>
            <Banknote className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{cashOnStreet.toLocaleString('en-IN')}</div>
            <p className="text-xs text-zinc-500 mt-1">Active principal out</p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Cash Received</CardTitle>
            <IndianRupee className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{cashOnHand.toLocaleString('en-IN')}</div>
            <p className="text-xs text-zinc-500 mt-1">Total approved credits</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Active Loans</CardTitle>
            <Users className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loans?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Pending Requests</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions?.filter(t => t.status === 'pending').length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <Card className="col-span-4 bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400 text-sm">Activity feed will be displayed here...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
