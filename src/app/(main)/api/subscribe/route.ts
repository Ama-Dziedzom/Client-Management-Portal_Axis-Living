import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { success: false, message: 'Invalid email address' },
                { status: 400 }
            );
        }

        const portalUrl = process.env.PORTAL_URL;
        const emailSecret = process.env.EMAIL_SECRET;

        if (!portalUrl || !emailSecret) {
            console.error('PORTAL_URL or EMAIL_SECRET not configured');
            return NextResponse.json(
                { success: false, message: 'Email service not configured' },
                { status: 500 }
            );
        }

        const res = await fetch(`${portalUrl}/api/email/lookbook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${emailSecret}` },
            body: JSON.stringify({ email }),
        });

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            console.error('Portal lookbook error:', body);
            return NextResponse.json(
                { success: false, message: 'Registration successful, but failed to send email. Please contact us.' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: 'Lookbook is on its way!' });

    } catch (error) {
        console.error('Subscription Route Error:', error);
        return NextResponse.json(
            { success: false, message: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
