import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

// GET /api/studio/bookings — list all bookings, newest first
export async function GET() {
    try {
        const supabase = getSupabaseAdmin()
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('date', { ascending: false })

        if (error) throw error
        return NextResponse.json({ data })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PATCH /api/studio/bookings — update booking status
export async function PATCH(req: Request) {
    try {
        const { id, status } = await req.json()
        if (!id || !status) {
            return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
        }

        const supabase = getSupabaseAdmin()
        const { data, error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return NextResponse.json({ data })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
