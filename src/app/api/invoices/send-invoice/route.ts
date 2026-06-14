import { NextResponse } from 'next/server'
import { getResend, FROM } from '@/lib/resend'
import { emailTemplates } from '@/lib/emailTemplates'

export async function POST(req: Request) {
    try {
        const {
            clientName,
            clientEmail,
            invoiceNumber,
            dueDate,
            projectTitle,
            lineItems,
            subtotal,
            taxAmount,
            total,
            currency,
            notes,
        } = await req.json()

        if (!clientEmail || !invoiceNumber) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const dueDateStr = dueDate
            ? new Date(dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'as soon as possible'

        const { subject, html } = emailTemplates.invoiceDelivery(
            clientName,
            invoiceNumber,
            dueDateStr,
            projectTitle,
            lineItems || [],
            subtotal,
            taxAmount,
            total,
            currency,
            notes,
        )

        const { error } = await getResend().emails.send({
            from: FROM,
            to: [clientEmail],
            subject,
            html,
        })

        if (error) {
            console.error('Invoice email error:', error)
            return NextResponse.json({ error: 'Failed to send invoice email' }, { status: 500 })
        }

        return NextResponse.json({ message: `Invoice sent to ${clientEmail}` })
    } catch (err) {
        console.error('Send invoice error:', err)
        return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
    }
}
