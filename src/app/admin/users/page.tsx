import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: users } = await supabase.from('profiles').select('*').order('full_name')

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Family Members</h2>
        <p className="text-zinc-400 mt-2">Manage all registered accounts.</p>
      </div>

      <div className="grid gap-4">
        {users?.map(user => (
          <Card key={user.id} className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">{user.full_name}</p>
                <p className="text-zinc-400">{user.email}</p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  {user.role.toUpperCase()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
