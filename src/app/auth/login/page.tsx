import { login } from './actions'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Family Ledger
          </CardTitle>
          <CardDescription className="text-center text-zinc-400">
            Enter your email and password to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" action={login}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="m@example.com" 
                required 
                className="bg-zinc-950 border-zinc-800 text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="bg-zinc-950 border-zinc-800 text-zinc-100"
              />
            </div>
            {message && (
              <div className="text-sm font-medium text-red-500 text-center p-2 rounded bg-red-500/10 border border-red-500/20">
                {message}
              </div>
            )}
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
