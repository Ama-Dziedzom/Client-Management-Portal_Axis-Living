import { NextResponse } from 'next/server';
import { getResend, FROM, AUDIENCE_ID } from '@/lib/resend';
import { emailTemplates } from '@/lib/emailTemplates';
import { getSupabase } from '@/lib/supabase';

// Generates an RFC 5545 .ics calendar event for the consultation
function generateICS(name: string, email: string, date: string, time: string, meetingLink: string): string {
    const dateObj = new Date(`${date} ${time}`);
    const endObj = new Date(dateObj.getTime() + 30 * 60 * 1000);

    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const uid = `${Date.now()}-${email.replace('@', '-at-')}@axisliving.co.zm`;

    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Axis Living//Booking//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:REQUEST',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTART:${fmt(dateObj)}`,
        `DTEND:${fmt(endObj)}`,
        'SUMMARY:Discovery Call — Axis Living',
        `DESCRIPTION:Your discovery consultation with Axis Living.\\nJoin here: ${meetingLink}`,
        `LOCATION:${meetingLink}`,
        `ORGANIZER;CN=Axis Living:mailto:${process.env.RESEND_FROM_EMAIL || 'hello@axisliving.co.zm'}`,
        `ATTENDEE;ROLE=REQ-PARTICIPANT;CN=${name}:mailto:${email}`,
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n');
}

export async function POST(req: Request) {
    try {
        const { name, email, phone, date, time, projectType, message, currency, amount, paymentReference } = await req.json();

        if (!name || !email || !date || !time) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const meetingLink = process.env.MEETING_LINK || 'https://meet.google.com/owu-zhiz-bns';
        const icsContent = generateICS(name, email, date, time, meetingLink);

        // 1. Persist booking to Supabase first to get the ID for the cancellation link
        let cancellationUrl: string | null = null;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const db = getSupabase() as any;
            const { data: booking, error: dbError } = await db
                .from('bookings')
                .insert({
                    name,
                    email,
                    phone: phone || null,
                    date,
                    time,
                    project_type: projectType || null,
                    message: message || null,
                    currency: currency || 'ZMW',
                    amount: amount || null,
                    payment_reference: paymentReference || null,
                    status: 'confirmed',
                })
                .select('id')
                .single();
            if (dbError) {
                console.error('Supabase insert error:', dbError);
            } else if (booking?.id) {
                const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://axisliving.co.zm';
                cancellationUrl = `${siteUrl}/booking/cancel?id=${booking.id}`;
            }
        } catch (dbError) {
            console.error('Supabase error:', dbError);
        }

        // 2. Confirmation email to client with .ics attachment and cancellation link
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { subject, html } = (emailTemplates as any).bookingConfirmation(name, date, time, meetingLink, cancellationUrl);
        const { error: clientError } = await getResend().emails.send({
            from: FROM,
            to: [email],
            subject,
            html,
            attachments: [
                {
                    filename: 'axis-living-consultation.ics',
                    content: Buffer.from(icsContent),
                },
            ],
        });

        if (clientError) {
            console.error('Client email error:', clientError);
        }

        // 3. Admin notification with full booking details
        const adminLines = [
            'New booking received!',
            '',
            `Client:       ${name}`,
            `Email:        ${email}`,
            phone ? `Phone:        ${phone}` : null,
            `Date:         ${date}`,
            `Time:         ${time} (CAT)`,
            `Project Type: ${projectType || 'Not specified'}`,
            `Message:      ${message || 'No message provided'}`,
            cancellationUrl ? `Cancel link:  ${cancellationUrl}` : null,
        ].filter((l): l is string => l !== null).join('\n');

        const { error: adminError } = await getResend().emails.send({
            from: FROM,
            to: [process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL || 'hello@axisliving.co.zm'],
            subject: `New Consultation Booked: ${name}`,
            text: adminLines,
        });

        if (adminError) {
            console.error('Admin email error:', adminError);
        }

        // 4. Add to Resend audience (non-blocking)
        if (AUDIENCE_ID) {
            try {
                const [firstName, ...rest] = name.split(' ');
                await getResend().contacts.create({
                    email,
                    firstName,
                    lastName: rest.join(' '),
                    audienceId: AUDIENCE_ID,
                });
            } catch (contactError) {
                console.error('Resend contact error:', contactError);
            }
        }

        return NextResponse.json({ success: true, message: 'Booking confirmed' });

    } catch (error) {
        console.error('Booking API error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to process booking' },
            { status: 500 }
        );
    }
}
