import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define protected routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isBorrowerRoute = request.nextUrl.pathname.startsWith('/borrower')

  if (!user && (isAdminRoute || isBorrowerRoute)) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    // Basic protection: Ideally we check role here via a fetch to 'profiles'
    // but doing DB fetch on every middleware call can be heavy.
    // For now, if user tries to go to login, redirect to borrower (or admin if we knew).
    if (request.nextUrl.pathname === '/auth/login') {
      const url = request.nextUrl.clone()
      url.pathname = '/borrower' // fallback
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
