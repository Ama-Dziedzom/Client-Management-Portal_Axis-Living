'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { studioSupabase as supabase } from '@/lib/supabase'
import { Invoice, Project, Client } from '@/types/database'
import { 
    ArrowLeft, 
    Send, 
    CheckCircle2, 
    Trash2, 
    Printer,
    Mail,
    Loader2,
    ShieldCheck,
} from '@/lib/icons'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { formatCurrency, formatDate, formatStatus, getStatusBadgeClass } from '@/lib/utils'

export default function StudioInvoiceDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [invoice, setInvoice] = useState<(Invoice & { project: Project; client: Client }) | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [sendingReminder, setSendingReminder] = useState(false)

    useEffect(() => {
        if (id) fetchInvoice()
    }, [id])

    const fetchInvoice = async () => {
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select('*, projects(*), clients(*)')
                .eq('id', id as string)
                .single()

            if (error) throw error
            setInvoice({
                ...data,
                project: data.projects,
                client: data.clients
            })
        } catch (error) {
            console.error('Error fetching invoice:', error)
            toast.error('Failed to load invoice details')
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (newStatus: string) => {
        setUpdating(true)
        try {
            const { error } = await supabase
                .from('invoices')
                .update({ status: newStatus })
                .eq('id', id as string)

            if (error) throw error

            if (newStatus === 'sent' && invoice) {
                let paymentDetails = null
                try {
                    const saved = localStorage.getItem('studio_payment_prefs')
                    if (saved) paymentDetails = JSON.parse(saved)
                } catch {}

                const res = await fetch('/api/invoices/send-invoice', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        clientName: invoice.client.name,
                        clientEmail: invoice.client.email,
                        invoiceNumber: invoice.invoice_number,
                        dueDate: invoice.due_date,
                        projectTitle: invoice.project.title,
                        lineItems: invoice.line_items,
                        subtotal: invoice.subtotal,
                        taxAmount: invoice.tax_amount,
                        taxRate: invoice.tax_rate,
                        total: invoice.total,
                        currency: invoice.currency,
                        notes: invoice.notes,
                        paymentDetails,
                    }),
                })
                const data = await res.json()
                if (!res.ok) {
                    toast.error(`Status updated but email failed: ${data.error}`)
                } else {
                    toast.success(`Invoice sent to ${invoice.client.email}`)
                }
            } else {
                toast.success(`Invoice marked as ${newStatus}`)
            }

            setInvoice(prev => prev ? { ...prev, status: newStatus as any } : null)
        } catch (error) {
            console.error('Update error:', error)
            toast.error('Failed to update invoice status')
        } finally {
            setUpdating(false)
        }
    }

    const deleteInvoice = async () => {
        if (!window.confirm('Delete this invoice? This cannot be undone.')) return
        try {
            const { error } = await supabase.from('invoices').delete().eq('id', id as string)
            if (error) throw error
            toast.success('Invoice deleted')
            router.push('/studio/invoices')
        } catch (error) {
            console.error('Delete error:', error)
            toast.error('Failed to delete invoice')
        }
    }

    const sendReminder = async () => {
        if (!invoice) return
        setSendingReminder(true)
        try {
            const res = await fetch('/api/invoices/send-reminder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName: invoice.client.name,
                    clientEmail: invoice.client.email,
                    invoiceNumber: invoice.invoice_number,
                    total: invoice.total,
                    currency: invoice.currency,
                    dueDate: invoice.due_date,
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to send reminder')
            toast.success(data.message || 'Reminder sent!')
        } catch (error: any) {
            console.error('Send reminder error:', error)
            toast.error(error.message || 'Failed to send reminder')
        } finally {
            setSendingReminder(false)
        }
    }

    if (loading) return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin opacity-40" />
            </div>
        )

    if (!invoice) return (
        <div className="text-center py-20">
            <p className="text-text-secondary">Invoice not found</p>
            <Link href="/studio/invoices" className="btn-ghost mt-4">Back to Invoices</Link>
        </div>
    )

    const lineItems = (invoice.line_items as any[]) || []
    const canSendReminder = invoice.status === 'sent' || invoice.status === 'overdue'

    return (
        <div className="max-w-4xl mx-auto pb-20 print:pb-0 print:max-w-full">
            {/* Header */}
            <div className="print:hidden mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <Link
                        href="/studio/invoices"
                        className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Invoices
                    </Link>
                    <div className="flex items-center gap-4 mb-2">
                        <span className={getStatusBadgeClass(invoice.status)}>
                            {formatStatus(invoice.status)}
                        </span>
                        <span className="text-sm font-mono font-bold text-text-secondary">#{invoice.invoice_number}</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-text-primary tracking-tight">
                        Invoice detail
                    </h1>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    {invoice.status === 'draft' && (
                        <button onClick={() => updateStatus('sent')} disabled={updating} className="btn-primary">
                            <Send className="w-4 h-4" /> Send to Client
                        </button>
                    )}
                    {invoice.status === 'sent' && (
                        <button onClick={() => updateStatus('paid')} disabled={updating} className="btn-primary bg-emerald-600 hover:bg-emerald-700">
                            <CheckCircle2 className="w-4 h-4" /> Mark as Paid
                        </button>
                    )}
                    <button className="btn-secondary" onClick={() => window.print()}>
                        <Printer className="w-4 h-4" /> Print PDF
                    </button>
                    <button onClick={deleteInvoice} className="btn-ghost text-error p-2 hover:bg-red-50 rounded-xl">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Invoice Document Look */}
            <div className="invoice-document card-flat bg-surface shadow-2xl shadow-black/5 p-8 md:p-12 border-border overflow-hidden relative">
                {/* Branding watermark or corner label */}
                <div className="absolute top-0 right-0 px-6 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-bl-xl">
                    Internal Billing Record
                </div>

                <div className="invoice-section-gap flex flex-col md:flex-row justify-between gap-10 mb-16">
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-text-primary mb-6">AXIS LIVING</h2>
                        <div className="space-y-1 text-sm text-text-secondary font-body">
                            <p>Studio 102, Innovation Hub</p>
                            <p>Lusaka, Zambia</p>
                            <p>billing@axisliving.com</p>
                        </div>
                    </div>
                    <div className="text-left md:text-right">
                        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-4">Invoice Issued To</h3>
                        <div className="space-y-1 text-sm text-text-primary font-body">
                            <p className="font-bold text-base">{invoice.client.name}</p>
                            <p>{invoice.client.email}</p>
                            <p>{invoice.client.address || 'No address provided'}</p>
                        </div>
                    </div>
                </div>

                <div className="invoice-section-gap invoice-meta-padding grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 py-8 border-y border-border">
                    <div>
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.1em] mb-1">Invoice Date</p>
                        <p className="text-sm font-semibold text-text-primary">{formatDate(invoice.created_at)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.1em] mb-1">Due Date</p>
                        <p className="text-sm font-semibold text-text-primary">{formatDate(invoice.due_date)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.1em] mb-1">Project</p>
                        <p className="text-sm font-semibold text-text-primary truncate">{invoice.project.title}</p>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.1em] mb-1">Reference</p>
                        <p className="text-sm font-semibold text-text-primary">{invoice.invoice_number}</p>
                    </div>
                </div>

                {/* Table */}
                <div className="invoice-section-gap mb-16">
                    <div className="flex items-center px-4 py-3 border-b border-border text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                        <div className="flex-1">Description / Service</div>
                        <div className="w-24 text-center">Qty</div>
                        <div className="w-32 text-right">Unit Price</div>
                        <div className="w-32 text-right">Amount</div>
                    </div>
                    <div className="divide-y divide-border/50">
                        {lineItems.map((item, idx) => (
                            <div key={idx} className="invoice-row-padding flex items-center px-4 py-5 text-sm font-body">
                                <div className="flex-1 text-text-primary font-medium">{item.description}</div>
                                <div className="w-24 text-center text-text-secondary">{item.quantity}</div>
                                <div className="w-32 text-right text-text-secondary">{formatCurrency(item.unit_price, invoice.currency)}</div>
                                <div className="w-32 text-right font-bold text-text-primary">{formatCurrency(item.amount, invoice.currency)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                <div className="flex flex-col md:flex-row justify-between gap-10">
                    <div className="flex-1 max-w-sm">
                        <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3">Notes & Instructions</h4>
                        <p className="text-xs text-text-secondary font-body leading-relaxed whitespace-pre-wrap italic bg-accent/5 p-4 rounded-xl">
                            {invoice.notes || 'Default payment terms apply (Net 14). Please contact our studio for wire transfer details if not previously provided.'}
                        </p>
                    </div>
                    <div className="w-full md:w-64 space-y-3">
                        <div className="flex justify-between items-center text-sm text-text-secondary font-body">
                            <span>Subtotal</span>
                            <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-text-secondary font-body border-b border-border pb-3">
                            <span>Tax ({invoice.tax_rate ?? 16}% VAT)</span>
                            <span>{formatCurrency(invoice.tax_amount, invoice.currency)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="font-heading text-lg font-bold text-text-primary">Total Amount</span>
                            <span className="font-heading text-2xl font-bold text-primary">{formatCurrency(invoice.total, invoice.currency)}</span>
                        </div>
                    </div>
                </div>
                
                {invoice.status === 'paid' && (
                    <div className="mt-16 flex items-center justify-center gap-3 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-[0.2em]">Full Payment Received</span>
                    </div>
                )}
            </div>

            {/* Send Reminder Action */}
            {canSendReminder && (
                <div className="print:hidden mt-10">
                    <div className="card-flat flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-text-primary">Send Reminder</h4>
                            <p className="text-xs text-text-secondary">
                                Email {invoice.client.name} a payment reminder for this invoice.
                            </p>
                        </div>
                        <button 
                            onClick={sendReminder}
                            disabled={sendingReminder}
                            className="btn-secondary text-xs ml-auto"
                        >
                            {sendingReminder ? (
                                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
                            ) : (
                                <><Mail className="w-3.5 h-3.5" /> Send Email</>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

