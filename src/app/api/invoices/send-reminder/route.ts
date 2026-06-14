import { NextResponse } from 'next/server'
import { getResend, FROM } from '@/lib/resend'

export async function POST(req: Request) {
    try {
        const { clientName, clientEmail, invoiceNumber, total, currency, dueDate } = await req.json()

        if (!clientEmail || !invoiceNumber) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const formattedAmount = `${currency || 'ZMW'} ${Number(total).toLocaleString()}`
        const dueDateStr = dueDate ? new Date(dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'as soon as possible'
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://client-axis-living.vercel.app'

        const { error } = await getResend().emails.send({
            from: FROM,
            to: [clientEmail],
            subject: `Payment reminder — Invoice ${invoiceNumber}`,
            text: [
                `Hi ${clientName},`,
                '',
                `This is a friendly reminder that invoice ${invoiceNumber} for ${formattedAmount} is due ${dueDateStr}.`,
                '',
                'If you have already made payment, please disregard this message.',
                '',
                `If you have any questions, reply to this email or reach us at ${siteUrl}.`,
                '',
                'Thank you,',
                'Axis Living',
            ].join('\n'),
        })

        if (error) {
            console.error('Reminder email error:', error)
            return NextResponse.json({ error: 'Failed to send reminder' }, { status: 500 })
        }

        return NextResponse.json({ message: `Reminder sent to ${clientEmail}` })
    } catch (err) {
        console.error('Send reminder error:', err)
        return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
    }
}
