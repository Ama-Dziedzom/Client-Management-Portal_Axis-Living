import { NextResponse } from 'next/server';
import { getResend, FROM } from '@/lib/resend';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { emailTemplates } from '@/lib/emailTemplates';

export async function POST(req: Request) {
    const auth = req.headers.get('authorization');
    const secret = process.env.EMAIL_SECRET;
    if (!secret || auth !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const {
            name,
            email,
            invoiceNumber,
            dueDate,
            projectTitle,
            total,
            currency = 'ZMW',
            portalUrl = '',
            daysOverdue = 0,
        } = await req.json();

        if (!name || !email || !invoiceNumber || !dueDate || !projectTitle || total == null) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data: tpl } = await getSupabaseAdmin().from('email_templates').select('*').eq('id', 'invoice_reminder').single();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { subject, html } = (emailTemplates as any).invoiceReminder(
            name, invoiceNumber, dueDate, projectTitle, total, currency, portalUrl, daysOverdue, tpl ?? {}
        );

        const { error } = await getResend().emails.send({ from: FROM, to: [email], subject, html });

        if (error) {
            console.error('Invoice reminder email error:', error);
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Invoice reminder route error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
