'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { studioSupabase as supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from '@/lib/icons'

function slugify(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function NewJournalPostPage() {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        title: '',
        slug: '',
        body: '',
        cover_image: '',
        published: false,
    })

    function set(field: string, value: unknown) {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    function handleTitleChange(value: string) {
        setForm(prev => ({ ...prev, title: value, slug: slugify(value) }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.title || !form.slug) { setError('Title and slug are required.'); return }
        setSaving(true)
        setError('')
        const { error: err } = await supabase.from('website_posts').insert({
            title: form.title,
            slug: form.slug,
            body: form.body || null,
            cover_image: form.cover_image || null,
            published: form.published,
            published_at: form.published ? new Date().toISOString() : null,
        })
        if (err) { setError(err.message); setSaving(false); return }
        router.push('/studio/website/journal')
    }

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-4 mb-10">
                <Link href="/studio/website/journal" className="btn-ghost p-2">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-heading font-semibold text-text-primary">New Journal Post</h1>
                    <p className="text-text-secondary font-body">Write a new article for the website</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

                <div className="card-flat space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Title *</label>
                        <input type="text" value={form.title} onChange={e => handleTitleChange(e.target.value)} className="input-field" placeholder="Post title" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Slug *</label>
                        <input type="text" value={form.slug} onChange={e => set('slug', e.target.value)} className="input-field font-mono text-sm" />
                        <p className="text-xs text-text-secondary mt-1">URL: /journal/{form.slug || 'slug'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Cover Image URL</label>
                        <input type="text" value={form.cover_image} onChange={e => set('cover_image', e.target.value)} className="input-field" placeholder="https://..." />
                        {form.cover_image && (
                            <div className="mt-2 w-full h-40 rounded-xl overflow-hidden">
                                <img src={form.cover_image} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="card-flat">
                    <label className="block text-sm font-medium text-text-primary mb-1.5">Body</label>
                    <textarea
                        value={form.body}
                        onChange={e => set('body', e.target.value)}
                        rows={16}
                        className="input-field resize-y font-mono text-sm"
                        placeholder="Write your post content here..."
                    />
                    <p className="text-xs text-text-secondary mt-2">Plain text or Markdown supported</p>
                </div>

                <div className="card-flat">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} className="w-4 h-4 rounded accent-primary" />
                        <div>
                            <span className="text-sm font-medium text-text-primary">Publish immediately</span>
                            <p className="text-xs text-text-secondary">Make this post visible on the website right away</p>
                        </div>
                    </label>
                </div>

                <div className="flex gap-3">
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Post'}
                    </button>
                    <Link href="/studio/website/journal" className="btn-secondary">Cancel</Link>
                </div>
            </form>
        </motion.div>
    )
}
