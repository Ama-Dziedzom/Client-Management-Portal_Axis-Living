import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
    try {
        const db = getSupabaseAdmin()
        const { data, error } = await db
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('Failed to fetch bookings:', error)
        return NextResponse.json({ success: false, data: [] }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    try {
        const { id, status } = await req.json()
        if (!id || !status) {
            return NextResponse.json({ success: false }, { status: 400 })
        }

        const db = getSupabaseAdmin()
        const { error } = await db.from('bookings').update({ status }).eq('id', id)
        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to update booking:', error)
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
