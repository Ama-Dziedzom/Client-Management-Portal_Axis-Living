import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, invoiceReminderEmail } from '@/lib/email'
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
    try {
        const { clientName, clientEmail, invoiceNumber, total, currency, dueDate } = await req.json()

        if (!clientEmail || !invoiceNumber) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Format values for the email
        const amount = new Intl.NumberFormat('en-ZM', {
            style: 'currency',
            currency: currency || 'ZMW'
        }).format(total || 0)

        const formattedDueDate = dueDate
            ? new Date(dueDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })
            : 'Not specified'

        const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.axisliving.com'

        const html = invoiceReminderEmail(
            clientName || 'Client',
            invoiceNumber,
            amount,
            formattedDueDate,
            portalUrl
        )

        await sendEmail({
            to: clientEmail,
            subject: `Payment Reminder — Invoice ${invoiceNumber}`,
            html,
        })

        logger.info('SendReminder', `Reminder sent to ${clientEmail} for invoice ${invoiceNumber}`)

        return NextResponse.json({ success: true, message: `Reminder sent to ${clientEmail}` })
    } catch (error: any) {
        logger.error('SendReminder', 'Failed to send reminder', error)
        return NextResponse.json(
            { error: error.message || 'Failed to send reminder' },
            { status: 500 }
        )
    }
}
