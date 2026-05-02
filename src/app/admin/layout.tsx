import { Sidebar } from '@/components/layout/Sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full relative bg-zinc-950 text-zinc-100">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-zinc-900">
        <Sidebar />
      </div>
      <main className="md:pl-72 pb-10 bg-zinc-950 min-h-screen">
        {children}
      </main>
    </div>
  )
}
