import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Banknote, Users, Activity, IndianRupee } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch some summary data
  const { data: allLoans } = await supabase.from('loans').select('*, profiles(full_name)')
  const { data: allInvestments } = await supabase.from('investments').select('*, profiles(full_name)')
  const { data: allCommittees } = await supabase.from('committees').select('*, profiles(full_name)')
  const { data: allTransactions } = await supabase.from('transactions').select('amount, status, type, loan_id, investment_id, category')
  
  const loanPrincipal = allLoans?.reduce((sum, loan) => sum + Number(loan.principal_amount), 0) || 0
  const investmentPrincipal = allInvestments?.reduce((sum, inv) => sum + Number(inv.principal_amount), 0) || 0
  
  const totalApprovedCredits = allTransactions?.filter(t => t.status === 'approved' && t.type === 'credit')
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0
    
  const cashOnStreet = loanPrincipal + investmentPrincipal
  const cashOnHand = totalApprovedCredits

  // Calculate Monthly Income Target
  const investmentProfit = allInvestments?.reduce((sum, inv) => sum + Number(inv.expected_monthly_profit), 0) || 0
  const loanInterest = allLoans?.reduce((sum, loan) => {
    const monthlyRate = Number(loan.interest_rate) // Assuming the rate entered is monthly %
    return sum + (Number(loan.principal_amount) * (monthlyRate / 100))
  }, 0) || 0
  
  const expectedMonthlyIncome = investmentProfit + loanInterest

  const summaryData = {
    loans: allLoans || [],
    investments: allInvestments || [],
    committees: allCommittees || [],
  }

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
            <p className="text-xs text-zinc-500 mt-1">Loan + Investment Principal</p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Monthly Income Target</CardTitle>
            <IndianRupee className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{expectedMonthlyIncome.toLocaleString('en-IN')}</div>
            <p className="text-xs text-zinc-500 mt-1">Interest + Investment Profit</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Cash Received</CardTitle>
            <Activity className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{cashOnHand.toLocaleString('en-IN')}</div>
            <p className="text-xs text-zinc-500 mt-1">Total approved payments</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Pending Approvals</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allTransactions?.filter(t => t.status === 'pending').length || 0}</div>
            <p className="text-xs text-zinc-500 mt-1">Payments awaiting review</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader>
            <CardTitle>Portfolio Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/50">
                  <tr>
                    <th className="px-4 py-3">Member</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-center">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {/* Loans Summary */}
                  {summaryData.loans.map((loan: any) => {
                    const paid = allTransactions?.filter(t => t.loan_id === loan.id && t.status === 'approved' && t.type === 'credit')
                      .reduce((sum, t) => sum + Number(t.amount), 0) || 0
                    const progress = Math.min(100, Math.round((paid / Number(loan.principal_amount)) * 100))
                    
                    return (
                      <tr key={loan.id} className="hover:bg-zinc-800/50">
                        <td className="px-4 py-3 font-medium">{loan.profiles.full_name}</td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px]">LOAN</span></td>
                        <td className="px-4 py-3 text-zinc-400 truncate max-w-[150px]">{loan.description || 'No description'}</td>
                        <td className="px-4 py-3 text-right font-mono text-indigo-400">₹{Number(loan.principal_amount).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-zinc-800 rounded-full h-1.5 flex-1">
                              <div className="bg-indigo-500 h-1.5 rounded-fullTransition" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-[10px] text-zinc-500 min-w-[30px] text-right">{progress}%</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {/* Investments Summary */}
                  {summaryData.investments.map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-zinc-800/50">
                      <td className="px-4 py-3 font-medium">{inv.profiles.full_name}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px]">INVEST</span></td>
                      <td className="px-4 py-3 text-zinc-400 truncate max-w-[150px]">{inv.description || 'No description'}</td>
                      <td className="px-4 py-3 text-right font-mono text-emerald-400">₹{Number(inv.principal_amount).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-zinc-800 rounded-full h-1.5 flex-1">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                          <span className="text-[10px] text-zinc-500 min-w-[30px] text-right">Active</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Committees Summary */}
                  {summaryData.committees.map((comm: any) => {
                    const start = new Date(comm.start_date)
                    const end = new Date(comm.end_date)
                    const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
                    const elapsedMonths = Math.max(0, (new Date().getFullYear() - start.getFullYear()) * 12 + (new Date().getMonth() - start.getMonth()))
                    const progress = Math.min(100, Math.round((elapsedMonths / totalMonths) * 100))

                    return (
                      <tr key={comm.id} className="hover:bg-zinc-800/50">
                        <td className="px-4 py-3 font-medium">{comm.profiles.full_name}</td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 text-[10px]">COMM</span></td>
                        <td className="px-4 py-3 text-zinc-400 truncate max-w-[150px]">{comm.description || 'No description'}</td>
                        <td className="px-4 py-3 text-right font-mono text-pink-400">₹{Number(comm.total_amount).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-zinc-800 rounded-full h-1.5 flex-1">
                              <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-[10px] text-zinc-500 min-w-[30px] text-right">{progress}%</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {summaryData.loans.length === 0 && summaryData.investments.length === 0 && summaryData.committees.length === 0 && (
                <div className="p-8 text-center text-zinc-500 italic">No assets or liabilities found.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
