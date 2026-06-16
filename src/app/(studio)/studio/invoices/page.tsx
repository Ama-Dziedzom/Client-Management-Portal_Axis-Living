'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { studioSupabase as supabase } from '@/lib/supabase'
import { Invoice } from '@/types/database'
import { formatCurrency, formatDate, formatStatus, getStatusBadgeClass } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
    Receipt,
    Search,
    Plus,
    ArrowRight,
    TrendingUp,
    CheckCircle2,
    Clock,
    Send,
    Loader2,
    X,
} from '@/lib/icons'

type InvoiceRow = Invoice & { client_name: string; client_email: string; project_title: string }

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const item      = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function StudioInvoicesPage() {
    const [invoices, setInvoices]         = useState<InvoiceRow[]>([])
    const [loading, setLoading]           = useState(true)
    const [searchQuery, setSearchQuery]   = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [sendingId, setSendingId]       = useState<string | null>(null)
    const [confirmId, setConfirmId]       = useState<string | null>(null)
    const confirmRef                      = useRef<HTMLDivElement>(null)

    useEffect(() => { fetchInvoices() }, [])

    // Close confirmation popover when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (confirmRef.current && !confirmRef.current.contains(e.target as Node)) {
                setConfirmId(null)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const fetchInvoices = async () => {
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select('*, projects(title), clients(name, email)')
                .order('created_at', { ascending: false })
            if (error) throw error
            setInvoices(
                (data || []).map((i: any) => ({
                    ...i,
                    client_name:  i.clients?.name  || 'Unknown Client',
                    client_email: i.clients?.email || '',
                    project_title: i.projects?.title || 'Unknown Project',
                }))
            )
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const quickSend = async (invoice: InvoiceRow) => {
        setSendingId(invoice.id)
        setConfirmId(null)
        try {
            const { error: updateErr } = await supabase
                .from('invoices')
                .update({ status: 'sent' })
                .eq('id', invoice.id)
            if (updateErr) throw updateErr

            let paymentDetails = null
            try {
                const saved = localStorage.getItem('studio_payment_prefs')
                if (saved) paymentDetails = JSON.parse(saved)
            } catch {}

            const res = await fetch('/api/invoices/send-invoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName:     invoice.client_name,
                    clientEmail:    invoice.client_email,
                    invoiceNumber:  invoice.invoice_number,
                    dueDate:        invoice.due_date,
                    projectTitle:   invoice.project_title,
                    lineItems:      invoice.line_items,
                    subtotal:       invoice.subtotal,
                    taxAmount:      invoice.tax_amount,
                    taxRate:        invoice.tax_rate,
                    total:          invoice.total,
                    currency:       invoice.currency,
                    notes:          invoice.notes,
                    paymentDetails,
                }),
            })
            const result = await res.json()
            if (!res.ok) throw new Error(result.error || 'Email failed')

            setInvoices(prev => prev.map(i => i.id === invoice.id ? { ...i, status: 'sent' } : i))
            toast.success(`Invoice sent to ${invoice.client_email}`)
        } catch (err: any) {
            toast.error(err.message || 'Failed to send invoice')
        } finally {
            setSendingId(null)
        }
    }

    const filtered = invoices.filter(i => {
        const q = searchQuery.toLowerCase()
        const matchesSearch = i.client_name.toLowerCase().includes(q) ||
            i.project_title.toLowerCase().includes(q) ||
            i.invoice_number.toLowerCase().includes(q)
        const matchesStatus = statusFilter === 'all' || i.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const totalRevenue     = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.total), 0)
    const totalOutstanding = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + Number(i.total), 0)

    if (loading) return (
        <div className="space-y-6">
            <div className="skeleton h-10 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[1, 2, 3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
            </div>
            <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}
            </div>
        </div>
    )

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            {/* Header */}
            <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-text-primary mb-2">Invoices</h1>
                    <p className="text-text-secondary font-body text-lg">Billing and revenue summary</p>
                </div>
                <Link href="/studio/invoices/new" className="btn-primary w-full sm:w-auto shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" /> New Invoice
                </Link>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                <div className="card-flat bg-primary/5 border-primary/10 p-6 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Lifetime Revenue</p>
                        <p className="text-2xl font-heading font-bold text-text-primary">{formatCurrency(totalRevenue)}</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                </div>
                <div className="card-flat bg-amber-50/50 border-amber-100 p-6 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Total Outstanding</p>
                        <p className="text-2xl font-heading font-bold text-text-primary">{formatCurrency(totalOutstanding)}</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                </div>
                <div className="card-flat bg-blue-50/50 border-blue-100 p-6 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Paid Invoices</p>
                        <p className="text-2xl font-heading font-bold text-text-primary">
                            {invoices.filter(i => i.status === 'paid').length}
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    </div>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div variants={item} className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search invoices, clients or projects..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="input-field pl-11"
                    />
                </div>
                <div className="min-w-[180px]">
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="input-field appearance-none bg-white cursor-pointer"
                    >
                        <option value="all">All Billing Statuses</option>
                        <option value="draft">Draft</option>
                        <option value="sent">Sent / Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </motion.div>

            {/* Invoice List */}
            {filtered.length === 0 ? (
                <motion.div variants={item} className="card-flat flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-accent/15 rounded-2xl flex items-center justify-center mb-4">
                        <Receipt className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">No invoices found</h3>
                    <p className="text-sm text-text-secondary mb-6">Create a billing record for your project work.</p>
                </motion.div>
            ) : (
                <div className="overflow-x-auto">
                    <div className="min-w-[820px] space-y-3 pb-4">
                        <div className="px-6 py-3 flex items-center text-[10px] font-bold text-[#8b8fa3] uppercase tracking-widest">
                            <div className="w-[15%]">Number</div>
                            <div className="w-[25%]">Client &amp; Project</div>
                            <div className="w-[14%]">Issued</div>
                            <div className="w-[14%]">Due</div>
                            <div className="w-[14%] text-right">Amount</div>
                            <div className="w-[18%] text-right">Status</div>
                        </div>

                        {filtered.map(invoice => (
                            <motion.div key={invoice.id} variants={item} className="relative group">
                                <Link
                                    href={`/studio/invoices/${invoice.id}`}
                                    className="card-flat flex items-center px-6 py-5 hover:shadow-elevated hover:border-primary/40 transition-all"
                                >
                                    <div className="w-[15%] font-medium text-text-primary group-hover:text-primary transition-colors font-mono text-sm">
                                        {invoice.invoice_number}
                                    </div>
                                    <div className="w-[25%] pr-4 min-w-0">
                                        <p className="text-sm font-semibold truncate text-text-primary">{invoice.client_name}</p>
                                        <p className="text-xs text-text-secondary truncate italic uppercase tracking-tighter mt-1">{invoice.project_title}</p>
                                    </div>
                                    <div className="w-[14%] text-sm text-text-secondary font-body">
                                        {formatDate(invoice.created_at, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="w-[14%] text-sm text-text-secondary font-body">
                                        {formatDate(invoice.due_date, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="w-[14%] text-right font-heading font-bold text-text-primary">
                                        {formatCurrency(invoice.total, invoice.currency)}
                                    </div>
                                    <div className="w-[18%] flex justify-end items-center gap-2">
                                        <span className={getStatusBadgeClass(invoice.status)}>
                                            {formatStatus(invoice.status)}
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-primary transition-all group-hover:translate-x-0.5 flex-shrink-0" />
                                    </div>
                                </Link>

                                {/* Quick-send button — draft invoices only */}
                                {invoice.status === 'draft' && (
                                    <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {confirmId === invoice.id ? (
                                            <div ref={confirmRef} className="flex items-center gap-2 bg-white border border-border rounded-xl shadow-elevated px-3 py-2">
                                                <p className="text-xs text-text-secondary whitespace-nowrap">
                                                    Send to <span className="font-semibold text-text-primary">{invoice.client_email || invoice.client_name}</span>?
                                                </p>
                                                <button
                                                    onClick={e => { e.preventDefault(); quickSend(invoice) }}
                                                    className="px-2.5 py-1 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                                                >
                                                    {sendingId === invoice.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Yes, send'}
                                                </button>
                                                <button
                                                    onClick={e => { e.preventDefault(); setConfirmId(null) }}
                                                    className="p-1 text-text-secondary hover:text-text-primary transition-colors"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={e => { e.preventDefault(); setConfirmId(invoice.id) }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-xl shadow-sm hover:bg-primary/90 transition-colors"
                                            >
                                                <Send className="w-3.5 h-3.5" /> Send
                                            </button>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    )
}
