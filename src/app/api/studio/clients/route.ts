import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { getResend, FROM } from '@/lib/resend'
import { emailTemplates } from '@/lib/emailTemplates'

export async function GET() {
    try {
        const supabase = getSupabaseAdmin()
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const { name, email, phone, password } = await req.json()

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
        }
        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
        }

        const supabase = getSupabaseAdmin()

        // Create auth user — email confirmed immediately so they can log in right away
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        })
        if (authError) throw authError

        const userId = authData.user.id

        // Insert client profile (id mirrors auth user id)
        const { error: clientError } = await supabase
            .from('clients')
            .insert({ id: userId, name, email, phone: phone || null, active: true })
        if (clientError) {
            // Roll back the auth user so we don't leave orphaned accounts
            await supabase.auth.admin.deleteUser(userId)
            throw clientError
        }

        // Send welcome email with portal credentials
        const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://client-axis-living.vercel.app'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { subject, html } = (emailTemplates as any).portalWelcome(name, email, password, portalUrl)

        const { error: emailError } = await getResend().emails.send({
            from: FROM,
            to: [email],
            subject,
            html,
        })
        if (emailError) {
            // Non-fatal — client is created, just log the failure
            console.error('Welcome email failed:', emailError)
        }

        return NextResponse.json({ userId }, { status: 201 })
    } catch (error: any) {
        console.error('Create client error:', error)
        return NextResponse.json({ error: error.message || 'Failed to create client' }, { status: 500 })
    }
}
