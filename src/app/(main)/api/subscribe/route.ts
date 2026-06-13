import { NextResponse } from 'next/server';
import { getResend, FROM, AUDIENCE_ID } from '@/lib/resend';
import { emailTemplates } from '@/lib/emailTemplates';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { success: false, message: 'Invalid email address' },
                { status: 400 }
            );
        }

        // 1. Add to Resend Audience + nurture_subscribers (non-blocking)
        try {
            if (AUDIENCE_ID) {
                await getResend().contacts.create({ email, audienceId: AUDIENCE_ID });
            }
        } catch (contactError) {
            console.error('Resend Contact Error:', contactError);
        }

        try {
            await getSupabase()
                .from('nurture_subscribers')
                .upsert({ email, name: email.split('@')[0] }, { onConflict: 'email', ignoreDuplicates: true });
        } catch (dbError) {
            console.error('Nurture subscriber insert error:', dbError);
        }

        // 2. Send Lookbook via Resend
        const { subject, html } = emailTemplates.lookbookDelivery(email.split('@')[0]);

        const { data, error } = await getResend().emails.send({
            from: FROM,
            to: [email],
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('Resend Error:', error);
            return NextResponse.json(
                { success: false, message: 'Registration successful, but failed to send email. Please contact us.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Lookbook is on its way!"
        });

    } catch (error) {
        console.error('Subscription Route Error:', error);
        return NextResponse.json(
            { success: false, message: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
