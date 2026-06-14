import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes:
//   client.axis-living.com/client  → client login
//   studio.axis-living.com/login   → studio login
//   localhost uses path-based fallback (same routes)

type Zone = 'studio' | 'portal' | 'local'

function getZone(req: NextRequest): Zone {
    const host = req.headers.get('host') ?? ''
    if (host.startsWith('studio.')) return 'studio'
    if (host.startsWith('client.') || host.startsWith('portal.')) return 'portal'
    return 'local'
}

function makeSupabase(req: NextRequest, res: NextResponse, cookieName: string) {
    return createServerClient(
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
            cookieOptions: { name: cookieName },
        }
    )
}

export async function middleware(req: NextRequest) {
    const res = NextResponse.next({ request: req })
    const pathname = req.nextUrl.pathname
    const zone = getZone(req)

    // ── STUDIO SUBDOMAIN ── studio.axis-living.com
    // Login page: /login   Dashboard: /studio
    if (zone === 'studio') {
        const supabase = makeSupabase(req, res, 'sb-axis-studio-token')
        const { data: { user }, error } = await supabase.auth.getUser()

        if (!user || error) {
            if (pathname !== '/login') return NextResponse.redirect(new URL('/login', req.url))
            return res
        }

        const { data: studioUser } = await supabase
            .from('studio_users').select('id').eq('id', user.id).maybeSingle()

        if (!studioUser) return NextResponse.redirect(new URL('/login', req.url))

        if (pathname === '/' || pathname === '/login') {
            return NextResponse.redirect(new URL('/studio', req.url))
        }

        return res
    }

    // ── PORTAL SUBDOMAIN ── portal.axis-living.com
    // Login page: /client   Dashboard: /dashboard
    if (zone === 'portal') {
        const supabase = makeSupabase(req, res, 'sb-axis-client-token')
        const { data: { user }, error } = await supabase.auth.getUser()

        if (!user || error) {
            if (pathname !== '/client') return NextResponse.redirect(new URL('/client', req.url))
            return res
        }

        const { data: clientUser } = await supabase
            .from('clients').select('id').eq('id', user.id).maybeSingle()

        if (!clientUser) return NextResponse.redirect(new URL('/client', req.url))

        if (pathname === '/' || pathname === '/client') {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }

        return res
    }

    // ── LOCAL DEVELOPMENT ── localhost (path-based fallback)
    // Client login: /client   Studio login: /login
    const isStudioRoute = pathname === '/studio' || pathname.startsWith('/studio/')
    const isStudioLogin = pathname === '/login'
    const isClientLogin = pathname === '/client'
    const isStudioContext = isStudioRoute || isStudioLogin
    const clientProtectedPaths = ['/dashboard', '/projects', '/documents', '/invoices', '/messages', '/settings']
    const isClientRoute = clientProtectedPaths.some(p => pathname === p || pathname.startsWith(p + '/'))

    const supabase = makeSupabase(req, res, isStudioContext ? 'sb-axis-studio-token' : 'sb-axis-client-token')
    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user || error) {
        if (isClientRoute || pathname === '/') return NextResponse.redirect(new URL('/client', req.url))
        if (isStudioRoute) return NextResponse.redirect(new URL('/login', req.url))
        return res
    }

    // Authenticated studio user on /login → send to /studio
    if (isStudioLogin) {
        const { data: studioUser } = await supabase.from('studio_users').select('id').eq('id', user.id).maybeSingle()
        if (studioUser) return NextResponse.redirect(new URL('/studio', req.url))
        return res
    }

    // Protect studio routes
    if (isStudioRoute) {
        const { data: studioUser } = await supabase.from('studio_users').select('id').eq('id', user.id).maybeSingle()
        if (!studioUser) return NextResponse.redirect(new URL('/login', req.url))
        return res
    }

    // Protect client routes
    if (isClientRoute) {
        const { data: clientUser } = await supabase.from('clients').select('id').eq('id', user.id).maybeSingle()
        if (!clientUser) {
            const { data: studioUser } = await supabase.from('studio_users').select('id').eq('id', user.id).maybeSingle()
            if (studioUser) return NextResponse.redirect(new URL('/studio', req.url))
            return res
        }
    }

    // Authenticated user hitting / or /client → send to their dashboard
    if (pathname === '/' || isClientLogin) {
        const { data: studioUser } = await supabase.from('studio_users').select('id').eq('id', user.id).maybeSingle()
        if (studioUser) return NextResponse.redirect(new URL('/studio', req.url))
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return res
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.webp|.*\\.pdf).*)'],
}
