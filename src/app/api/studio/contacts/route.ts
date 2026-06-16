import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
    try {
        const db = getSupabaseAdmin()

        const { data: subscribers, error } = await db
            .from('nurture_subscribers')
            .select('*')
            .order('subscribed_at', { ascending: false })

        if (error) throw error

        const { data: sends } = await db
            .from('nurture_sends')
            .select('subscriber_id')

        const sendCounts: Record<string, number> = {}
        for (const s of sends ?? []) {
            sendCounts[s.subscriber_id] = (sendCounts[s.subscriber_id] ?? 0) + 1
        }

        const data = (subscribers ?? []).map(s => ({
            ...s,
            emails_sent: sendCounts[s.id] ?? 0,
        }))

        return NextResponse.json({ data })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const { email, name } = await req.json()
        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
        }

        const { data, error } = await getSupabaseAdmin()
            .from('nurture_subscribers')
            .upsert({ email, name: name || null }, { onConflict: 'email', ignoreDuplicates: false })
            .select()
            .single()

        if (error) throw error
        return NextResponse.json({ data }, { status: 201 })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
