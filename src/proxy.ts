import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

type Zone = 'studio' | 'portal' | 'local'

function getZone(req: NextRequest): Zone {
    const host = req.headers.get('host') ?? ''
    if (host.startsWith('studio.')) return 'studio'
    if (host.startsWith('client.') || host.startsWith('portal.')) return 'portal'
    return 'local'
}

function hasSession(req: NextRequest, cookieName: string): boolean {
    return req.cookies.getAll().some(c => c.name.startsWith(cookieName))
}

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl
    const zone = getZone(req)

    // Static assets and API routes — always pass through
    if (pathname.startsWith('/api/')) return NextResponse.next()

    const studioSession = hasSession(req, 'sb-axis-studio-token')
    const clientSession = hasSession(req, 'sb-axis-client-token')

    // ── STUDIO SUBDOMAIN ──
    if (zone === 'studio') {
        if (!studioSession && pathname !== '/login') {
            return NextResponse.redirect(new URL('/login', req.url))
        }
        if (studioSession && (pathname === '/' || pathname === '/login')) {
            return NextResponse.redirect(new URL('/studio', req.url))
        }
        return NextResponse.next()
    }

    // ── PORTAL SUBDOMAIN ──
    if (zone === 'portal') {
        if (!clientSession && pathname !== '/client') {
            return NextResponse.redirect(new URL('/client', req.url))
        }
        if (clientSession && (pathname === '/' || pathname === '/client')) {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
        return NextResponse.next()
    }

    // ── LOCAL / VERCEL PATH-BASED FALLBACK ──
    const studioProtected = pathname === '/studio' || pathname.startsWith('/studio/')
    const clientProtected = ['/dashboard', '/projects', '/documents', '/invoices', '/messages', '/settings']
        .some(p => pathname === p || pathname.startsWith(p + '/'))

    if (studioProtected && !studioSession) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if (clientProtected && !clientSession) {
        return NextResponse.redirect(new URL('/client', req.url))
    }

    if (pathname === '/' || pathname === '/client') {
        if (clientSession) return NextResponse.redirect(new URL('/dashboard', req.url))
        if (pathname === '/') return NextResponse.redirect(new URL('/client', req.url))
    }

    if (pathname === '/login') {
        if (studioSession) return NextResponse.redirect(new URL('/studio', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.webp|.*\\.pdf).*)'],
}
