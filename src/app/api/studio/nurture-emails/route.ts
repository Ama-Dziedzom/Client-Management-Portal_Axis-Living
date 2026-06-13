import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

// GET /api/studio/nurture-emails — list all, ordered by sequence_order
export async function GET() {
    try {
        const supabase = getSupabaseAdmin()
        const { data, error } = await supabase
            .from('nurture_emails')
            .select('*')
            .order('sequence_order', { ascending: true })

        if (error) throw error
        return NextResponse.json({ data })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST /api/studio/nurture-emails — create a new email
export async function POST(req: Request) {
    try {
        const { subject, body, delay_days } = await req.json()

        const supabase = getSupabaseAdmin()

        // Assign next sequence_order
        const { data: existing } = await supabase
            .from('nurture_emails')
            .select('sequence_order')
            .order('sequence_order', { ascending: false })
            .limit(1)

        const nextOrder = (existing?.[0]?.sequence_order ?? 0) + 1

        const { data, error } = await supabase
            .from('nurture_emails')
            .insert({ subject, body, delay_days: delay_days ?? 0, sequence_order: nextOrder, active: true })
            .select()
            .single()

        if (error) throw error
        return NextResponse.json({ data }, { status: 201 })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
