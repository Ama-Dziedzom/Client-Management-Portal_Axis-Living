'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { studioSupabase as supabase } from '@/lib/supabase'
import { WebsiteProject } from '@/types/database'
import Link from 'next/link'
import { ArrowLeft, Plus, X, Loader2 } from '@/lib/icons'
import toast from 'react-hot-toast'

function slugify(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function EditPortfolioProjectPage() {
    const router = useRouter()
    const { id } = useParams<{ id: string }>()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [newImage, setNewImage] = useState('')
    const [form, setForm] = useState<Omit<WebsiteProject, 'id' | 'created_at' | 'updated_at'>>({
        title: '', slug: '', description: null, category: null,
        images: [], featured: false, published: false, display_order: 0,
    })

    useEffect(() => {
        supabase.from('website_projects').select('*').eq('id', id).single().then(({ data }) => {
            if (data) {
                setForm({
                    title: data.title, slug: data.slug, description: data.description,
                    category: data.category, images: data.images, featured: data.featured,
                    published: data.published, display_order: data.display_order,
                })
            }
            setLoading(false)
        })
    }, [id])

    function set(field: string, value: unknown) {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    function handleTitleChange(value: string) {
        setForm(prev => ({ ...prev, title: value, slug: slugify(value) }))
    }

    function addImage() {
        if (!newImage.trim()) return
        set('images', [...form.images, newImage.trim()])
        setNewImage('')
    }

    function removeImage(index: number) {
        set('images', form.images.filter((_, i) => i !== index))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.title || !form.slug) { setError('Title and slug are required.'); return }
        setSaving(true)
        setError('')
        const { error: err } = await supabase.from('website_projects').update({
            title: form.title, slug: form.slug,
            description: form.description || null, category: form.category || null,
            images: form.images, featured: form.featured,
            published: form.published, display_order: form.display_order,
        }).eq('id', id)
        if (err) { setError(err.message); setSaving(false); toast.error(err.message); return }
        toast.success('Project updated')
        router.push('/studio/website/portfolio')
    }

    if (loading) return (
        <div className="space-y-6 max-w-2xl">
            <div className="skeleton h-10 w-48" />
            <div className="skeleton h-64 rounded-2xl" />
        </div>
    )

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-4 mb-10">
                <Link href="/studio/website/portfolio" className="btn-ghost p-2">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-heading font-semibold text-text-primary">Edit Project</h1>
                    <p className="text-text-secondary font-body">{form.title}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

                <div className="card-flat space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Title *</label>
                        <input type="text" value={form.title} onChange={e => handleTitleChange(e.target.value)} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Slug *</label>
                        <input type="text" value={form.slug} onChange={e => set('slug', e.target.value)} className="input-field font-mono text-sm" />
                        <p className="text-xs text-text-secondary mt-1">URL: /portfolio/{form.slug}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Category</label>
                        <input type="text" value={form.category ?? ''} onChange={e => set('category', e.target.value)} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Description</label>
                        <textarea value={form.description ?? ''} onChange={e => set('description', e.target.value)} rows={4} className="input-field resize-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Display Order</label>
                        <input type="number" value={form.display_order} onChange={e => set('display_order', Number(e.target.value))} className="input-field w-32" min={0} />
                    </div>
                </div>

                <div className="card-flat space-y-4">
                    <h2 className="font-heading font-semibold text-text-primary">Images</h2>
                    <div className="flex gap-2">
                        <input type="text" value={newImage} onChange={e => setNewImage(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImage() } }} className="input-field flex-1" placeholder="https://..." />
                        <button type="button" onClick={addImage} className="btn-secondary flex-shrink-0"><Plus className="w-4 h-4" /> Add</button>
                    </div>
                    {form.images.length > 0 && (
                        <div className="space-y-2">
                            {form.images.map((url, i) => (
                                <div key={i} className="flex items-center gap-3 bg-background rounded-xl px-4 py-2.5">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-accent/20 flex-shrink-0">
                                        <img src={url} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                    </div>
                                    <p className="text-sm text-text-secondary truncate flex-1">{url}</p>
                                    <button type="button" onClick={() => removeImage(i)} className="text-text-secondary hover:text-red-500 transition-colors flex-shrink-0">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="card-flat space-y-4">
                    <h2 className="font-heading font-semibold text-text-primary">Options</h2>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 rounded accent-primary" />
                        <span className="text-sm font-medium text-text-primary">Featured</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} className="w-4 h-4 rounded accent-primary" />
                        <span className="text-sm font-medium text-text-primary">Published</span>
                    </label>
                </div>

                <div className="flex gap-3">
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Changes'}
                    </button>
                    <Link href="/studio/website/portfolio" className="btn-secondary">Cancel</Link>
                </div>
            </form>
        </motion.div>
    )
}
