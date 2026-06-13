import { NextResponse } from 'next/server';
import { getResend, FROM, AUDIENCE_ID } from '@/lib/resend';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { emailTemplates } from '@/lib/emailTemplates';

export async function POST(req: Request) {
    const auth = req.headers.get('authorization');
    const secret = process.env.EMAIL_SECRET;
    if (!secret || auth !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { email, name } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
        }

        const displayName = name || email.split('@')[0];

        if (AUDIENCE_ID) {
            try {
                await getResend().contacts.create({ email, audienceId: AUDIENCE_ID });
            } catch (e) {
                console.error('Resend contact error:', e);
            }
        }

        try {
            await getSupabaseAdmin()
                .from('nurture_subscribers')
                .upsert({ email, name: displayName }, { onConflict: 'email', ignoreDuplicates: true });
        } catch (e) {
            console.error('Nurture subscriber error:', e);
        }

        const { data: tpl } = await getSupabaseAdmin().from('email_templates').select('*').eq('id', 'lookbook_delivery').single();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { subject, html } = (emailTemplates as any).lookbookDelivery(displayName, tpl ?? {});
        const { error } = await getResend().emails.send({ from: FROM, to: [email], subject, html });

        if (error) {
            console.error('Lookbook email error:', error);
            return NextResponse.json(
                { success: false, message: 'Registration successful, but failed to send email. Please contact us.' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: 'Lookbook is on its way!' });
    } catch (error) {
        console.error('Lookbook route error:', error);
        return NextResponse.json({ success: false, message: 'Something went wrong. Please try again.' }, { status: 500 });
    }
}
