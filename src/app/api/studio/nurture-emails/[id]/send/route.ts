import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { getResend, FROM } from '@/lib/resend'
import { wrap, btn, randomImage } from '@/lib/emailTemplates'

function buildNurtureEmail(raw: string, name: string, subject: string): string {
    const replaced = raw.replace(/\{\{name\}\}/gi, name)
    const blocks = replaced.split(/\n\n+/).map((b: string) => b.trim()).filter(Boolean)

    let idx = 0
    if (blocks[0]?.match(/^(hi|hello)\b/i)) idx = 1

    const remaining = blocks.slice(idx)
    const bodyText: string = remaining[0]?.replace(/\n/g, ' ') ?? ''

    const contentParts = remaining.slice(1).map((block: string) => {
        const btnMatch = block.match(/^\[BUTTON:\s*(.+?)\s*\|\s*(.+?)\]$/)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (btnMatch) return (btn as any)(btnMatch[1].trim(), btnMatch[2].trim())
        return `<p style="margin:18px 0 0;font-size:15px;line-height:1.75;color:#6B7280;text-align:center;">${block.replace(/\n/g, '<br/>')}</p>`
    })

    contentParts.push(`<p style="margin:36px 0 0;font-style:italic;font-family:Georgia,serif;font-size:16px;color:#2F402C;text-align:center;">Kas</p>`)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (wrap as any)({
        image: (randomImage as any)(),
        heading: subject.replace(/\{\{name\}\}/gi, name),
        body: bodyText,
        content: contentParts.join('\n'),
        note: 'You received this because you signed up at axisliving.co.zm. Reply to unsubscribe.',
    })
}

// POST /api/studio/nurture-emails/[id]/send
// Body: { subscriber_id?: string }  — omit to send to all contacts
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await req.json().catch(() => ({}))
        // subscriber_id: single contact, subscriber_ids: array of contacts, neither: all contacts
        const subscriber_id: string | undefined = body.subscriber_id
        const subscriber_ids: string[] | undefined = body.subscriber_ids

        const db = getSupabaseAdmin()

        const { data: email, error: emailError } = await db
            .from('nurture_emails')
            .select('*')
            .eq('id', id)
            .single()

        if (emailError || !email) {
            return NextResponse.json({ error: 'Email not found' }, { status: 404 })
        }

        // Resolve target subscribers
        let subscribers: { id: string; email: string; name: string | null }[] = []
        if (subscriber_ids?.length) {
            const { data } = await db
                .from('nurture_subscribers')
                .select('id, email, name')
                .in('id', subscriber_ids)
            subscribers = data ?? []
        } else if (subscriber_id) {
            const { data } = await db
                .from('nurture_subscribers')
                .select('id, email, name')
                .eq('id', subscriber_id)
                .single()
            if (data) subscribers = [data]
        } else {
            const { data } = await db
                .from('nurture_subscribers')
                .select('id, email, name')
            subscribers = data ?? []
        }

        if (!subscribers.length) {
            return NextResponse.json({ sent: 0, message: 'No subscribers found' })
        }

        // Fetch existing sends so we don't double-send
        const { data: existingSends } = await db
            .from('nurture_sends')
            .select('subscriber_id')
            .eq('nurture_email_id', id)
            .in('subscriber_id', subscribers.map(s => s.id))

        const alreadySent = new Set((existingSends ?? []).map((s: { subscriber_id: string }) => s.subscriber_id))

        let sent = 0
        const errors: string[] = []

        for (const subscriber of subscribers) {
            if (alreadySent.has(subscriber.id)) continue

            const name = subscriber.name || subscriber.email.split('@')[0]
            const subject = email.subject.replace(/\{\{name\}\}/gi, name)
            const html = buildNurtureEmail(email.body, name, email.subject)

            try {
                const { error: sendError } = await getResend().emails.send({
                    from: FROM,
                    to: [subscriber.email],
                    subject,
                    html,
                })

                if (sendError) throw sendError

                await db.from('nurture_sends').insert({
                    subscriber_id: subscriber.id,
                    nurture_email_id: id,
                })

                sent++
            } catch (err) {
                errors.push(`${subscriber.email}: ${err}`)
            }
        }

        return NextResponse.json({ sent, skipped: subscribers.length - alreadySent.size - sent, errors: errors.length ? errors : undefined })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
