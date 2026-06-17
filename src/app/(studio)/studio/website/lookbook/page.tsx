'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { studioSupabase as supabase } from '@/lib/supabase'
import { WebsiteLookbook } from '@/types/database'
import { BookMarked, Plus, Trash2, ToggleLeft, ToggleRight, Loader2, ExternalLink, ArrowLeft, Upload } from '@/lib/icons'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function LookbookPage() {
    const [lookbooks, setLookbooks] = useState<WebsiteLookbook[]>([])
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({ name: '', file_url: '', file_name: '', thumbnail_url: '', active: true })

    useEffect(() => { fetchLookbooks() }, [])

    async function fetchLookbooks() {
        const { data } = await supabase.from('website_lookbooks').select('*').order('created_at', { ascending: false })
        setLookbooks(data ?? [])
        setLoading(false)
    }

    async function toggleActive(lb: WebsiteLookbook) {
        const { error } = await supabase.from('website_lookbooks').update({ active: !lb.active }).eq('id', lb.id)
        if (error) { toast.error('Failed to update'); return }
        setLookbooks(prev => prev.map(l => l.id === lb.id ? { ...l, active: !l.active } : l))
        toast.success(lb.active ? 'Lookbook deactivated' : 'Lookbook activated')
    }

    async function deleteLookbook(lb: WebsiteLookbook) {
        if (!confirm('Delete this lookbook?')) return
        const { error } = await supabase.from('website_lookbooks').delete().eq('id', lb.id)
        if (error) { toast.error('Failed to delete'); return }
        const storageParts = lb.file_url.split('/storage/v1/object/public/Documents/')
        if (storageParts[1]) await supabase.storage.from('Documents').remove([storageParts[1]])
        setLookbooks(prev => prev.filter(l => l.id !== lb.id))
        toast.success('Lookbook deleted')
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.type !== 'application/pdf') { toast.error('Only PDF files are allowed.'); setError('Only PDF files are allowed.'); return }
        setUploading(true)
        setError('')
        const storagePath = `lookbooks/${Date.now()}-${file.name.replace(/\s+/g, '_')}`
        const { error: uploadError } = await supabase.storage
            .from('Documents')
            .upload(storagePath, file, { cacheControl: '3600', upsert: false })
        if (uploadError) { toast.error(uploadError.message); setError(uploadError.message); setUploading(false); return }
        const { data: urlData } = supabase.storage.from('Documents').getPublicUrl(storagePath)
        setForm(p => ({ ...p, file_url: urlData.publicUrl, file_name: file.name }))
        toast.success('PDF uploaded')
        setUploading(false)
    }

    async function handleAdd() {
        if (!form.name || !form.file_url) { setError('Name and a PDF file are required.'); return }
        setSaving(true)
        setError('')
        const { data, error: err } = await supabase.from('website_lookbooks').insert({
            name: form.name,
            file_url: form.file_url,
            thumbnail_url: form.thumbnail_url || null,
            active: form.active,
        }).select().single()
        if (err) { setError(err.message); setSaving(false); toast.error(err.message); return }
        if (data) setLookbooks(prev => [data, ...prev])
        setForm({ name: '', file_url: '', file_name: '', thumbnail_url: '', active: true })
        setSaving(false)
        setAdding(false)
        toast.success('Lookbook added')
    }

    if (loading) return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="mb-10">
                <Link
                    href="/studio/website"
                    className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Website
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-text-primary mb-2">Lookbook</h1>
                        <p className="text-text-secondary font-body text-lg">Visitors share their email on your website and receive the lookbook in their inbox</p>
                    </div>
                    {!adding && (
                        <button onClick={() => setAdding(true)} className="btn-primary w-full sm:w-auto">
                            <Plus className="w-4 h-4" /> Add Lookbook
                        </button>
                    )}
                </div>
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
                        <label className="block text-sm font-medium text-text-primary mb-1.5">PDF File *</label>
                        <label className={`flex items-center gap-3 input-field cursor-pointer ${form.file_url ? 'border-emerald-400 bg-emerald-50/40' : ''}`}>
                            <Upload className="w-4 h-4 flex-shrink-0 text-text-secondary" />
                            <span className={`text-sm truncate ${form.file_url ? 'text-emerald-700 font-medium' : 'text-text-secondary'}`}>
                                {uploading ? 'Uploading…' : form.file_name || 'Click to upload PDF'}
                            </span>
                            <input type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="sr-only" disabled={uploading} />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Thumbnail URL (optional)</label>
                        <input type="text" value={form.thumbnail_url} onChange={e => setForm(p => ({ ...p, thumbnail_url: e.target.value }))} className="input-field" placeholder="https://..." />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 rounded accent-primary" />
                        <span className="font-medium text-text-primary">Active — sent to subscribers who sign up</span>
                    </label>
                    <div className="flex gap-3">
                        <button onClick={handleAdd} disabled={saving || uploading} className="btn-primary">
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
                    <p className="text-sm text-text-secondary">Upload a lookbook PDF — subscribers receive it in their inbox after signing up on your website.</p>
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
                                    <button onClick={() => deleteLookbook(lb)} className="btn-ghost p-2 text-red-400 hover:text-red-600">
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
