import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const db = getSupabaseAdmin()

        await db.from('nurture_sends').delete().eq('subscriber_id', id)
        const { error } = await db.from('nurture_subscribers').delete().eq('id', id)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
