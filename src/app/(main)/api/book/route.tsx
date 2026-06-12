import { NextResponse } from 'next/server';
import { getResend, FROM, AUDIENCE_ID } from '@/lib/resend';
import { emailTemplates } from '@/lib/emailTemplates';

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
        const { name, email, phone, date, time, projectType, message } = await req.json();

        if (!name || !email || !date || !time) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const meetingLink = process.env.MEETING_LINK || 'https://meet.google.com/owu-zhiz-bns';
        const icsContent = generateICS(name, email, date, time, meetingLink);

        // 1. Confirmation email to client with lookbook and .ics attachment
        const { subject, html } = emailTemplates.bookingConfirmation(name, date, time, meetingLink);
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

        // 2. Admin notification with full booking details
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
        ].filter(Boolean).join('\n');

        const { error: adminError } = await getResend().emails.send({
            from: FROM,
            to: [process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL || 'hello@axisliving.co.zm'],
            subject: `New Consultation Booked: ${name}`,
            text: adminLines,
        });

        if (adminError) {
            console.error('Admin email error:', adminError);
        }

        // 3. Add to Resend audience (non-blocking)
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
