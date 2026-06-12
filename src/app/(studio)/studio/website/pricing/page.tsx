'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { studioSupabase as supabase } from '@/lib/supabase'
import { WebsitePricing } from '@/types/database'
import { Tag, Plus, Pencil, Trash2, X, Loader2, Check } from 'lucide-react'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

const emptyForm = (): Omit<WebsitePricing, 'id' | 'created_at'> => ({
    name: '', price: null, currency: 'GHS', description: null,
    features: [], highlighted: false, display_order: 0,
})

export default function PricingPage() {
    const [packages, setPackages] = useState<WebsitePricing[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<WebsitePricing | null>(null)
    const [adding, setAdding] = useState(false)
    const [form, setForm] = useState(emptyForm())
    const [newFeature, setNewFeature] = useState('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => { fetchPackages() }, [])

    async function fetchPackages() {
        const { data } = await supabase.from('website_pricing').select('*').order('display_order', { ascending: true })
        setPackages(data ?? [])
        setLoading(false)
    }

    function openAdd() {
        setForm(emptyForm())
        setNewFeature('')
        setError('')
        setEditing(null)
        setAdding(true)
    }

    function openEdit(pkg: WebsitePricing) {
        setForm({ name: pkg.name, price: pkg.price, currency: pkg.currency, description: pkg.description, features: [...pkg.features], highlighted: pkg.highlighted, display_order: pkg.display_order })
        setNewFeature('')
        setError('')
        setEditing(pkg)
        setAdding(true)
    }

    function closeForm() { setAdding(false); setEditing(null) }

    function addFeature() {
        if (!newFeature.trim()) return
        setForm(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }))
        setNewFeature('')
    }

    function removeFeature(i: number) {
        setForm(prev => ({ ...prev, features: prev.features.filter((_, idx) => idx !== i) }))
    }

    async function handleSave() {
        if (!form.name) { setError('Name is required.'); return }
        setSaving(true)
        setError('')
        if (editing) {
            const { error: err } = await supabase.from('website_pricing').update(form).eq('id', editing.id)
            if (err) { setError(err.message); setSaving(false); return }
            setPackages(prev => prev.map(p => p.id === editing.id ? { ...p, ...form } : p))
        } else {
            const { data, error: err } = await supabase.from('website_pricing').insert(form).select().single()
            if (err) { setError(err.message); setSaving(false); return }
            if (data) setPackages(prev => [...prev, data])
        }
        setSaving(false)
        closeForm()
    }

    async function deletePackage(id: string) {
        if (!confirm('Delete this package?')) return
        await supabase.from('website_pricing').delete().eq('id', id)
        setPackages(prev => prev.filter(p => p.id !== id))
    }

    if (loading) return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-text-primary mb-2">Pricing</h1>
                    <p className="text-text-secondary font-body text-lg">Manage service packages shown on the website</p>
                </div>
                {!adding && (
                    <button onClick={openAdd} className="btn-primary w-full sm:w-auto">
                        <Plus className="w-4 h-4" /> Add Package
                    </button>
                )}
            </motion.div>

            {/* Form */}
            {adding && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="card-flat mb-8 space-y-5 max-w-lg">
                    <h2 className="font-heading font-semibold text-text-primary">{editing ? 'Edit Package' : 'New Package'}</h2>
                    {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Package Name *</label>
                        <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="e.g. Full Home Design" />
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-text-primary mb-1.5">Price</label>
                            <input type="number" value={form.price ?? ''} onChange={e => setForm(p => ({ ...p, price: e.target.value ? Number(e.target.value) : null }))} className="input-field" placeholder="Leave blank for 'Contact us'" min={0} />
                        </div>
                        <div className="w-28">
                            <label className="block text-sm font-medium text-text-primary mb-1.5">Currency</label>
                            <input type="text" value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))} className="input-field" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Description</label>
                        <textarea value={form.description ?? ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="input-field resize-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Features</label>
                        <div className="flex gap-2 mb-2">
                            <input type="text" value={newFeature} onChange={e => setNewFeature(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature() } }} className="input-field flex-1" placeholder="Add a feature..." />
                            <button type="button" onClick={addFeature} className="btn-secondary flex-shrink-0"><Plus className="w-4 h-4" /></button>
                        </div>
                        {form.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm py-1">
                                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                <span className="flex-1 text-text-primary">{f}</span>
                                <button type="button" onClick={() => removeFeature(i)} className="text-text-secondary hover:text-red-500"><X className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                            <input type="checkbox" checked={form.highlighted} onChange={e => setForm(p => ({ ...p, highlighted: e.target.checked }))} className="w-4 h-4 rounded accent-primary" />
                            <span className="font-medium text-text-primary">Highlighted</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-text-primary">Order</label>
                            <input type="number" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: Number(e.target.value) }))} className="input-field w-20 text-sm" min={0} />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleSave} disabled={saving} className="btn-primary">
                            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : editing ? 'Save Changes' : 'Add Package'}
                        </button>
                        <button onClick={closeForm} className="btn-secondary">Cancel</button>
                    </div>
                </motion.div>
            )}

            {packages.length === 0 ? (
                <motion.div variants={item} className="card-flat flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-accent/15 rounded-2xl flex items-center justify-center mb-4">
                        <Tag className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">No pricing packages yet</h3>
                    <p className="text-sm text-text-secondary">Add your first package to show pricing on the website.</p>
                </motion.div>
            ) : (
                <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {packages.map(pkg => (
                        <motion.div key={pkg.id} variants={item}>
                            <div className={`card-flat h-full flex flex-col ${pkg.highlighted ? 'ring-2 ring-primary' : ''}`}>
                                {pkg.highlighted && (
                                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full px-3 py-1 mb-3 self-start">
                                        Popular
                                    </span>
                                )}
                                <h3 className="font-heading font-semibold text-text-primary text-lg mb-1">{pkg.name}</h3>
                                <p className="text-2xl font-heading font-bold text-primary mb-1">
                                    {pkg.price != null ? `${pkg.currency} ${pkg.price.toLocaleString()}` : 'Contact us'}
                                </p>
                                {pkg.description && <p className="text-sm text-text-secondary mb-3">{pkg.description}</p>}
                                {pkg.features.length > 0 && (
                                    <ul className="space-y-1.5 mb-4 flex-1">
                                        {pkg.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                                                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> {f}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <div className="flex gap-2 mt-auto pt-4 border-t border-border">
                                    <button onClick={() => openEdit(pkg)} className="btn-ghost flex-1 text-sm"><Pencil className="w-4 h-4" /> Edit</button>
                                    <button onClick={() => deletePackage(pkg.id)} className="btn-ghost text-red-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    )
}
