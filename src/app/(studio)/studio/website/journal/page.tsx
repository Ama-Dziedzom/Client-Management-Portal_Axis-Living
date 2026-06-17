'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { studioSupabase as supabase } from '@/lib/supabase'
import { WebsitePost } from '@/types/database'
import Link from 'next/link'
import { BookOpen, Plus, Search, Pencil, Trash2, Eye, EyeOff, ArrowLeft } from '@/lib/icons'
import toast from 'react-hot-toast'
import { formatDate } from '@/lib/utils'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function JournalPage() {
    const [posts, setPosts] = useState<WebsitePost[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => { fetchPosts() }, [])

    async function fetchPosts() {
        const { data } = await supabase
            .from('website_posts')
            .select('*')
            .order('created_at', { ascending: false })
        setPosts(data ?? [])
        setLoading(false)
    }

    async function togglePublished(post: WebsitePost) {
        const updates: Partial<WebsitePost> = { published: !post.published }
        if (!post.published && !post.published_at) {
            updates.published_at = new Date().toISOString()
        }
        const { error } = await supabase.from('website_posts').update(updates).eq('id', post.id)
        if (error) { toast.error('Failed to update post'); return }
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, ...updates } : p))
        toast.success(post.published ? 'Post unpublished' : 'Post published')
    }

    async function deletePost(id: string) {
        if (!confirm('Delete this post? This cannot be undone.')) return
        setDeleting(id)
        const { error } = await supabase.from('website_posts').delete().eq('id', id)
        if (error) { toast.error('Failed to delete post'); setDeleting(null); return }
        setPosts(prev => prev.filter(p => p.id !== id))
        setDeleting(null)
        toast.success('Post deleted')
    }

    const filtered = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

    if (loading) return (
        <div className="space-y-6">
            <div className="skeleton h-10 w-48" />
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
        </div>
    )

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
                        <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-text-primary mb-2">Journal</h1>
                        <p className="text-text-secondary font-body text-lg">Write and manage blog posts</p>
                    </div>
                    <Link href="/studio/website/journal/new" className="btn-primary w-full sm:w-auto">
                        <Plus className="w-4 h-4" /> New Post
                    </Link>
                </div>
            </motion.div>

            {posts.length > 0 && (
                <motion.div variants={item} className="mb-8 max-w-md relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input type="text" placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-11" />
                </motion.div>
            )}

            {filtered.length === 0 ? (
                <motion.div variants={item} className="card-flat flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-accent/15 rounded-2xl flex items-center justify-center mb-4">
                        <BookOpen className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                        {search ? 'No matching posts' : 'No journal posts yet'}
                    </h3>
                    {!search && (
                        <Link href="/studio/website/journal/new" className="btn-primary mt-4">
                            <Plus className="w-4 h-4" /> Write a Post
                        </Link>
                    )}
                </motion.div>
            ) : (
                <motion.div variants={container} className="space-y-3">
                    {filtered.map(post => (
                        <motion.div key={post.id} variants={item}>
                            <div className="card-flat flex flex-col sm:flex-row sm:items-center gap-4">
                                {post.cover_image && (
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-accent/15 flex-shrink-0">
                                        <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-text-primary truncate">{post.title}</h3>
                                    <p className="text-sm text-text-secondary mt-0.5">
                                        {post.published_at
                                            ? `Published ${formatDate(post.published_at, { month: 'short', day: 'numeric', year: 'numeric' })}`
                                            : `Created ${formatDate(post.created_at, { month: 'short', day: 'numeric', year: 'numeric' })}`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className={`badge ${post.published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                        {post.published ? 'Published' : 'Draft'}
                                    </span>
                                    <button onClick={() => togglePublished(post)} className="btn-ghost p-2 text-text-secondary" title={post.published ? 'Unpublish' : 'Publish'}>
                                        {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <Link href={`/studio/website/journal/${post.id}`} className="btn-ghost p-2 text-text-secondary">
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                    <button onClick={() => deletePost(post.id)} disabled={deleting === post.id} className="btn-ghost p-2 text-red-400 hover:text-red-600">
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
