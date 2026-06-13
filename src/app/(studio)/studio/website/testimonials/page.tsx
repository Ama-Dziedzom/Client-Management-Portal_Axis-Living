'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { studioSupabase as supabase } from '@/lib/supabase'
import { WebsiteTestimonial } from '@/types/database'
import { Star, Plus, Pencil, Trash2, Loader2 } from '@/lib/icons'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

const emptyForm = (): Omit<WebsiteTestimonial, 'id' | 'created_at'> => ({
    name: '', quote: '', project: null, avatar_url: null, featured: false, display_order: 0,
})

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<WebsiteTestimonial[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<WebsiteTestimonial | null>(null)
    const [adding, setAdding] = useState(false)
    const [form, setForm] = useState(emptyForm())
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => { fetchTestimonials() }, [])

    async function fetchTestimonials() {
        const { data } = await supabase.from('website_testimonials').select('*').order('display_order', { ascending: true })
        setTestimonials(data ?? [])
        setLoading(false)
    }

    function openAdd() {
        setForm(emptyForm())
        setError('')
        setEditing(null)
        setAdding(true)
    }

    function openEdit(t: WebsiteTestimonial) {
        setForm({ name: t.name, quote: t.quote, project: t.project, avatar_url: t.avatar_url, featured: t.featured, display_order: t.display_order })
        setError('')
        setEditing(t)
        setAdding(true)
    }

    function closeForm() { setAdding(false); setEditing(null) }

    async function handleSave() {
        if (!form.name || !form.quote) { setError('Name and quote are required.'); return }
        setSaving(true)
        setError('')
        if (editing) {
            const { error: err } = await supabase.from('website_testimonials').update(form).eq('id', editing.id)
            if (err) { setError(err.message); setSaving(false); return }
            setTestimonials(prev => prev.map(t => t.id === editing.id ? { ...t, ...form } : t))
        } else {
            const { data, error: err } = await supabase.from('website_testimonials').insert(form).select().single()
            if (err) { setError(err.message); setSaving(false); return }
            if (data) setTestimonials(prev => [...prev, data])
        }
        setSaving(false)
        closeForm()
    }

    async function deleteTestimonial(id: string) {
        if (!confirm('Delete this testimonial?')) return
        await supabase.from('website_testimonials').delete().eq('id', id)
        setTestimonials(prev => prev.filter(t => t.id !== id))
    }

    if (loading) return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-text-primary mb-2">Testimonials</h1>
                    <p className="text-text-secondary font-body text-lg">Manage client quotes on the website</p>
                </div>
                {!adding && (
                    <button onClick={openAdd} className="btn-primary w-full sm:w-auto">
                        <Plus className="w-4 h-4" /> Add Testimonial
                    </button>
                )}
            </motion.div>

            {adding && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="card-flat mb-8 space-y-5 max-w-lg">
                    <h2 className="font-heading font-semibold text-text-primary">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h2>
                    {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Client Name *</label>
                        <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="e.g. Sarah Mensah" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Quote *</label>
                        <textarea value={form.quote} onChange={e => setForm(p => ({ ...p, quote: e.target.value }))} rows={4} className="input-field resize-none" placeholder="What did they say?" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Project (optional)</label>
                        <input type="text" value={form.project ?? ''} onChange={e => setForm(p => ({ ...p, project: e.target.value }))} className="input-field" placeholder="e.g. Accra Family Home" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Avatar URL (optional)</label>
                        <input type="text" value={form.avatar_url ?? ''} onChange={e => setForm(p => ({ ...p, avatar_url: e.target.value }))} className="input-field" placeholder="https://..." />
                    </div>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                            <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 rounded accent-primary" />
                            <span className="font-medium text-text-primary">Featured</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-text-primary">Order</label>
                            <input type="number" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: Number(e.target.value) }))} className="input-field w-20 text-sm" min={0} />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleSave} disabled={saving} className="btn-primary">
                            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : editing ? 'Save Changes' : 'Add Testimonial'}
                        </button>
                        <button onClick={closeForm} className="btn-secondary">Cancel</button>
                    </div>
                </motion.div>
            )}

            {testimonials.length === 0 ? (
                <motion.div variants={item} className="card-flat flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-accent/15 rounded-2xl flex items-center justify-center mb-4">
                        <Star className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">No testimonials yet</h3>
                    <p className="text-sm text-text-secondary">Add client quotes to build trust on your website.</p>
                </motion.div>
            ) : (
                <motion.div variants={container} className="space-y-4">
                    {testimonials.map(t => (
                        <motion.div key={t.id} variants={item}>
                            <div className="card-flat flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-accent/20 flex-shrink-0 flex items-center justify-center">
                                    {t.avatar_url
                                        ? <img src={t.avatar_url} alt={t.name} className="w-full h-full object-cover" />
                                        : <span className="text-sm font-bold text-primary">{t.name[0]}</span>
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-text-primary">{t.name}</span>
                                        {t.featured && (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                                <Star className="w-3 h-3" /> Featured
                                            </span>
                                        )}
                                        {t.project && <span className="text-xs text-text-secondary">· {t.project}</span>}
                                    </div>
                                    <p className="text-sm text-text-secondary mt-1 line-clamp-2 italic">&ldquo;{t.quote}&rdquo;</p>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <button onClick={() => openEdit(t)} className="btn-ghost p-2 text-text-secondary"><Pencil className="w-4 h-4" /></button>
                                    <button onClick={() => deleteTestimonial(t.id)} className="btn-ghost p-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    )
}
