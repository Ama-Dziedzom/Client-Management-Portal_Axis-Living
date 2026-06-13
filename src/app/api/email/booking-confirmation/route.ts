import { NextResponse } from 'next/server';
import { getResend, FROM, AUDIENCE_ID } from '@/lib/resend';
import { emailTemplates } from '@/lib/emailTemplates';

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
    const auth = req.headers.get('authorization');
    const secret = process.env.EMAIL_SECRET;
    if (!secret || auth !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, email, date, time, meetingLink, cancellationUrl, phone, projectType, message } = await req.json();

        if (!name || !email || !date || !time || !meetingLink) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const icsContent = generateICS(name, email, date, time, meetingLink);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { subject, html } = (emailTemplates as any).bookingConfirmation(name, date, time, meetingLink, cancellationUrl ?? null);

        const { error: clientError } = await getResend().emails.send({
            from: FROM,
            to: [email],
            subject,
            html,
            attachments: [{ filename: 'axis-living-consultation.ics', content: Buffer.from(icsContent) }],
        });
        if (clientError) console.error('Client email error:', clientError);

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
        if (adminError) console.error('Admin email error:', adminError);

        if (AUDIENCE_ID) {
            try {
                const [firstName, ...rest] = name.split(' ');
                await getResend().contacts.create({ email, firstName, lastName: rest.join(' '), audienceId: AUDIENCE_ID });
            } catch (e) {
                console.error('Resend contact error:', e);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Booking confirmation email error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
