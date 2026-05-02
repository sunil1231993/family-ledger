import Link from 'next/link'
import { LogOut, User } from 'lucide-react'

export default function BorrowerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="border-b border-zinc-800 bg-zinc-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/borrower" className="font-bold text-xl tracking-tight text-white">
            Family Ledger
          </Link>
          <div className="flex items-center gap-4">
             <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-medium">
               <User className="h-4 w-4" />
             </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
