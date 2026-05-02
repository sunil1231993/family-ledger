import { createClient } from '@/lib/supabase/server'
import { CreationForms } from './CreationForms'

export default async function AdminCreatePage() {
  const supabase = await createClient()

  // Fetch all profiles to populate the user dropdowns
  const { data: users } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .order('full_name')

  return (
    <div className="p-8 space-y-8 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Asset</h2>
        <p className="text-zinc-400 mt-2">Add a new Loan, Investment, or Committee for a family member.</p>
      </div>

      <CreationForms users={users || []} />
    </div>
  )
}
