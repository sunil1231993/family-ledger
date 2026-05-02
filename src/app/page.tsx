import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect the root URL to the borrower dashboard.
  // Our middleware will automatically intercept this and send 
  // unauthenticated users to /auth/login, and Admins to /admin!
  redirect('/borrower')
}
