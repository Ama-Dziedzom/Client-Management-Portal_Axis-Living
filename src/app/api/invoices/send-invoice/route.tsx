import { NextResponse } from 'next/server'
import { getResend, FROM } from '@/lib/resend'
import { emailTemplates } from '@/lib/emailTemplates'
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import { InvoicePDF } from '@/lib/invoicePdf'

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
            taxRate,
            total,
            currency,
            notes,
            paymentDetails,
        } = await req.json()

        if (!clientEmail || !invoiceNumber) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const dueDateStr = dueDate
            ? new Date(dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'as soon as possible'

        const issueDateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

        // Build email HTML
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
            {},
            paymentDetails || null,
        )

        // Generate PDF attachment
        const pdfBuffer = await renderToBuffer(
            <InvoicePDF
                invoiceNumber={invoiceNumber}
                issueDate={issueDateStr}
                dueDate={dueDateStr}
                clientName={clientName}
                clientEmail={clientEmail}
                projectTitle={projectTitle}
                lineItems={lineItems || []}
                subtotal={Number(subtotal)}
                taxAmount={Number(taxAmount)}
                taxRate={Number(taxRate ?? 16)}
                total={Number(total)}
                currency={currency || 'ZMW'}
                notes={notes || ''}
                paymentDetails={paymentDetails || null}
            />
        )

        const { error } = await getResend().emails.send({
            from: FROM,
            to: [clientEmail],
            subject,
            html,
            attachments: [
                {
                    filename: `${invoiceNumber}.pdf`,
                    content:  pdfBuffer,
                },
            ],
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
