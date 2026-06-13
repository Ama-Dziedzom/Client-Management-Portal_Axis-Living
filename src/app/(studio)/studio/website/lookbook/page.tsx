'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { studioSupabase as supabase } from '@/lib/supabase'
import { WebsiteLookbook } from '@/types/database'
import { BookMarked, Plus, Trash2, ToggleLeft, ToggleRight, Loader2, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function LookbookPage() {
    const [lookbooks, setLookbooks] = useState<WebsiteLookbook[]>([])
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({ name: '', file_url: '', thumbnail_url: '', active: true })

    useEffect(() => { fetchLookbooks() }, [])

    async function fetchLookbooks() {
        const { data } = await supabase.from('website_lookbooks').select('*').order('created_at', { ascending: false })
        setLookbooks(data ?? [])
        setLoading(false)
    }

    async function toggleActive(lb: WebsiteLookbook) {
        await supabase.from('website_lookbooks').update({ active: !lb.active }).eq('id', lb.id)
        setLookbooks(prev => prev.map(l => l.id === lb.id ? { ...l, active: !l.active } : l))
    }

    async function deleteLookbook(id: string) {
        if (!confirm('Delete this lookbook?')) return
        await supabase.from('website_lookbooks').delete().eq('id', id)
        setLookbooks(prev => prev.filter(l => l.id !== id))
    }

    async function handleAdd() {
        if (!form.name || !form.file_url) { setError('Name and file URL are required.'); return }
        setSaving(true)
        setError('')
        const { data, error: err } = await supabase.from('website_lookbooks').insert({
            name: form.name,
            file_url: form.file_url,
            thumbnail_url: form.thumbnail_url || null,
            active: form.active,
        }).select().single()
        if (err) { setError(err.message); setSaving(false); return }
        if (data) setLookbooks(prev => [data, ...prev])
        setForm({ name: '', file_url: '', thumbnail_url: '', active: true })
        setSaving(false)
        setAdding(false)
    }

    if (loading) return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-text-primary mb-2">Lookbook</h1>
                    <p className="text-text-secondary font-body text-lg">Manage lookbook files for email campaigns</p>
                </div>
                {!adding && (
                    <button onClick={() => setAdding(true)} className="btn-primary w-full sm:w-auto">
                        <Plus className="w-4 h-4" /> Add Lookbook
                    </button>
                )}
            </motion.div>

            {adding && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="card-flat mb-8 space-y-5 max-w-lg">
                    <h2 className="font-heading font-semibold text-text-primary">New Lookbook</h2>
                    {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Name *</label>
                        <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="e.g. Spring 2025 Lookbook" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">File URL *</label>
                        <input type="text" value={form.file_url} onChange={e => setForm(p => ({ ...p, file_url: e.target.value }))} className="input-field" placeholder="https://... (PDF or image)" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Thumbnail URL (optional)</label>
                        <input type="text" value={form.thumbnail_url} onChange={e => setForm(p => ({ ...p, thumbnail_url: e.target.value }))} className="input-field" placeholder="https://..." />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 rounded accent-primary" />
                        <span className="font-medium text-text-primary">Active (visible in email templates)</span>
                    </label>
                    <div className="flex gap-3">
                        <button onClick={handleAdd} disabled={saving} className="btn-primary">
                            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Add Lookbook'}
                        </button>
                        <button onClick={() => { setAdding(false); setError('') }} className="btn-secondary">Cancel</button>
                    </div>
                </motion.div>
            )}

            {lookbooks.length === 0 ? (
                <motion.div variants={item} className="card-flat flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-accent/15 rounded-2xl flex items-center justify-center mb-4">
                        <BookMarked className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">No lookbooks yet</h3>
                    <p className="text-sm text-text-secondary">Upload lookbook files to feature in email campaigns.</p>
                </motion.div>
            ) : (
                <motion.div variants={container} className="space-y-3">
                    {lookbooks.map(lb => (
                        <motion.div key={lb.id} variants={item}>
                            <div className="card-flat flex flex-col sm:flex-row sm:items-center gap-4">
                                {lb.thumbnail_url && (
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-accent/15 flex-shrink-0">
                                        <img src={lb.thumbnail_url} alt={lb.name} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                {!lb.thumbnail_url && (
                                    <div className="w-16 h-16 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
                                        <BookMarked className="w-6 h-6 text-accent" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-text-primary truncate">{lb.name}</h3>
                                    <p className="text-xs text-text-secondary mt-0.5">Added {formatDate(lb.created_at, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className={`badge ${lb.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                        {lb.active ? 'Active' : 'Inactive'}
                                    </span>
                                    <a href={lb.file_url} target="_blank" rel="noopener noreferrer" className="btn-ghost p-2 text-text-secondary">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                    <button onClick={() => toggleActive(lb)} className="btn-ghost p-2 text-text-secondary" title={lb.active ? 'Deactivate' : 'Activate'}>
                                        {lb.active ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5" />}
                                    </button>
                                    <button onClick={() => deleteLookbook(lb.id)} className="btn-ghost p-2 text-red-400 hover:text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    )
}
