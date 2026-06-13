import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
    try {
        const db = getSupabaseAdmin()
        const { data, error } = await db
            .from('nurture_emails')
            .select('*')
            .order('sequence_order', { ascending: true })
        if (error) throw error
        return NextResponse.json({ success: true, data })
    } catch (error) {
        return NextResponse.json({ success: false, data: [] }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const { subject, body, delay_days } = await req.json()
        if (!subject || !body) {
            return NextResponse.json({ success: false, message: 'Subject and body are required' }, { status: 400 })
        }

        const db = getSupabaseAdmin()

        // Place at end of sequence
        const { data: last } = await db
            .from('nurture_emails')
            .select('sequence_order')
            .order('sequence_order', { ascending: false })
            .limit(1)
            .single()

        const sequence_order = (last?.sequence_order ?? 0) + 1

        const { data, error } = await db
            .from('nurture_emails')
            .insert({ subject, body, delay_days: delay_days ?? 0, sequence_order, active: true })
            .select()
            .single()

        if (error) throw error
        return NextResponse.json({ success: true, data })
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
