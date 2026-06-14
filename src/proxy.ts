import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

export async function proxy(req: NextRequest) {
    // Skip if Supabase isn't configured (e.g. during build)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return NextResponse.next()
    }

    try {
        const res = NextResponse.next({ request: req })
        const pathname = req.nextUrl.pathname
        const zone = getZone(req)

        // ── STUDIO SUBDOMAIN ── studio.axis-living.com
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

        // ── LOCAL / VERCEL URL ── path-based fallback
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

        if (isStudioLogin) {
            const { data: studioUser } = await supabase.from('studio_users').select('id').eq('id', user.id).maybeSingle()
            if (studioUser) return NextResponse.redirect(new URL('/studio', req.url))
            return res
        }

        if (isStudioRoute) {
            const { data: studioUser } = await supabase.from('studio_users').select('id').eq('id', user.id).maybeSingle()
            if (!studioUser) return NextResponse.redirect(new URL('/login', req.url))
            return res
        }

        if (isClientRoute) {
            const { data: clientUser } = await supabase.from('clients').select('id').eq('id', user.id).maybeSingle()
            if (!clientUser) {
                const { data: studioUser } = await supabase.from('studio_users').select('id').eq('id', user.id).maybeSingle()
                if (studioUser) return NextResponse.redirect(new URL('/studio', req.url))
                return res
            }
        }

        if (pathname === '/' || isClientLogin) {
            const { data: studioUser } = await supabase.from('studio_users').select('id').eq('id', user.id).maybeSingle()
            if (studioUser) return NextResponse.redirect(new URL('/studio', req.url))
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }

        return res
    } catch {
        // Never return 500 from middleware — let the request through
        return NextResponse.next()
    }
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.webp|.*\\.pdf).*)'],
}
