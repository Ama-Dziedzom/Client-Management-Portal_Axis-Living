'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { emailTemplates, wrap, btn, randomImage } from '@/lib/emailTemplates'
import {
    Copy, Check, Plus, Pencil, Trash2, ChevronUp, ChevronDown,
    ToggleLeft, ToggleRight, X, Save, Clock, Mail, Eye, EyeOff,
} from 'lucide-react'

// Renders a nurture email body into the standard Axis Living email layout
function buildNurturePreview(subject: string, body: string): string {
    const name = 'Ama'
    const replaced = body.replace(/\{\{name\}\}/gi, name)
    const blocks = replaced.split(/\n\n+/).map((b: string) => b.trim()).filter(Boolean)

    let idx = 0
    if (blocks[0]?.match(/^(hi|hello)\b/i)) idx = 1

    const remaining = blocks.slice(idx)
    const bodyText: string = remaining[0]?.replace(/\n/g, ' ') ?? ''

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contentParts = remaining.slice(1).map((block: string): string => {
        const btnMatch = block.match(/^\[BUTTON:\s*(.+?)\s*\|\s*(.+?)\]$/)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (btnMatch) return (btn as any)(btnMatch[1].trim(), btnMatch[2].trim())
        return `<p style="margin:18px 0 0;font-size:15px;line-height:1.75;color:#6B7280;text-align:center;">${block.replace(/\n/g, '<br/>')}</p>`
    })
    contentParts.push(`<p style="margin:36px 0 0;font-style:italic;font-family:Georgia,serif;font-size:16px;color:#2F402C;text-align:center;">Kas</p>`)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (wrap as any)({
        image: (randomImage as any)(),
        heading: subject.replace(/\{\{name\}\}/gi, name),
        body: bodyText,
        content: contentParts.join('\n'),
        note: 'You received this because you signed up at axisliving.co.zm. Reply to unsubscribe.',
    })
}

// ───── Types ─────

interface NurtureEmail {
    id: string
    sequence_order: number
    delay_days: number
    subject: string
    body: string
    active: boolean
    created_at: string
    updated_at: string
}

// ───── Template Preview Tab ─────

const SAMPLE = {
    name: 'Ama Dziedzom',
    date: 'June 20, 2026',
    time: '10:00 AM',
    meetingLink: 'https://meet.google.com/owu-zhiz-bns',
    email: 'hello@axisliving.co.zm',
    password: 'Ax!s2026',
    portalUrl: 'https://portal.axisliving.co.zm',
    messagePreview: "Your moodboard for the living room is ready — I've included two directions for you to review before our next check-in.",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const templates: { id: string; label: string; timing: string; generate: () => any }[] = [
    {
        id: 'lookbook',
        label: 'Lookbook Delivery',
        timing: 'On lookbook sign-up',
        generate: () => (emailTemplates as any).lookbookDelivery(SAMPLE.name.split(' ')[0]),
    },
    {
        id: 'booking',
        label: 'Booking Confirmation',
        timing: 'On consultation booked',
        generate: () => (emailTemplates as any).bookingConfirmation(SAMPLE.name, SAMPLE.date, SAMPLE.time, SAMPLE.meetingLink),
    },
    {
        id: 'cancelled',
        label: 'Booking Cancelled',
        timing: 'On client self-cancellation',
        generate: () => (emailTemplates as any).bookingCancelled?.(SAMPLE.name, SAMPLE.date, SAMPLE.time) ?? { subject: 'N/A', html: '<p>Template not found</p>' },
    },
    {
        id: 'portal',
        label: 'Portal Welcome',
        timing: 'On client portal created',
        generate: () => (emailTemplates as any).portalWelcome(SAMPLE.name, SAMPLE.email, SAMPLE.password, SAMPLE.portalUrl),
    },
    {
        id: 'message',
        label: 'New Message',
        timing: 'On designer message sent',
        generate: () => (emailTemplates as any).newPortalMessage(SAMPLE.name, SAMPLE.messagePreview, SAMPLE.portalUrl),
    },
]

function EmailPreviewTab() {
    const [active, setActive] = useState(templates[0].id)
    const current = templates.find(t => t.id === active)!
    const { subject, html } = current.generate()

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-6">
                {templates.map(t => (
                    <button key={t.id} onClick={() => setActive(t.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${active === t.id ? 'bg-accent/20 text-primary border-accent/30' : 'bg-surface text-text-secondary border-border hover:text-text-primary'}`}>
                        {t.label}
                    </button>
                ))}
            </div>
            <div className="card-flat mb-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-8">
                <div className="flex items-center gap-3 text-sm">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Trigger</span>
                    <span className="text-text-primary">{current.timing}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Subject</span>
                    <span className="text-text-primary">{subject}</span>
                </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border shadow-card">
                <div className="bg-surface border-b border-border px-4 py-2.5 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="ml-3 text-xs text-text-secondary font-mono truncate">{subject}</span>
                </div>
                <iframe key={active} srcDoc={html} title={`Preview: ${current.label}`}
                    className="w-full bg-white" style={{ height: '780px', border: 'none' }} sandbox="allow-same-origin" />
            </div>
        </div>
    )
}

// ───── Nurture Sequence Editor ─────

const EMPTY_FORM = { subject: '', body: '', delay_days: 0 }

function delayLabel(days: number) {
    if (days === 0) return 'Immediate'
    if (days === 1) return 'Day 1'
    return `Day ${days}`
}

function NurtureTab() {
    const [emails, setEmails] = useState<NurtureEmail[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState(EMPTY_FORM)
    const [addingNew, setAddingNew] = useState(false)
    const [newForm, setNewForm] = useState(EMPTY_FORM)
    const [saving, setSaving] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [previewId, setPreviewId] = useState<string | null>(null)

    useEffect(() => { fetchEmails() }, [])

    const fetchEmails = async () => {
        setLoading(true)
        const res = await fetch('/api/studio/nurture-emails')
        const result = await res.json()
        setEmails(result.data ?? [])
        setLoading(false)
    }

    const startEdit = (email: NurtureEmail) => {
        setEditingId(email.id)
        setEditForm({ subject: email.subject, body: email.body, delay_days: email.delay_days })
        setAddingNew(false)
    }

    const cancelEdit = () => { setEditingId(null); setEditForm(EMPTY_FORM) }

    const saveEdit = async () => {
        if (!editingId) return
        setSaving(true)
        await fetch(`/api/studio/nurture-emails/${editingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editForm),
        })
        await fetchEmails()
        setEditingId(null)
        setSaving(false)
    }

    const toggleActive = async (email: NurtureEmail) => {
        await fetch(`/api/studio/nurture-emails/${email.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ active: !email.active }),
        })
        setEmails(prev => prev.map(e => e.id === email.id ? { ...e, active: !e.active } : e))
    }

    const deleteEmail = async (id: string) => {
        await fetch(`/api/studio/nurture-emails/${id}`, { method: 'DELETE' })
        setEmails(prev => prev.filter(e => e.id !== id))
        setDeleteConfirmId(null)
    }

    const reorder = async (index: number, direction: 'up' | 'down') => {
        const swapIndex = direction === 'up' ? index - 1 : index + 1
        if (swapIndex < 0 || swapIndex >= emails.length) return

        const updated = [...emails]
        const aOrder = updated[index].sequence_order
        const bOrder = updated[swapIndex].sequence_order
        updated[index] = { ...updated[index], sequence_order: bOrder }
        updated[swapIndex] = { ...updated[swapIndex], sequence_order: aOrder }
        updated.sort((a, b) => a.sequence_order - b.sequence_order)
        setEmails(updated)

        await Promise.all([
            fetch(`/api/studio/nurture-emails/${updated[index].id}`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sequence_order: updated[index].sequence_order }),
            }),
            fetch(`/api/studio/nurture-emails/${updated[swapIndex].id}`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sequence_order: updated[swapIndex].sequence_order }),
            }),
        ])
    }

    const addNew = async () => {
        if (!newForm.subject || !newForm.body) return
        setSaving(true)
        await fetch('/api/studio/nurture-emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newForm),
        })
        await fetchEmails()
        setNewForm(EMPTY_FORM)
        setAddingNew(false)
        setSaving(false)
    }

    const copyEmail = (email: NurtureEmail) => {
        navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${email.body}`)
        setCopiedId(email.id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    if (loading) return (
        <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>
    )

    return (
        <div className="space-y-4">
            {/* Hint */}
            <div className="card-flat bg-accent/5 border-accent/20">
                <p className="text-sm text-text-secondary leading-relaxed">
                    These emails are sent automatically to everyone who downloads the lookbook. Use <code className="bg-surface px-1.5 py-0.5 rounded text-xs font-mono">{'{{name}}'}</code> to personalise, and <code className="bg-surface px-1.5 py-0.5 rounded text-xs font-mono">{'[BUTTON: Label | https://url.com]'}</code> to add a call-to-action button.
                </p>
            </div>

            {/* Email cards */}
            <AnimatePresence>
                {emails.map((email, idx) => (
                    <motion.div key={email.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className={`card-flat transition-opacity ${!email.active ? 'opacity-50' : ''}`}>

                        {editingId === email.id ? (
                            /* ── Edit form ── */
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Editing Email {email.sequence_order}</span>
                                    <button onClick={cancelEdit} className="text-text-secondary hover:text-text-primary"><X className="w-4 h-4" /></button>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary block mb-1.5">Subject</label>
                                    <input value={editForm.subject} onChange={e => setEditForm(f => ({ ...f, subject: e.target.value }))}
                                        className="input-field w-full" placeholder="Email subject line" />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary block mb-1.5">Send after (days from sign-up)</label>
                                    <input type="number" min={0} value={editForm.delay_days} onChange={e => setEditForm(f => ({ ...f, delay_days: parseInt(e.target.value) || 0 }))}
                                        className="input-field w-32" />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary block mb-1.5">Body</label>
                                    <textarea value={editForm.body} onChange={e => setEditForm(f => ({ ...f, body: e.target.value }))}
                                        rows={12} className="input-field w-full resize-y font-mono text-sm" placeholder="Write your email..." />
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={saveEdit} disabled={saving}
                                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                                        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
                                    </button>
                                    <button onClick={cancelEdit} className="px-5 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary border border-border">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* ── Read view ── */
                            <>
                                <div className="flex items-start gap-4">
                                    {/* Sequence + reorder */}
                                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                        <button onClick={() => reorder(idx, 'up')} disabled={idx === 0}
                                            className="p-1 rounded-lg hover:bg-surface disabled:opacity-20 transition-colors">
                                            <ChevronUp className="w-3.5 h-3.5 text-text-secondary" />
                                        </button>
                                        <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                            {email.sequence_order}
                                        </span>
                                        <button onClick={() => reorder(idx, 'down')} disabled={idx === emails.length - 1}
                                            className="p-1 rounded-lg hover:bg-surface disabled:opacity-20 transition-colors">
                                            <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                                <Clock className="w-3 h-3" /> {delayLabel(email.delay_days)}
                                            </span>
                                            {!email.active && (
                                                <span className="px-2.5 py-1 rounded-full bg-border text-text-secondary text-[10px] font-bold uppercase tracking-wider">Paused</span>
                                            )}
                                        </div>
                                        <p className="text-text-primary font-semibold text-sm mb-1">{email.subject}</p>
                                        <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed">{email.body.split('\n')[0]}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <button onClick={() => toggleActive(email)} title={email.active ? 'Pause' : 'Activate'}
                                            className="p-2 rounded-lg hover:bg-surface transition-colors text-text-secondary hover:text-text-primary">
                                            {email.active ? <ToggleRight className="w-5 h-5 text-primary" /> : <ToggleLeft className="w-5 h-5" />}
                                        </button>
                                        <button onClick={() => copyEmail(email)} title="Copy"
                                            className="p-2 rounded-lg hover:bg-surface transition-colors text-text-secondary hover:text-text-primary">
                                            {copiedId === email.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                        <button onClick={() => setPreviewId(previewId === email.id ? null : email.id)} title={previewId === email.id ? 'Close preview' : 'Preview'}
                                            className={`p-2 rounded-lg transition-colors ${previewId === email.id ? 'bg-accent/20 text-primary' : 'hover:bg-surface text-text-secondary hover:text-text-primary'}`}>
                                            {previewId === email.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <button onClick={() => startEdit(email)} title="Edit"
                                            className="p-2 rounded-lg hover:bg-surface transition-colors text-text-secondary hover:text-text-primary">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setDeleteConfirmId(email.id)} title="Delete"
                                            className="p-2 rounded-lg hover:bg-red-50 transition-colors text-text-secondary hover:text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Inline preview */}
                                {previewId === email.id && (
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <div className="rounded-2xl overflow-hidden border border-border shadow-card">
                                            <div className="bg-surface border-b border-border px-4 py-2.5 flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full bg-red-400" />
                                                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                                                <span className="w-3 h-3 rounded-full bg-green-400" />
                                                <span className="ml-3 text-xs text-text-secondary font-mono truncate">{email.subject}</span>
                                            </div>
                                            <iframe
                                                key={email.id}
                                                srcDoc={buildNurturePreview(email.subject, email.body)}
                                                title={`Preview: ${email.subject}`}
                                                className="w-full bg-white"
                                                style={{ height: '780px', border: 'none' }}
                                                sandbox="allow-same-origin"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Delete confirm */}
                                {deleteConfirmId === email.id && (
                                    <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
                                        <p className="text-sm text-text-secondary flex-1">Delete this email? This cannot be undone.</p>
                                        <button onClick={() => deleteEmail(email.id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
                                        <button onClick={() => setDeleteConfirmId(null)}
                                            className="px-4 py-2 border border-border rounded-xl text-sm text-text-secondary hover:text-text-primary">Cancel</button>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Add new email */}
            {addingNew ? (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card-flat space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-text-secondary flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> New Email</span>
                        <button onClick={() => { setAddingNew(false); setNewForm(EMPTY_FORM) }} className="text-text-secondary hover:text-text-primary"><X className="w-4 h-4" /></button>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary block mb-1.5">Subject</label>
                        <input value={newForm.subject} onChange={e => setNewForm(f => ({ ...f, subject: e.target.value }))}
                            className="input-field w-full" placeholder="Email subject line" />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary block mb-1.5">Send after (days from sign-up)</label>
                        <input type="number" min={0} value={newForm.delay_days} onChange={e => setNewForm(f => ({ ...f, delay_days: parseInt(e.target.value) || 0 }))}
                            className="input-field w-32" />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary block mb-1.5">Body</label>
                        <textarea value={newForm.body} onChange={e => setNewForm(f => ({ ...f, body: e.target.value }))}
                            rows={12} className="input-field w-full resize-y font-mono text-sm" placeholder="Write your email..." />
                    </div>
                    <div className="flex gap-3">
                        <button onClick={addNew} disabled={saving || !newForm.subject || !newForm.body}
                            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                            <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Add Email'}
                        </button>
                        <button onClick={() => { setAddingNew(false); setNewForm(EMPTY_FORM) }}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary border border-border">Cancel</button>
                    </div>
                </motion.div>
            ) : (
                <button onClick={() => { setAddingNew(true); setEditingId(null) }}
                    className="w-full py-4 rounded-2xl border-2 border-dashed border-border text-text-secondary hover:text-text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-2 text-sm font-medium">
                    <Plus className="w-4 h-4" /> Add Email to Sequence
                </button>
            )}
        </div>
    )
}

// ───── Page ─────

type Tab = 'preview' | 'nurture'

export default function EmailsPage() {
    const [tab, setTab] = useState<Tab>('preview')

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-text-primary mb-2">Emails</h1>
                <p className="text-text-secondary font-body text-lg">Preview system templates and manage your nurture sequence</p>
            </div>

            <div className="flex gap-1 bg-surface border border-border rounded-xl p-1 w-fit mb-8">
                {([['preview', 'Template Preview'], ['nurture', 'Nurture Sequence']] as [Tab, string][]).map(([key, label]) => (
                    <button key={key} onClick={() => setTab(key)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-accent/20 text-primary border border-accent/30' : 'text-text-secondary hover:text-text-primary'}`}>
                        {label}
                    </button>
                ))}
            </div>

            {tab === 'preview' ? <EmailPreviewTab /> : <NurtureTab />}
        </motion.div>
    )
}
