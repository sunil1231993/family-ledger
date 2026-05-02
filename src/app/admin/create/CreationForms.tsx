'use client'

import { useState } from 'react'
import { createLoan, createInvestment, createCommittee } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

export function CreationForms({ users }: { users: any[] }) {
  const [loading, setLoading] = useState(false)

  async function handleLoan(formData: FormData) {
    setLoading(true)
    try {
      await createLoan(formData)
      toast.success('Loan created successfully')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleInvestment(formData: FormData) {
    setLoading(true)
    try {
      await createInvestment(formData)
      toast.success('Investment created successfully')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCommittee(formData: FormData) {
    setLoading(true)
    try {
      await createCommittee(formData)
      toast.success('Committee created successfully')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Tabs defaultValue="loan" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-zinc-900 border border-zinc-800">
        <TabsTrigger value="loan">New Loan</TabsTrigger>
        <TabsTrigger value="investment">New Investment</TabsTrigger>
        <TabsTrigger value="committee">New Committee</TabsTrigger>
      </TabsList>

      <TabsContent value="loan">
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 mt-4">
          <CardContent className="pt-6">
            <form action={handleLoan} className="space-y-4">
              <div className="space-y-2">
                <Label>Select User</Label>
                <select name="user_id" required className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100">
                  <option value="">-- Select Family Member --</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Principal Amount (₹)</Label>
                  <Input name="principal_amount" type="number" required className="bg-zinc-950 border-zinc-800" />
                </div>
                <div className="space-y-2">
                  <Label>Interest Rate (%)</Label>
                  <Input name="interest_rate" type="number" step="0.01" required placeholder="0 for no interest" className="bg-zinc-950 border-zinc-800" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input name="start_date" type="date" required className="bg-zinc-950 border-zinc-800" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700">Create Loan</Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="investment">
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 mt-4">
          <CardContent className="pt-6">
            <form action={handleInvestment} className="space-y-4">
              <div className="space-y-2">
                <Label>Select User / Manager</Label>
                <select name="user_id" required className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100">
                  <option value="">-- Select Family Member --</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Principal Invested (₹)</Label>
                  <Input name="principal_amount" type="number" required className="bg-zinc-950 border-zinc-800" />
                </div>
                <div className="space-y-2">
                  <Label>Expected Monthly Profit (₹)</Label>
                  <Input name="expected_monthly_profit" type="number" required className="bg-zinc-950 border-zinc-800" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input name="start_date" type="date" required className="bg-zinc-950 border-zinc-800" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">Create Investment</Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="committee">
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 mt-4">
          <CardContent className="pt-6">
            <form action={handleCommittee} className="space-y-4">
              <div className="space-y-2">
                <Label>Select User</Label>
                <select name="user_id" required className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100">
                  <option value="">-- Select Family Member --</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Amount (₹)</Label>
                  <Input name="total_amount" type="number" required className="bg-zinc-950 border-zinc-800" />
                </div>
                <div className="space-y-2">
                  <Label>Monthly Installment (₹)</Label>
                  <Input name="monthly_installment" type="number" required className="bg-zinc-950 border-zinc-800" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input name="start_date" type="date" required className="bg-zinc-950 border-zinc-800" />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input name="end_date" type="date" required className="bg-zinc-950 border-zinc-800" />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-pink-600 hover:bg-pink-700">Create Committee</Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
