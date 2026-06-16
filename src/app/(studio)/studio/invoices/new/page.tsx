'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { studioSupabase as supabase } from '@/lib/supabase'
import { Project, Client, InvoiceStatus } from '@/types/database'
import {
    ArrowLeft,
    Plus,
    Trash2,
    Save,
    FileText,
    Loader2,
    User,
    FolderKanban,
    Calendar,
    Receipt,
    ListTodo,
    Eye,
    X,
} from '@/lib/icons'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { formatCurrency, formatDate } from '@/lib/utils'

interface LineItem {
    description: string
    quantity: number
    unit_price: number
    amount: number
}

export default function NewInvoicePage() {
    const router = useRouter()
    const [clients, setClients]   = useState<Client[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading]   = useState(true)
    const [saving, setSaving]     = useState(false)
    const [showPreview, setShowPreview] = useState(false)

    // Form state
    const [clientId, setClientId]       = useState('')
    const [projectId, setProjectId]     = useState('')
    const [invoiceNumber, setInvoiceNumber] = useState('')
    const [dueDate, setDueDate]         = useState('')
    const [notes, setNotes]             = useState('')
    const [currency, setCurrency]       = useState('ZMW')
    const [taxRate, setTaxRate]         = useState(16)
    const [lineItems, setLineItems]     = useState<LineItem[]>([
        { description: '', quantity: 1, unit_price: 0, amount: 0 },
    ])
    const [paymentPrefs, setPaymentPrefs] = useState<Record<string, string> | null>(null)

    useEffect(() => {
        fetchInitialData()

        try {
            const saved = localStorage.getItem('studio_appearance_prefs')
            if (saved) { const { currency: c } = JSON.parse(saved); if (c) setCurrency(c) }
        } catch {}

        try {
            const saved = localStorage.getItem('studio_payment_prefs')
            if (saved) {
                const p = JSON.parse(saved)
                setPaymentPrefs(p)
                if (p.defaultTerms) setNotes(p.defaultTerms)
            }
        } catch {}

        const now = new Date()
        const rnd = Math.floor(1000 + Math.random() * 9000)
        setInvoiceNumber(`INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${rnd}`)

        const due = new Date(); due.setDate(due.getDate() + 14)
        setDueDate(due.toISOString().split('T')[0])
    }, [])

    const fetchInitialData = async () => {
        try {
            const [clientsRes, projectsRes] = await Promise.all([
                supabase.from('clients').select('*').eq('active', true).order('name'),
                supabase.from('projects').select('*').order('title'),
            ])
            setClients(clientsRes.data || [])
            setProjects(projectsRes.data || [])
        } catch {
            toast.error('Failed to load portal data')
        } finally {
            setLoading(false)
        }
    }

    const handleAddLineItem = () =>
        setLineItems([...lineItems, { description: '', quantity: 1, unit_price: 0, amount: 0 }])

    const handleRemoveLineItem = (index: number) => {
        if (lineItems.length === 1) return
        setLineItems(lineItems.filter((_, i) => i !== index))
    }

    const updateLineItem = (index: number, updates: Partial<LineItem>) => {
        const next = [...lineItems]
        const item = { ...next[index], ...updates }
        item.amount = item.quantity * item.unit_price
        next[index] = item
        setLineItems(next)
    }

    const subtotal  = lineItems.reduce((s, i) => s + i.amount, 0)
    const taxAmount = subtotal * (taxRate / 100)
    const total     = subtotal + taxAmount
    const fmt       = (n: number) => new Intl.NumberFormat('en', { style: 'currency', currency }).format(n)

    const selectedClient  = clients.find(c => c.id === clientId)
    const selectedProject = projects.find(p => p.id === projectId)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!clientId || !projectId) { toast.error('Please select both client and project'); return }
        setSaving(true)
        try {
            const { error } = await supabase.from('invoices').insert({
                client_id: clientId,
                project_id: projectId,
                invoice_number: invoiceNumber,
                title: invoiceNumber,
                due_date: dueDate,
                subtotal, tax_rate: taxRate, tax_amount: taxAmount, total,
                currency,
                status: 'draft' as InvoiceStatus,
                line_items: lineItems,
                notes,
            }).select().single()
            if (error) throw error
            toast.success('Invoice created as draft')
            router.push('/studio/invoices')
        } catch (err: any) {
            toast.error(err.message || 'Failed to create invoice')
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin opacity-40" />
        </div>
    )

    return (
        <>
            <div className="max-w-5xl mx-auto pb-20">
                {/* Header */}
                <div className="mb-10">
                    <Link
                        href="/studio/invoices"
                        className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Invoices
                    </Link>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-text-primary mb-2">Create New Invoice</h1>
                            <p className="text-text-secondary font-body text-lg">Bill your client for project milestones and services</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowPreview(true)}
                            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface text-sm font-medium text-text-secondary hover:text-text-primary hover:border-primary/30 transition-all"
                        >
                            <Eye className="w-4 h-4" /> Preview
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Invoice Details */}
                            <div className="card-flat space-y-6">
                                <h3 className="font-heading text-lg font-semibold flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" /> Invoice Details
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-text-primary">Invoice Number</label>
                                        <input type="text" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="input-field font-mono" placeholder="INV-2024-001" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-text-primary">Due Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                                            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="input-field pl-11" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-text-primary">Currency</label>
                                        <select value={currency} onChange={e => setCurrency(e.target.value)} className="input-field appearance-none">
                                            {['ZMW', 'USD', 'EUR', 'GBP', 'GHS'].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-text-primary">Tax Rate (%)</label>
                                        <input type="number" min="0" max="100" value={taxRate} onChange={e => setTaxRate(Number(e.target.value) || 0)} className="input-field" placeholder="16" />
                                    </div>
                                </div>
                            </div>

                            {/* Line Items */}
                            <div className="card-flat">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-heading text-lg font-semibold flex items-center gap-2">
                                        <ListTodo className="w-5 h-5 text-primary" /> Line Items
                                    </h3>
                                    <button type="button" onClick={handleAddLineItem} className="btn-ghost text-xs group">
                                        <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Add Row
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {lineItems.map((lineItem, idx) => (
                                        <div key={idx} className="group relative flex flex-col md:flex-row gap-4 p-5 rounded-2xl bg-accent/5 border border-transparent hover:border-primary/20 transition-all">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Service or item description..."
                                                    value={lineItem.description}
                                                    onChange={e => updateLineItem(idx, { description: e.target.value })}
                                                    className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10"
                                                />
                                            </div>
                                            <div className="w-full md:w-24">
                                                <input
                                                    type="number" min="1"
                                                    value={lineItem.quantity || ''}
                                                    onChange={e => updateLineItem(idx, { quantity: Number(e.target.value) || 0 })}
                                                    onBlur={e => { if (!e.target.value) updateLineItem(idx, { quantity: 1 }) }}
                                                    className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/10"
                                                />
                                            </div>
                                            <div className="w-full md:w-40">
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xs">{currency === 'ZMW' ? 'K' : currency}</span>
                                                    <input
                                                        type="number" min="0"
                                                        value={lineItem.unit_price || ''}
                                                        placeholder="0"
                                                        onChange={e => updateLineItem(idx, { unit_price: Number(e.target.value) || 0 })}
                                                        className="w-full bg-white border border-border rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10"
                                                    />
                                                </div>
                                            </div>
                                            <div className="hidden md:flex w-32 items-center justify-end font-bold text-sm text-text-primary pr-4">
                                                {fmt(lineItem.amount)}
                                            </div>
                                            {lineItems.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveLineItem(idx)}
                                                    className="absolute -right-2 -top-2 md:static md:p-2 bg-white md:bg-transparent rounded-full shadow-sm md:shadow-none text-text-secondary hover:text-error hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="card-flat space-y-4">
                                <label className="text-sm font-semibold text-text-primary block">Payment Notes / Terms</label>
                                <textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    rows={3}
                                    className="input-field resize-none py-4"
                                    placeholder="Add specific project terms or instructions..."
                                />
                            </div>

                            {/* Payment details preview */}
                            {paymentPrefs && (paymentPrefs.bankAccountNumber || paymentPrefs.momoNumber) ? (
                                <div className="card-flat space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-text-primary">Payment Details</p>
                                        <Link href="/studio/settings" className="text-xs text-primary hover:underline font-medium">Edit in Settings</Link>
                                    </div>
                                    <p className="text-xs text-text-secondary -mt-2">Auto-included in the invoice email.</p>
                                    <div className="divide-y divide-border rounded-xl border border-border overflow-hidden text-sm">
                                        {paymentPrefs.bankAccountNumber && (
                                            <div className="px-4 py-3 space-y-2">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Bank Transfer</p>
                                                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                                                    {paymentPrefs.bankName && <><span className="text-text-secondary">Bank</span><span className="text-text-primary font-medium">{paymentPrefs.bankName}</span></>}
                                                    {paymentPrefs.bankAccountName && <><span className="text-text-secondary">Account Name</span><span className="text-text-primary font-medium">{paymentPrefs.bankAccountName}</span></>}
                                                    <span className="text-text-secondary">Account No.</span>
                                                    <span className="text-text-primary font-mono font-bold tracking-wide">{paymentPrefs.bankAccountNumber}</span>
                                                    {paymentPrefs.bankBranch && <><span className="text-text-secondary">Branch</span><span className="text-text-primary font-medium">{paymentPrefs.bankBranch}</span></>}
                                                </div>
                                            </div>
                                        )}
                                        {paymentPrefs.momoNumber && (
                                            <div className="px-4 py-3 space-y-2">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{paymentPrefs.momoProvider || 'Mobile Money'}</p>
                                                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                                                    <span className="text-text-secondary">Number</span>
                                                    <span className="text-text-primary font-mono font-bold tracking-wide">{paymentPrefs.momoNumber}</span>
                                                    {paymentPrefs.momoName && <><span className="text-text-secondary">Name</span><span className="text-text-primary font-medium">{paymentPrefs.momoName}</span></>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-border px-5 py-4 flex items-center justify-between gap-4">
                                    <p className="text-sm text-text-secondary">No payment details set. Add bank &amp; mobile money info so it appears on every invoice email.</p>
                                    <Link href="/studio/settings" className="text-xs font-semibold text-primary whitespace-nowrap hover:underline">Set up →</Link>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="card-flat space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Select Client</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                                        <select
                                            required value={clientId}
                                            onChange={e => { setClientId(e.target.value); setProjectId('') }}
                                            className="w-full bg-accent/5 border border-border rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-medium"
                                        >
                                            <option value="">Choose Client...</option>
                                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Select Project</label>
                                    <div className="relative">
                                        <FolderKanban className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                                        <select
                                            required value={projectId}
                                            onChange={e => setProjectId(e.target.value)}
                                            className="w-full bg-accent/5 border border-border rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-medium"
                                        >
                                            <option value="">Choose Project...</option>
                                            {clientId
                                                ? projects.filter(p => p.client_id === clientId).length === 0
                                                    ? <option disabled value="">No projects for this client</option>
                                                    : projects.filter(p => p.client_id === clientId).map(p => (
                                                        <option key={p.id} value={p.id}>{p.title} ({p.status.replace('_', ' ')})</option>
                                                    ))
                                                : <option disabled value="">Select a client first</option>
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="card-flat bg-primary text-white border-none shadow-xl shadow-primary/20">
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-accent/60 flex items-center gap-2">
                                    <Receipt className="w-3.5 h-3.5" /> Summary
                                </h3>
                                <div className="space-y-4 font-body">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/60">Subtotal</span>
                                        <span className="font-semibold">{fmt(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-4">
                                        <span className="text-white/60">Tax ({taxRate}% VAT)</span>
                                        <span className="font-semibold">{fmt(taxAmount)}</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-2">
                                        <span className="font-heading text-lg font-bold">Total Due</span>
                                        <span className="font-heading text-3xl font-bold text-accent">{fmt(total)}</span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving || !clientId || !projectId}
                                    className="w-full mt-10 py-5 bg-white text-primary rounded-2xl font-bold text-base shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    Create Invoice
                                </button>
                                <p className="mt-4 text-[10px] text-center text-white/40 font-bold uppercase tracking-widest">
                                    Will be created as a Draft
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* ── Preview overlay ── */}
            <AnimatePresence>
                {showPreview && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 z-40"
                            onClick={() => setShowPreview(false)}
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white z-50 overflow-y-auto shadow-2xl"
                        >
                            {/* Panel header */}
                            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur border-b border-border">
                                <p className="text-sm font-semibold text-text-primary">Invoice Preview</p>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="p-2 rounded-xl hover:bg-accent/10 transition-colors text-text-secondary hover:text-text-primary"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Invoice document */}
                            <div className="p-6 md:p-10">
                                <div className="bg-surface rounded-2xl border border-border p-8 space-y-10 shadow-sm">
                                    {/* Header */}
                                    <div className="flex justify-between gap-8">
                                        <div>
                                            <h2 className="text-xl font-heading font-bold text-text-primary mb-4">AXIS LIVING</h2>
                                            <div className="space-y-0.5 text-xs text-text-secondary">
                                                <p>Studio 102, Innovation Hub</p>
                                                <p>Lusaka, Zambia</p>
                                                <p>billing@axisliving.com</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3">Bill To</p>
                                            {selectedClient ? (
                                                <div className="space-y-0.5 text-sm text-text-primary">
                                                    <p className="font-bold">{selectedClient.name}</p>
                                                    <p className="text-text-secondary text-xs">{selectedClient.email}</p>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-text-secondary italic">No client selected</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Meta */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 border-y border-border">
                                        {[
                                            { label: 'Invoice No.', value: invoiceNumber || '—' },
                                            { label: 'Due Date', value: dueDate ? formatDate(dueDate, { month: 'short', day: 'numeric', year: 'numeric' }) : '—' },
                                            { label: 'Project', value: selectedProject?.title || '—' },
                                            { label: 'Currency', value: currency },
                                        ].map(({ label, value }) => (
                                            <div key={label}>
                                                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">{label}</p>
                                                <p className="text-sm font-semibold text-text-primary truncate">{value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Line items */}
                                    <div>
                                        <div className="flex items-center px-3 py-2 border-b border-border text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                                            <div className="flex-1">Description</div>
                                            <div className="w-12 text-center">Qty</div>
                                            <div className="w-24 text-right">Unit Price</div>
                                            <div className="w-24 text-right">Amount</div>
                                        </div>
                                        <div className="divide-y divide-border/50">
                                            {lineItems.map((li, idx) => (
                                                <div key={idx} className="flex items-center px-3 py-3 text-sm">
                                                    <div className="flex-1 text-text-primary font-medium">{li.description || <span className="text-text-secondary italic">—</span>}</div>
                                                    <div className="w-12 text-center text-text-secondary">{li.quantity}</div>
                                                    <div className="w-24 text-right text-text-secondary">{fmt(li.unit_price)}</div>
                                                    <div className="w-24 text-right font-bold text-text-primary">{fmt(li.amount)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Totals */}
                                    <div className="flex justify-end">
                                        <div className="w-56 space-y-2">
                                            <div className="flex justify-between text-sm text-text-secondary">
                                                <span>Subtotal</span><span>{fmt(subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-text-secondary border-b border-border pb-2">
                                                <span>Tax ({taxRate}% VAT)</span><span>{fmt(taxAmount)}</span>
                                            </div>
                                            <div className="flex justify-between pt-1">
                                                <span className="font-heading font-bold text-text-primary">Total</span>
                                                <span className="font-heading font-bold text-lg text-primary">{fmt(total)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    {notes && (
                                        <div>
                                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Notes &amp; Terms</p>
                                            <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap italic bg-accent/5 px-4 py-3 rounded-xl">{notes}</p>
                                        </div>
                                    )}

                                    {/* Payment details */}
                                    {paymentPrefs && (paymentPrefs.bankAccountNumber || paymentPrefs.momoNumber) && (
                                        <div>
                                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3">How to Pay</p>
                                            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
                                                {paymentPrefs.bankAccountNumber && (
                                                    <div className="px-4 py-3 space-y-2">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Bank Transfer</p>
                                                        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
                                                            {paymentPrefs.bankName && <><span className="text-text-secondary">Bank</span><span className="text-text-primary font-medium">{paymentPrefs.bankName}</span></>}
                                                            {paymentPrefs.bankAccountName && <><span className="text-text-secondary">Account Name</span><span className="text-text-primary font-medium">{paymentPrefs.bankAccountName}</span></>}
                                                            <span className="text-text-secondary">Account No.</span>
                                                            <span className="text-text-primary font-mono font-bold tracking-wider">{paymentPrefs.bankAccountNumber}</span>
                                                            {paymentPrefs.bankBranch && <><span className="text-text-secondary">Branch</span><span className="text-text-primary font-medium">{paymentPrefs.bankBranch}</span></>}
                                                        </div>
                                                    </div>
                                                )}
                                                {paymentPrefs.momoNumber && (
                                                    <div className="px-4 py-3 space-y-2">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{paymentPrefs.momoProvider || 'Mobile Money'}</p>
                                                        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
                                                            <span className="text-text-secondary">Number</span>
                                                            <span className="text-text-primary font-mono font-bold tracking-wider">{paymentPrefs.momoNumber}</span>
                                                            {paymentPrefs.momoName && <><span className="text-text-secondary">Name</span><span className="text-text-primary font-medium">{paymentPrefs.momoName}</span></>}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
