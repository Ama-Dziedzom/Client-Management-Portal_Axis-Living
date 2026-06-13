import { NextResponse } from 'next/server';
import { emailTemplates } from '@/lib/emailTemplates';

const SAMPLE = {
    name: 'Ama Dziedzom',
    date: 'June 20, 2026',
    time: '10:00 AM',
    meetingLink: 'https://meet.google.com/owu-zhiz-bns',
    email: 'hello@axisliving.co.zm',
    password: 'Ax!s2026',
    portalUrl: 'https://portal.axisliving.co.zm',
    messagePreview: "Your moodboard for the living room is ready — I've included two directions for you to review before our next check-in.",
};

export async function GET(_req: Request, { params }: { params: Promise<{ template: string }> }) {
    const { template } = await params;

    let html: string;

    switch (template) {
        case 'lookbook':
            html = emailTemplates.lookbookDelivery(SAMPLE.name.split(' ')[0]).html;
            break;
        case 'booking':
            html = emailTemplates.bookingConfirmation(SAMPLE.name, SAMPLE.date, SAMPLE.time, SAMPLE.meetingLink).html;
            break;
        case 'portal':
            html = emailTemplates.portalWelcome(SAMPLE.name, SAMPLE.email, SAMPLE.password, SAMPLE.portalUrl).html;
            break;
        case 'message':
            html = emailTemplates.newPortalMessage(SAMPLE.name, SAMPLE.messagePreview, SAMPLE.portalUrl).html;
            break;
        default:
            return new NextResponse('Template not found', { status: 404 });
    }

    return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
}
