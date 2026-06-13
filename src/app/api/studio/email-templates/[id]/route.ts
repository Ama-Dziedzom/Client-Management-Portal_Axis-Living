import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await req.json()
        const allowed = ['subject', 'heading', 'body', 'note']
        const updates: Record<string, string | null> = {}
        for (const key of allowed) {
            if (key in body) updates[key] = body[key]
        }
        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
        }
        updates.updated_at = new Date().toISOString()

        const { data, error } = await getSupabaseAdmin()
            .from('email_templates')
            .update(updates)
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
