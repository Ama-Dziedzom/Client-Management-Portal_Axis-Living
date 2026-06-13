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
        const { name, email, date, time } = await req.json();

        if (!name || !email || !date || !time) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data: tpl } = await getSupabaseAdmin().from('email_templates').select('*').eq('id', 'booking_cancelled').single();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { subject, html } = (emailTemplates as any).bookingCancelled(name, date, time, tpl ?? {});
        const { error: clientError } = await getResend().emails.send({
            from: FROM,
            to: [email],
            subject,
            html,
        });
        if (clientError) console.error('Client cancellation email error:', clientError);

        const { error: adminError } = await getResend().emails.send({
            from: FROM,
            to: [process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL || 'hello@axisliving.co.zm'],
            subject: `Booking Cancelled: ${name}`,
            text: [
                'A client has cancelled their booking.',
                '',
                `Client: ${name}`,
                `Email:  ${email}`,
                `Date:   ${date}`,
                `Time:   ${time} (CAT)`,
            ].join('\n'),
        });
        if (adminError) console.error('Admin cancellation email error:', adminError);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Booking cancellation email error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
