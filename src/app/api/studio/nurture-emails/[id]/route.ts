import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

// PATCH /api/studio/nurture-emails/[id] — update subject, body, delay_days, active, or sequence_order
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const updates = await req.json()

        const supabase = getSupabaseAdmin()
        const { data, error } = await supabase
            .from('nurture_emails')
            .update({ ...updates, updated_at: new Date().toISOString() })
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

// DELETE /api/studio/nurture-emails/[id]
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params

        const supabase = getSupabaseAdmin()
        const { error } = await supabase
            .from('nurture_emails')
            .delete()
            .eq('id', id)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
