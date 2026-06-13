import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { getResend, FROM } from '@/lib/resend';

// Converts plain text body + [BUTTON: Label | URL] syntax to HTML
function renderBody(raw: string, name: string): string {
    const replaced = raw.replace(/\{\{name\}\}/gi, name);

    const paragraphs = replaced.split(/\n\n+/).map(block => {
        const btnMatch = block.match(/^\[BUTTON:\s*(.+?)\s*\|\s*(.+?)\]$/);
        if (btnMatch) {
            return `<div style="text-align:center;margin:32px 0;">
  <a href="${btnMatch[2].trim()}" style="display:inline-block;background:#2F402C;color:#fff;padding:16px 40px;border-radius:99px;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${btnMatch[1].trim()}</a>
</div>`;
        }
        return `<p style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#6B7280;">${block.replace(/\n/g, '<br/>')}</p>`;
    });

    return paragraphs.join('\n');
}

function wrapEmail(subject: string, bodyHtml: string): string {
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://axisliving.co.zm';
    return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#F2EBE3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F2EBE3;padding:48px 20px 64px;">
    <tr><td align="center">
      <div style="margin-bottom:32px;">
        <img src="${SITE_URL}/axis-living.png" alt="Axis Living" width="120" style="height:auto;display:block;margin:0 auto;filter:brightness(0);" />
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(47,64,44,0.08);">
        <tr><td style="padding:44px 52px 52px;">${bodyHtml}</td></tr>
        <tr><td style="border-top:1px solid #E5E7EB;padding:24px 52px;text-align:center;">
          <p style="margin:0 0 8px;font-size:11px;color:#9CA3AF;letter-spacing:1px;">© ${new Date().getFullYear()} Axis Living · Lusaka, Zambia</p>
          <p style="margin:0;font-size:11px;"><a href="mailto:hello@axisliving.co.zm" style="color:#C6B9AA;text-decoration:none;">hello@axisliving.co.zm</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: Request) {
    // Verify cron secret
    const auth = req.headers.get('authorization');
    const secret = process.env.CRON_SECRET;
    if (!secret || auth !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getSupabase();

    // Fetch active nurture emails
    const { data: emails, error: emailsError } = await db
        .from('nurture_emails')
        .select('*')
        .eq('active', true)
        .order('sequence_order', { ascending: true });

    if (emailsError || !emails?.length) {
        return NextResponse.json({ sent: 0, message: 'No active nurture emails' });
    }

    // Fetch all subscribers
    const { data: subscribers, error: subError } = await db
        .from('nurture_subscribers')
        .select('id, email, name, subscribed_at');

    if (subError || !subscribers?.length) {
        return NextResponse.json({ sent: 0, message: 'No subscribers' });
    }

    // Fetch all existing sends
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
            const bodyHtml = renderBody(email.body, name);
            const html = wrapEmail(email.subject, bodyHtml);
            const subject = email.subject.replace(/\{\{name\}\}/gi, name);

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
