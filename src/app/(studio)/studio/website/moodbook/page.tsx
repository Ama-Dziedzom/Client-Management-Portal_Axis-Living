'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { studioSupabase as supabase } from '@/lib/supabase'
import { Palette, Plus, Trash2, ArrowLeft, ExternalLink, Eye, EyeOff, Loader2, Upload } from '@/lib/icons'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface Moodbook {
    id: string
    title: string
    description: string | null
    cover_url: string | null
    file_url: string
    published: boolean
    created_at: string
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

const emptyForm = () => ({ title: '', description: '', cover_url: '', file_url: '', file_name: '', published: true })

export default function MoodbookPage() {
    const [moodbooks, setMoodbooks] = useState<Moodbook[]>([])
    const [loading, setLoading]     = useState(true)
    const [adding, setAdding]       = useState(false)
    const [saving, setSaving]       = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError]         = useState('')
    const [form, setForm]           = useState(emptyForm())

    useEffect(() => { fetchMoodbooks() }, [])

    async function fetchMoodbooks() {
        const { data } = await supabase
            .from('website_moodbooks')
            .select('*')
            .order('created_at', { ascending: false })
        setMoodbooks(data ?? [])
        setLoading(false)
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.type !== 'application/pdf') { toast.error('Only PDF files are allowed.'); setError('Only PDF files are allowed.'); return }
        setUploading(true)
        setError('')
        const storagePath = `moodbooks/${Date.now()}-${file.name.replace(/\s+/g, '_')}`
        const { error: uploadError } = await supabase.storage
            .from('Documents')
            .upload(storagePath, file, { cacheControl: '3600', upsert: false })
        if (uploadError) { toast.error(uploadError.message); setError(uploadError.message); setUploading(false); return }
        const { data: urlData } = supabase.storage.from('Documents').getPublicUrl(storagePath)
        setForm(p => ({ ...p, file_url: urlData.publicUrl, file_name: file.name }))
        toast.success('PDF uploaded')
        setUploading(false)
    }

    async function togglePublished(mb: Moodbook) {
        const { error } = await supabase.from('website_moodbooks').update({ published: !mb.published }).eq('id', mb.id)
        if (error) { toast.error('Failed to update'); return }
        setMoodbooks(prev => prev.map(m => m.id === mb.id ? { ...m, published: !m.published } : m))
        toast.success(mb.published ? 'Moodbook deactivated' : 'Moodbook activated')
    }

    async function deleteMoodbook(mb: Moodbook) {
        if (!confirm('Delete this moodbook?')) return
        const { error } = await supabase.from('website_moodbooks').delete().eq('id', mb.id)
        if (error) { toast.error('Failed to delete'); return }
        const storageParts = mb.file_url.split('/storage/v1/object/public/Documents/')
        if (storageParts[1]) await supabase.storage.from('Documents').remove([storageParts[1]])
        setMoodbooks(prev => prev.filter(m => m.id !== mb.id))
        toast.success('Moodbook deleted')
    }

    async function handleAdd() {
        if (!form.title || !form.file_url) { setError('Title and a PDF file are required.'); return }
        setSaving(true)
        setError('')
        const { data, error: err } = await supabase
            .from('website_moodbooks')
            .insert({
                title:       form.title,
                description: form.description || null,
                cover_url:   form.cover_url   || null,
                file_url:    form.file_url,
                published:   form.published,
            })
            .select()
            .single()
        if (err) { setError(err.message); setSaving(false); toast.error(err.message); return }
        if (data) setMoodbooks(prev => [data, ...prev])
        setForm(emptyForm())
        setSaving(false)
        setAdding(false)
        toast.success('Moodbook added')
    }

    if (loading) return (
        <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
    )

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            {/* Header */}
            <motion.div variants={item} className="mb-10">
                <Link
                    href="/studio/website"
                    className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Website
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-text-primary mb-2">Moodbook</h1>
                        <p className="text-text-secondary font-body text-lg">Sent automatically to clients in their booking confirmation email</p>
                    </div>
                    {!adding && (
                        <button onClick={() => setAdding(true)} className="btn-primary w-full sm:w-auto">
                            <Plus className="w-4 h-4" /> Add Moodbook
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Add form */}
            {adding && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-flat mb-8 space-y-5 max-w-lg"
                >
                    <h2 className="font-heading font-semibold text-text-primary">New Moodbook</h2>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Title *</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                            className="input-field"
                            placeholder="e.g. Warm Minimalism — Residence A"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Description</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                            rows={2}
                            className="input-field resize-none"
                            placeholder="Brief note about this mood board..."
                        />
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
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Cover Image URL (optional)</label>
                        <input
                            type="text"
                            value={form.cover_url}
                            onChange={e => setForm(p => ({ ...p, cover_url: e.target.value }))}
                            className="input-field"
                            placeholder="https://... (thumbnail image)"
                        />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <input
                            type="checkbox"
                            checked={form.published}
                            onChange={e => setForm(p => ({ ...p, published: e.target.checked }))}
                            className="w-4 h-4 rounded accent-primary"
                        />
                        <span className="font-medium text-text-primary">Active — include in booking confirmation emails</span>
                    </label>
                    <div className="flex gap-3">
                        <button onClick={handleAdd} disabled={saving || uploading} className="btn-primary">
                            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Add Moodbook'}
                        </button>
                        <button onClick={() => { setAdding(false); setError('') }} className="btn-secondary">
                            Cancel
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Empty state */}
            {moodbooks.length === 0 ? (
                <motion.div variants={item} className="card-flat flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-accent/15 rounded-2xl flex items-center justify-center mb-4">
                        <Palette className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">No moodbooks yet</h3>
                    <p className="text-sm text-text-secondary">Upload a moodbook PDF — active moodbooks are sent to clients in their booking confirmation email.</p>
                </motion.div>
            ) : (
                <motion.div variants={container} className="space-y-3">
                    {moodbooks.map(mb => (
                        <motion.div key={mb.id} variants={item}>
                            <div className="card-flat flex flex-col sm:flex-row sm:items-center gap-4">
                                {/* Cover */}
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-accent/10 flex-shrink-0">
                                    {mb.cover_url ? (
                                        <img src={mb.cover_url} alt={mb.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Palette className="w-6 h-6 text-accent" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-text-primary truncate">{mb.title}</h3>
                                    {mb.description && (
                                        <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">{mb.description}</p>
                                    )}
                                    <p className="text-xs text-text-secondary/60 mt-0.5">
                                        Added {formatDate(mb.created_at, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className={`badge ${mb.published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                        {mb.published ? 'Active' : 'Inactive'}
                                    </span>
                                    <a href={mb.file_url} target="_blank" rel="noopener noreferrer"
                                        className="btn-ghost p-2 text-text-secondary" title="Open PDF">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => togglePublished(mb)}
                                        className="btn-ghost p-2 text-text-secondary"
                                        title={mb.published ? 'Unpublish' : 'Publish'}
                                    >
                                        {mb.published
                                            ? <Eye className="w-4 h-4 text-emerald-500" />
                                            : <EyeOff className="w-4 h-4" />
                                        }
                                    </button>
                                    <button
                                        onClick={() => deleteMoodbook(mb)}
                                        className="btn-ghost p-2 text-red-400 hover:text-red-600"
                                    >
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
