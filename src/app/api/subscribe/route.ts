import { NextResponse } from 'next/server';
import { resend, FROM, AUDIENCE_ID } from '@/lib/resend';
import { emailTemplates } from '@/lib/emailTemplates';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { success: false, message: 'Invalid email address' },
                { status: 400 }
            );
        }

        // 1. Add to Resend Audience (Newsletter List)
        try {
            if (AUDIENCE_ID) {
                await resend.contacts.create({
                    email,
                    audienceId: AUDIENCE_ID,
                });
            }
        } catch (contactError) {
            console.error('Resend Contact Error:', contactError);
            // Non-blocking, still send the lookbook
        }

        // 2. Send Lookbook via Resend
        const { subject, html } = emailTemplates.lookbookDelivery(email.split('@')[0]);

        const { data, error } = await resend.emails.send({
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
