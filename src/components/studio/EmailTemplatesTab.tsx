'use client'

import { useState, useEffect, useCallback } from 'react'
import { emailTemplates } from '@/lib/emailTemplates'
import { Check, Pencil, Save, Eye, EyeOff } from '@/lib/icons'

interface EmailTemplate {
    id: string
    name: string
    subject: string
    heading: string
    body: string
    note: string | null
    updated_at: string
}

const SAMPLE = {
    name: 'Ama Dziedzom',
    date: 'June 20, 2026',
    time: '10:00 AM',
    meetingLink: 'https://meet.google.com/owu-zhiz-bns',
    cancellationUrl: 'https://client-axis-living.vercel.app/booking/cancel?id=example',
    invoice: {
        invoiceNumber: 'INV-001',
        dueDate: 'June 30, 2026',
        projectTitle: 'Home Renovation — Phase 1',
        lineItems: [
            { description: 'Interior Design Consultation', quantity: 1, unit_price: 5000, amount: 5000 },
            { description: 'Space Planning & Layout', quantity: 1, unit_price: 7500, amount: 7500 },
        ],
        subtotal: 12500,
        taxAmount: 2000,
        total: 14500,
        currency: 'ZMW',
        portalUrl: 'https://client-axis-living.vercel.app/portal',
        daysOverdue: 3,
    },
}

const TEMPLATE_META: Record<string, { trigger: string }> = {
    booking_confirmation: { trigger: 'On consultation booked' },
    booking_cancelled:    { trigger: 'On client self-cancellation' },
    lookbook_delivery:    { trigger: 'On lookbook sign-up' },
    invoice_delivery:     { trigger: 'On invoice sent to client' },
    invoice_reminder:     { trigger: 'On overdue / upcoming invoice reminder' },
}

const PLACEHOLDER_HINT: Record<string, string[]> = {
    booking_confirmation: ['{{name}}', '{{date}}', '{{time}}', '{{cancel_link}}'],
    booking_cancelled:    ['{{name}}', '{{date}}', '{{time}}'],
    lookbook_delivery:    ['{{name}}'],
    invoice_delivery:     ['{{name}}', '{{invoice_number}}', '{{project}}', '{{due_date}}'],
    invoice_reminder:     ['{{name}}', '{{invoice_number}}', '{{project}}', '{{due_date}}', '{{amount}}'],
}

function buildPreview(id: string, tpl: EmailTemplate): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const et = emailTemplates as any
    if (id === 'booking_confirmation') return et.bookingConfirmation(SAMPLE.name, SAMPLE.date, SAMPLE.time, SAMPLE.meetingLink, SAMPLE.cancellationUrl, tpl).html
    if (id === 'booking_cancelled')    return et.bookingCancelled(SAMPLE.name, SAMPLE.date, SAMPLE.time, tpl).html
    if (id === 'lookbook_delivery')    return et.lookbookDelivery(SAMPLE.name.split(' ')[0], tpl).html
    if (id === 'invoice_delivery') {
        const inv = SAMPLE.invoice
        return et.invoiceDelivery(SAMPLE.name, inv.invoiceNumber, inv.dueDate, inv.projectTitle, inv.lineItems, inv.subtotal, inv.taxAmount, inv.total, inv.currency, '', tpl).html
    }
    if (id === 'invoice_reminder') {
        const inv = SAMPLE.invoice
        return et.invoiceReminder(SAMPLE.name, inv.invoiceNumber, inv.dueDate, inv.projectTitle, inv.total, inv.currency, inv.portalUrl, inv.daysOverdue, tpl).html
    }
    return '<p>No preview available.</p>'
}

export default function EmailTemplatesTab() {
    const [templates, setTemplates] = useState<EmailTemplate[]>([])
    const [loading, setLoading] = useState(true)
    const [activeId, setActiveId] = useState<string>('booking_confirmation')
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState<Partial<EmailTemplate>>({})
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [showPreview, setShowPreview] = useState(true)

    useEffect(() => {
        fetch('/api/studio/email-templates')
            .then(r => r.json())
            .then(r => { setTemplates(r.data ?? []); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const active = templates.find(t => t.id === activeId)

    const startEdit = useCallback(() => {
        if (!active) return
        setForm({ subject: active.subject, heading: active.heading, body: active.body, note: active.note ?? '' })
        setEditing(true)
    }, [active])

    const cancelEdit = () => { setEditing(false); setForm({}) }

    const save = async () => {
        if (!active) return
        setSaving(true)
        const res = await fetch(`/api/studio/email-templates/${active.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
        const result = await res.json()
        if (result.data) setTemplates(prev => prev.map(t => t.id === active.id ? result.data : t))
        setSaving(false)
        setEditing(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    const previewTpl = editing && active ? { ...active, ...form } : active

    if (loading) return (
        <div className="space-y-4">{[1, 2].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>
    )

    if (templates.length === 0) return (
        <div className="card-flat text-center py-12">
            <p className="text-text-secondary text-sm">No templates found. Run the SQL migration in your Supabase dashboard first.</p>
        </div>
    )

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left — selector + editor */}
            <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    {templates.map(t => (
                        <button key={t.id} onClick={() => { setActiveId(t.id); setEditing(false); setForm({}) }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${activeId === t.id ? 'bg-accent/20 text-primary border-accent/30' : 'bg-surface text-text-secondary border-border hover:text-text-primary'}`}>
                            {t.name}
                        </button>
                    ))}
                </div>

                {active && (
                    <div className="card-flat space-y-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-text-primary font-semibold text-sm">{active.name}</p>
                                <p className="text-text-secondary text-xs mt-0.5">{TEMPLATE_META[active.id]?.trigger}</p>
                            </div>
                            {!editing && (
                                <div className="flex items-center gap-2">
                                    {saved && <span className="text-xs text-emerald-600 font-medium flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Saved</span>}
                                    <button onClick={startEdit}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm text-text-secondary hover:text-text-primary transition-colors">
                                        <Pencil className="w-3.5 h-3.5" /> Edit
                                    </button>
                                </div>
                            )}
                        </div>

                        {PLACEHOLDER_HINT[active.id] && (
                            <div className="bg-accent/5 border border-accent/20 rounded-xl px-3 py-2">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-text-secondary mb-1.5">Available placeholders</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {PLACEHOLDER_HINT[active.id].map(p => (
                                        <code key={p} className="bg-surface border border-border px-2 py-0.5 rounded text-xs font-mono text-primary">{p}</code>
                                    ))}
                                </div>
                            </div>
                        )}

                        {editing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary block mb-1.5">Subject</label>
                                    <input value={form.subject ?? ''} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="input-field w-full" />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary block mb-1.5">Heading</label>
                                    <input value={form.heading ?? ''} onChange={e => setForm(f => ({ ...f, heading: e.target.value }))} className="input-field w-full" />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary block mb-1.5">Body</label>
                                    <textarea value={form.body ?? ''} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={4} className="input-field w-full resize-y" />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary block mb-1.5">Footer note</label>
                                    <input value={form.note ?? ''} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} className="input-field w-full" placeholder="Optional note below the email content" />
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={save} disabled={saving}
                                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                                        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
                                    </button>
                                    <button onClick={cancelEdit} className="px-5 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary border border-border">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 text-sm">
                                {[
                                    { label: 'Subject',     value: active.subject },
                                    { label: 'Heading',     value: active.heading },
                                    { label: 'Body',        value: active.body },
                                    { label: 'Footer note', value: active.note || '—' },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-text-secondary block mb-0.5">{label}</span>
                                        <span className="text-text-primary leading-relaxed">{value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right — live preview */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Live Preview</span>
                    <button onClick={() => setShowPreview(p => !p)} className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors">
                        {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {showPreview ? 'Hide' : 'Show'}
                    </button>
                </div>
                {showPreview && previewTpl && (
                    <div className="rounded-2xl overflow-hidden border border-border shadow-card">
                        <div className="bg-surface border-b border-border px-4 py-2.5 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-400" />
                            <span className="w-3 h-3 rounded-full bg-yellow-400" />
                            <span className="w-3 h-3 rounded-full bg-green-400" />
                            <span className="ml-3 text-xs text-text-secondary font-mono truncate">
                                {(form.subject || previewTpl.subject)
                                    .replace('{{date}}', SAMPLE.date)
                                    .replace('{{name}}', SAMPLE.name.split(' ')[0])
                                    .replace('{{invoice_number}}', SAMPLE.invoice.invoiceNumber)
                                    .replace('{{due_date}}', SAMPLE.invoice.dueDate)
                                    .replace('{{amount}}', `${SAMPLE.invoice.currency} ${SAMPLE.invoice.total.toLocaleString()}.00`)}
                            </span>
                        </div>
                        <iframe
                            key={activeId + JSON.stringify(form)}
                            srcDoc={buildPreview(activeId, previewTpl as EmailTemplate)}
                            title="Email preview"
                            className="w-full bg-white"
                            style={{ height: '780px', border: 'none' }}
                            sandbox="allow-same-origin"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

