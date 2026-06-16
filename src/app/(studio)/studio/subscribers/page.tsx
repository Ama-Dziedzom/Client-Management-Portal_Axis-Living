'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, UserPlus, Trash2, Search, Mail, X, Check, Send } from '@/lib/icons'
import NurtureSequenceTab from '@/components/studio/NurtureSequenceTab'

interface Subscriber {
    id: string
    email: string
    name: string | null
    subscribed_at: string
    emails_sent: number
}

interface NurtureEmail {
    id: string
    subject: string
    sequence_order: number
    active: boolean
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getInitials(name: string | null, email: string) {
    if (name) return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    return email[0].toUpperCase()
}

type SubscribersTab = 'subscribers' | 'sequence'

export default function SubscribersPage() {
    const [tab, setTab] = useState<SubscribersTab>('subscribers')
    const [subscribers, setSubscribers] = useState<Subscriber[]>([])
    const [nurtureEmails, setNurtureEmails] = useState<NurtureEmail[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const [addOpen, setAddOpen] = useState(false)
    const [addForm, setAddForm] = useState({ email: '', name: '' })
    const [adding, setAdding] = useState(false)
    const [addDone, setAddDone] = useState(false)

    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)

    const [sendPickerId, setSendPickerId] = useState<string | null>(null)
    const [sending, setSending] = useState(false)
    const [sentResult, setSentResult] = useState<{ subscriberId: string; subject: string } | null>(null)

    useEffect(() => {
        Promise.all([fetchSubscribers(), fetchNurtureEmails()])
    }, [])

    const fetchSubscribers = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/studio/contacts')
            const result = await res.json()
            setSubscribers(result.data ?? [])
        } catch {
            setSubscribers([])
        } finally {
            setLoading(false)
        }
    }

    const fetchNurtureEmails = async () => {
        try {
            const res = await fetch('/api/studio/nurture-emails')
            const result = await res.json()
            setNurtureEmails(result.data ?? [])
        } catch {
            setNurtureEmails([])
        }
    }

    const addSubscriber = async () => {
        if (!addForm.email.includes('@')) return
        setAdding(true)
        try {
            const res = await fetch('/api/studio/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addForm),
            })
            const result = await res.json()
            if (result.data) {
                setSubscribers(prev => [{ ...result.data, emails_sent: 0 }, ...prev])
                setAddForm({ email: '', name: '' })
                setAddOpen(false)
                setAddDone(true)
                setTimeout(() => setAddDone(false), 2500)
            }
        } finally {
            setAdding(false)
        }
    }

    const deleteSubscriber = async (id: string) => {
        setDeleting(true)
        try {
            await fetch(`/api/studio/contacts/${id}`, { method: 'DELETE' })
            setSubscribers(prev => prev.filter(s => s.id !== id))
            setDeleteId(null)
        } finally {
            setDeleting(false)
        }
    }

    const sendEmail = async (subscriberId: string, nurtureEmailId: string) => {
        setSending(true)
        try {
            const res = await fetch(`/api/studio/nurture-emails/${nurtureEmailId}/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscriber_id: subscriberId }),
            })
            const result = await res.json()
            const email = nurtureEmails.find(e => e.id === nurtureEmailId)
            if (result.sent > 0) {
                setSubscribers(prev => prev.map(s => s.id === subscriberId ? { ...s, emails_sent: s.emails_sent + 1 } : s))
                setSentResult({ subscriberId, subject: email?.subject ?? '' })
                setTimeout(() => setSentResult(null), 4000)
            }
            setSendPickerId(null)
        } finally {
            setSending(false)
        }
    }

    const filtered = subscribers.filter(s =>
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        (s.name ?? '').toLowerCase().includes(search.toLowerCase())
    )

    const totalSent = subscribers.reduce((sum, s) => sum + s.emails_sent, 0)

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-text-primary mb-2">Subscribers</h1>
                    <p className="text-text-secondary font-body text-lg">Everyone captured via lookbook downloads and consultation bookings</p>
                </div>
                {tab === 'subscribers' && (
                    <button
                        onClick={() => setAddOpen(true)}
                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                        <UserPlus className="w-4 h-4" /> Add Subscriber
                    </button>
                )}
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 bg-surface border border-border rounded-xl p-1 w-fit mb-8">
                {([['subscribers', 'Subscribers'], ['sequence', 'Nurture Sequence']] as [SubscribersTab, string][]).map(([key, label]) => (
                    <button key={key} onClick={() => setTab(key)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-accent/20 text-primary border border-accent/30' : 'text-text-secondary hover:text-text-primary'}`}>
                        {label}
                    </button>
                ))}
            </div>

            {tab === 'sequence' ? (
                <NurtureSequenceTab />
            ) : (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                        {[
                            { label: 'Total subscribers', value: subscribers.length, icon: Users },
                            { label: 'Emails sent', value: totalSent, icon: Send },
                            { label: 'Avg per subscriber', value: subscribers.length ? (totalSent / subscribers.length).toFixed(1) : '0', icon: Mail },
                        ].map(({ label, value, icon: Icon }) => (
                            <div key={label} className="card-flat flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-2xl font-semibold text-text-primary">{value}</div>
                                    <div className="text-xs text-text-secondary">{label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add subscriber panel */}
                    <AnimatePresence>
                        {addOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="card-flat mb-6 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-text-secondary flex items-center gap-2">
                                        <UserPlus className="w-3.5 h-3.5" /> New Subscriber
                                    </span>
                                    <button onClick={() => { setAddOpen(false); setAddForm({ email: '', name: '' }) }}
                                        className="text-text-secondary hover:text-text-primary transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary block mb-1.5">Email *</label>
                                        <input
                                            type="email"
                                            value={addForm.email}
                                            onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                                            onKeyDown={e => e.key === 'Enter' && addSubscriber()}
                                            placeholder="hello@example.com"
                                            className="input-field w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary block mb-1.5">Name</label>
                                        <input
                                            value={addForm.name}
                                            onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                                            onKeyDown={e => e.key === 'Enter' && addSubscriber()}
                                            placeholder="Optional"
                                            className="input-field w-full"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={addSubscriber}
                                        disabled={adding || !addForm.email.includes('@')}
                                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                                    >
                                        <UserPlus className="w-4 h-4" /> {adding ? 'Adding…' : 'Add to List'}
                                    </button>
                                    <button
                                        onClick={() => { setAddOpen(false); setAddForm({ email: '', name: '' }) }}
                                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary border border-border"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Search + list */}
                    <div className="card-flat space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search by name or email…"
                                    className="input-field w-full pl-9"
                                />
                            </div>
                            {addDone && (
                                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 flex-shrink-0">
                                    <Check className="w-3.5 h-3.5" /> Added
                                </span>
                            )}
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="w-10 h-10 text-text-secondary/30 mx-auto mb-3" />
                                <p className="text-text-secondary text-sm">
                                    {search ? 'No subscribers match your search.' : 'No subscribers yet. They appear here when someone downloads the lookbook or books a consultation.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-3 pb-1 border-b border-border">
                                    {['Subscriber', 'Email', 'Subscribed', 'Sent', ''].map((h, i) => (
                                        <span key={i} className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">{h}</span>
                                    ))}
                                </div>

                                <AnimatePresence>
                                    {filtered.map(subscriber => (
                                        <motion.div
                                            key={subscriber.id}
                                            layout
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -8 }}
                                            className="group"
                                        >
                                            {deleteId === subscriber.id ? (
                                                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-red-50 border border-red-100">
                                                    <p className="text-sm text-text-secondary flex-1">Remove <strong>{subscriber.email}</strong> from the list? This also clears their nurture history.</p>
                                                    <button
                                                        onClick={() => deleteSubscriber(subscriber.id)}
                                                        disabled={deleting}
                                                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 disabled:opacity-50"
                                                    >
                                                        {deleting ? 'Removing…' : 'Remove'}
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteId(null)}
                                                        className="px-3 py-1.5 border border-border rounded-lg text-xs text-text-secondary hover:text-text-primary"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : sendPickerId === subscriber.id ? (
                                                <div className="px-3 py-3 rounded-xl bg-accent/5 border border-accent/20 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm text-text-secondary">
                                                            Send a nurture email to <strong>{subscriber.name || subscriber.email}</strong>
                                                        </p>
                                                        <button onClick={() => setSendPickerId(null)} className="text-text-secondary hover:text-text-primary">
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        {nurtureEmails.length === 0 ? (
                                                            <p className="text-xs text-text-secondary">No nurture emails set up yet.</p>
                                                        ) : nurtureEmails.map(email => (
                                                            <button
                                                                key={email.id}
                                                                onClick={() => sendEmail(subscriber.id, email.id)}
                                                                disabled={sending}
                                                                className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-surface hover:bg-accent/10 border border-border text-left transition-colors disabled:opacity-50"
                                                            >
                                                                <div className="flex items-center gap-2 min-w-0">
                                                                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                                                        {email.sequence_order}
                                                                    </span>
                                                                    <span className="text-sm text-text-primary truncate">{email.subject}</span>
                                                                    {!email.active && (
                                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-border text-text-secondary font-bold uppercase flex-shrink-0">Paused</span>
                                                                    )}
                                                                </div>
                                                                <Send className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto_auto_auto] gap-x-4 gap-y-1 items-center px-3 py-3 rounded-xl hover:bg-surface transition-colors">
                                                        <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                                                            {getInitials(subscriber.name, subscriber.email)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            {subscriber.name && (
                                                                <p className="text-sm font-medium text-text-primary truncate">{subscriber.name}</p>
                                                            )}
                                                            <p className="text-sm text-text-secondary truncate">{subscriber.email}</p>
                                                        </div>
                                                        <div className="hidden sm:block text-sm text-text-secondary whitespace-nowrap">
                                                            {formatDate(subscriber.subscribed_at)}
                                                        </div>
                                                        <div className="hidden sm:flex items-center justify-end">
                                                            <span className="text-sm text-text-secondary w-6 text-right">{subscriber.emails_sent}</span>
                                                        </div>
                                                        <div className="hidden sm:flex items-center gap-1 justify-end">
                                                            {sentResult?.subscriberId === subscriber.id ? (
                                                                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                                                    <Check className="w-3.5 h-3.5" /> Sent
                                                                </span>
                                                            ) : (
                                                                <button
                                                                    onClick={() => { setSendPickerId(subscriber.id); setDeleteId(null) }}
                                                                    title="Send email"
                                                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-accent/10 text-text-secondary hover:text-primary transition-all"
                                                                >
                                                                    <Send className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => setDeleteId(subscriber.id)}
                                                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-500 transition-all"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {sentResult?.subscriberId === subscriber.id && (
                                                        <p className="hidden sm:block text-xs text-emerald-600 px-3 pb-1">
                                                            &ldquo;{sentResult.subject}&rdquo; sent successfully
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                <p className="text-xs text-text-secondary pt-2 border-t border-border">
                                    {filtered.length} of {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
                                </p>
                            </>
                        )}
                    </div>
                </>
            )}
        </motion.div>
    )
}
