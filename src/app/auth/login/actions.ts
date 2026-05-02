'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/auth/login?message=Could not authenticate user')
  }

  revalidatePath('/', 'layout')
  
  // To handle redirect based on role, fetch profile
  const { data: userData } = await supabase.auth.getUser()
  if (userData?.user) {
     const { data: profile } = await supabase.from('profiles').select('role').eq('id', userData.user.id).single()
     if (profile?.role === 'admin') {
         redirect('/admin')
     }
  }

  redirect('/borrower')
}
