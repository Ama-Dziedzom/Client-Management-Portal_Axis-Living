import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll().map(({ name, value }) => ({ name, value }))
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        req.cookies.set({ name, value })
                        res.cookies.set({ name, value, ...options })
                    })
                },
            },
        }
    )

    const { data: { session } } = await supabase.auth.getSession()
    const pathname = req.nextUrl.pathname

    // Client portal protected routes
    const clientProtectedPaths = ['/dashboard', '/projects', '/documents', '/invoices', '/messages', '/settings']
    const isClientProtected = clientProtectedPaths.some(path => pathname.startsWith(path))

    // Studio protected routes (but not /studio-login)
    const isStudioProtected = pathname.startsWith('/studio') && !pathname.startsWith('/studio-login')

    // Protect client portal routes
    if (!session && isClientProtected) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    // Protect studio routes
    if (!session && isStudioProtected) {
        return NextResponse.redirect(new URL('/studio-login', req.url))
    }

    // Redirect logged-in users away from client login page
    if (session && pathname === '/login') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Redirect logged-in users away from studio login page
    if (session && pathname === '/studio-login') {
        return NextResponse.redirect(new URL('/studio', req.url))
    }

    return res
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/projects/:path*',
        '/documents/:path*',
        '/invoices/:path*',
        '/messages/:path*',
        '/settings/:path*',
        '/studio/:path*',
        '/studio-login',
        '/login',
    ]
}
