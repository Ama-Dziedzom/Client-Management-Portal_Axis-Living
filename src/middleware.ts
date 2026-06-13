import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    let res = NextResponse.next({
        request: req,
    })

    const pathname = req.nextUrl.pathname
    const isStudioRoute = pathname === '/studio' || pathname.startsWith('/studio/')
    const isStudioLogin = pathname === '/studio-login'

    // IMPORTANT: /studio-login must use the studio cookie so that when we check
    // if the user is already authenticated for studio, we look at the correct session.
    // Previously this used the client cookie, which caused infinite redirect loops when
    // the user had a valid client session + was in studio_users table.
    const isStudioDomain = isStudioRoute || isStudioLogin
    const cookieName = isStudioDomain ? 'sb-axis-studio-token' : 'sb-axis-client-token'

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
            cookieOptions: {
                name: cookieName,
            },
        }
    )

    const { data: { user }, error } = await supabase.auth.getUser()

    // Define route zones with precise matching logic
    const clientProtectedPaths = ['/dashboard', '/projects', '/documents', '/invoices', '/messages', '/settings']
    const isClientRoute = clientProtectedPaths.some(path => pathname === path || pathname.startsWith(path + '/'))

    // ── Not logged in ──
    if (!user || error) {
        if (isClientRoute) {
            return NextResponse.redirect(new URL('/login', req.url))
        }
        if (isStudioRoute) {
            return NextResponse.redirect(new URL('/studio-login', req.url))
        }
        if (pathname === '/') {
            return NextResponse.redirect(new URL('/login', req.url))
        }
        // Not logged in + on /studio-login or /login → let them see the page
        return res
    }

    // ── Logged in: Role-based Protection ──

    // 1. Redirect logged-in studio users away from /studio-login
    if (isStudioLogin) {
        const { data: studioUser } = await supabase.from('studio_users').select('id').eq('id', user.id).maybeSingle()
        if (studioUser) {
            return NextResponse.redirect(new URL('/studio', req.url))
        }
        // They have a studio session but are NOT in studio_users.
        // Let them stay on the login page (they might need to log in with different credentials).
        return res
    }

    // 2. Protect Studio Routes (only allow if in studio_users)
    if (isStudioRoute) {
        const { data: studioUser } = await supabase
            .from('studio_users')
            .select('id')
            .eq('id', user.id)
            .maybeSingle()

        if (!studioUser) {
            // Not a studio user → redirect to studio-login (don't try to cross-redirect to /dashboard
            // because we're using the studio cookie here, not the client cookie)
            return NextResponse.redirect(new URL('/studio-login', req.url))
        }
        // Is a valid studio user → let through
        return res
    }

    // 3. Protect Client Routes (only allow if in clients table)
    if (isClientRoute) {
        const { data: clientUser } = await supabase
            .from('clients')
            .select('id')
            .eq('id', user.id)
            .maybeSingle()

        if (!clientUser) {
            // Not a client. Check if they are a studio user.
            const { data: studioUser } = await supabase
                .from('studio_users')
                .select('id')
                .eq('id', user.id)
                .maybeSingle()

            if (studioUser) {
                // They are a studio user, send them to the studio panel
                return NextResponse.redirect(new URL('/studio', req.url))
            }
            
            // Neither? Allow to avoid infinite loops.
            return res
        }
    }

    // 4. Redirect logged-in users away from /
    if (pathname === '/') {
        const { data: studioUser } = await supabase.from('studio_users').select('id').eq('id', user.id).maybeSingle()
        if (studioUser) return NextResponse.redirect(new URL('/studio', req.url))
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // 5. Redirect logged-in users away from /login
    if (pathname === '/login') {
        const { data: clientUser } = await supabase.from('clients').select('id').eq('id', user.id).maybeSingle()
        if (clientUser) return NextResponse.redirect(new URL('/dashboard', req.url))
        
        // They have a client cookie session but aren't in clients table.
        // Let them stay on /login.
        return res
    }

    return res
}

export const config = {
    matcher: [
        '/',
        '/dashboard',
        '/dashboard/:path*',
        '/projects',
        '/projects/:path*',
        '/documents',
        '/documents/:path*',
        '/invoices',
        '/invoices/:path*',
        '/messages',
        '/messages/:path*',
        '/settings',
        '/settings/:path*',
        '/studio',
        '/studio/:path*',
        '/studio-login',
        '/login',
    ]
}
