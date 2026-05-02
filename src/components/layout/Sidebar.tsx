'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Users, CreditCard, ListTodo, Settings, LogOut } from 'lucide-react'

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
    color: 'text-indigo-400',
  },
  {
    label: 'Create Asset',
    icon: CreditCard,
    href: '/admin/create',
    color: 'text-emerald-400',
  },
  {
    label: 'Loans',
    icon: CreditCard,
    href: '/admin/loans',
    color: 'text-emerald-400',
  },
  {
    label: 'Committee',
    icon: ListTodo,
    href: '/admin/committee',
    color: 'text-pink-400',
  },
  {
    label: 'Requests',
    icon: Users,
    href: '/admin/requests',
    color: 'text-orange-400',
  },
  {
    label: 'Users',
    icon: Settings,
    href: '/admin/users',
    color: 'text-zinc-400',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-zinc-900 border-r border-zinc-800 text-zinc-100">
      <div className="px-3 py-2 flex-1">
        <Link href="/admin" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold tracking-tight text-white">Family Ledger</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-zinc-800 rounded-lg transition',
                pathname === route.href ? 'text-white bg-zinc-800' : 'text-zinc-400'
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
