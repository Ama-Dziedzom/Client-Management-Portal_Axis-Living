import { NextResponse } from 'next/server';
import { getResend, FROM, AUDIENCE_ID } from '@/lib/resend';
import { BookingConfirmationEmail } from '@/components/Emails/BookingConfirmation';
import React from 'react';

export async function POST(req: Request) {
    try {
        const { name, email, date, time, projectType, message } = await req.json();

        // Basic validation
        if (!name || !email || !date || !time) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const meetingLink = process.env.MEETING_LINK || 'https://meet.google.com/owu-zhiz-bns';

        // 1. Send confirmation email to client
        const { data: clientEmail, error: clientError } = await getResend().emails.send({
            from: FROM,
            to: [email],
            subject: 'Consultation Confirmed: Axis Living',
            react: React.createElement(BookingConfirmationEmail, {
                name,
                date,
                time,
                meetingLink,
            }) as React.ReactElement,
        });

        if (clientError) {
            console.error('Error sending client email:', clientError);
        }

        // 2. Send notification email to admin
        const { data: adminEmail, error: adminError } = await getResend().emails.send({
            from: FROM,
            to: [process.env.RESEND_FROM_EMAIL || 'hello@axisliving.co.zm'],
            subject: `New Consultation Booked: ${name}`,
            text: `
        New booking received!
        
        Client: ${name}
        Email: ${email}
        Date: ${date}
        Time: ${time}
        Project Type: ${projectType}
        Message: ${message}
      `,
        });

        if (adminError) {
            console.error('Error sending admin notification:', adminError);
        }

        // 3. Add to Resend Audience (Newsletter List)
        try {
            if (AUDIENCE_ID) {
                const [firstName, ...lastNameParts] = name.split(' ');
                await getResend().contacts.create({
                    email,
                    firstName,
                    lastName: lastNameParts.join(' '),
                    audienceId: AUDIENCE_ID,
                });
            }
        } catch (contactError) {
            console.error('Resend Contact Error:', contactError);
        }

        return NextResponse.json({
            success: true,
            message: 'Booking confirmed and emails sent'
        });

    } catch (error) {
        console.error('Booking API error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to process booking' },
            { status: 500 }
        );
    }
}
