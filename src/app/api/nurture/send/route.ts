import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getResend, FROM } from '@/lib/resend';
import { wrap, btn, randomImage } from '@/lib/emailTemplates';

function buildNurtureEmail(raw: string, name: string, subject: string): string {
    const replaced = raw.replace(/\{\{name\}\}/gi, name);
    const blocks = replaced.split(/\n\n+/).map((b: string) => b.trim()).filter(Boolean);

    let idx = 0;
    if (blocks[0]?.match(/^(hi|hello)\b/i)) idx = 1;

    const remaining = blocks.slice(idx);
    const bodyText: string = remaining[0]?.replace(/\n/g, ' ') ?? '';

    const contentParts = remaining.slice(1).map((block: string) => {
        const btnMatch = block.match(/^\[BUTTON:\s*(.+?)\s*\|\s*(.+?)\]$/);
        if (btnMatch) return btn(btnMatch[1].trim(), btnMatch[2].trim());
        return `<p style="margin:18px 0 0;font-size:15px;line-height:1.75;color:#6B7280;text-align:center;">${block.replace(/\n/g, '<br/>')}</p>`;
    });

    contentParts.push(`<p style="margin:36px 0 0;font-style:italic;font-family:Georgia,serif;font-size:16px;color:#2F402C;text-align:center;">Kas</p>`);

    return wrap({
        image: randomImage(),
        heading: subject.replace(/\{\{name\}\}/gi, name),
        body: bodyText,
        content: contentParts.join('\n'),
        note: 'You received this because you signed up at axisliving.co.zm. Reply to unsubscribe.',
    });
}

export async function POST(req: Request) {
    const auth = req.headers.get('authorization');
    const secret = process.env.CRON_SECRET;
    if (!secret || auth !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getSupabaseAdmin();

    const { data: emails, error: emailsError } = await db
        .from('nurture_emails')
        .select('*')
        .eq('active', true)
        .order('sequence_order', { ascending: true });

    if (emailsError || !emails?.length) {
        return NextResponse.json({ sent: 0, message: 'No active nurture emails' });
    }

    const { data: subscribers, error: subError } = await db
        .from('nurture_subscribers')
        .select('id, email, name, subscribed_at');

    if (subError || !subscribers?.length) {
        return NextResponse.json({ sent: 0, message: 'No subscribers' });
    }

    const { data: sends } = await db
        .from('nurture_sends')
        .select('subscriber_id, nurture_email_id');

    const sentSet = new Set(
        (sends ?? []).map((s: { subscriber_id: string; nurture_email_id: string }) =>
            `${s.subscriber_id}:${s.nurture_email_id}`
        )
    );

    const now = new Date();
    let sent = 0;
    const errors: string[] = [];

    for (const subscriber of subscribers) {
        const subscribedAt = new Date(subscriber.subscribed_at);

        for (const email of emails) {
            const key = `${subscriber.id}:${email.id}`;
            if (sentSet.has(key)) continue;

            const dueDate = new Date(subscribedAt);
            dueDate.setDate(dueDate.getDate() + email.delay_days);
            if (dueDate > now) continue;

            const name = subscriber.name || subscriber.email.split('@')[0];
            const subject = email.subject.replace(/\{\{name\}\}/gi, name);
            const html = buildNurtureEmail(email.body, name, email.subject);

            try {
                const { error: sendError } = await getResend().emails.send({
                    from: FROM,
                    to: [subscriber.email],
                    subject,
                    html,
                });

                if (sendError) throw sendError;

                await db.from('nurture_sends').insert({
                    subscriber_id: subscriber.id,
                    nurture_email_id: email.id,
                });

                sent++;
            } catch (err) {
                errors.push(`${subscriber.email} / email ${email.sequence_order}: ${err}`);
            }
        }
    }

    return NextResponse.json({ sent, errors: errors.length ? errors : undefined });
}
