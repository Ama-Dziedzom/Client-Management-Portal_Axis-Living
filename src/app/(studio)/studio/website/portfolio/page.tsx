'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { studioSupabase as supabase } from '@/lib/supabase'
import { WebsiteProject } from '@/types/database'
import Link from 'next/link'
import { ImageIcon, Plus, Search, Pencil, Trash2, Eye, EyeOff, Star, ArrowLeft } from '@/lib/icons'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function PortfolioPage() {
    const [projects, setProjects] = useState<WebsiteProject[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => { fetchProjects() }, [])

    async function fetchProjects() {
        const { data } = await supabase
            .from('website_projects')
            .select('*')
            .order('display_order', { ascending: true })
        setProjects(data ?? [])
        setLoading(false)
    }

    async function togglePublished(project: WebsiteProject) {
        await supabase
            .from('website_projects')
            .update({ published: !project.published })
            .eq('id', project.id)
        setProjects(prev => prev.map(p => p.id === project.id ? { ...p, published: !p.published } : p))
    }

    async function deleteProject(id: string) {
        if (!confirm('Delete this project? This cannot be undone.')) return
        setDeleting(id)
        await supabase.from('website_projects').delete().eq('id', id)
        setProjects(prev => prev.filter(p => p.id !== id))
        setDeleting(null)
    }

    const filtered = projects.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.category ?? '').toLowerCase().includes(search.toLowerCase())
    )

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
                        <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-text-primary mb-2">Portfolio</h1>
                        <p className="text-text-secondary font-body text-lg">Manage projects shown on the website</p>
                    </div>
                    <Link href="/studio/website/portfolio/new" className="btn-primary w-full sm:w-auto">
                        <Plus className="w-4 h-4" /> New Project
                    </Link>
                </div>
            </motion.div>

            {projects.length > 0 && (
                <motion.div variants={item} className="mb-8 max-w-md relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input-field pl-11"
                    />
                </motion.div>
            )}

            {filtered.length === 0 ? (
                <motion.div variants={item} className="card-flat flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-accent/15 rounded-2xl flex items-center justify-center mb-4">
                        <ImageIcon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                        {search ? 'No matching projects' : 'No portfolio projects yet'}
                    </h3>
                    <p className="text-sm text-text-secondary mb-6">
                        {search ? 'Try a different search.' : 'Add your first project to showcase your work.'}
                    </p>
                    {!search && (
                        <Link href="/studio/website/portfolio/new" className="btn-primary">
                            <Plus className="w-4 h-4" /> Add Project
                        </Link>
                    )}
                </motion.div>
            ) : (
                <motion.div variants={container} className="space-y-3">
                    {filtered.map(project => (
                        <motion.div key={project.id} variants={item}>
                            <div className="card-flat flex flex-col sm:flex-row sm:items-center gap-4">
                                {/* Thumbnail */}
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-accent/15 flex-shrink-0">
                                    {project.images[0] ? (
                                        <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="w-6 h-6 text-accent" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-text-primary truncate">{project.title}</h3>
                                        {project.featured && (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                                <Star className="w-3 h-3" /> Featured
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-text-secondary mt-0.5">
                                        {project.category ?? 'No category'} · {project.images.length} image{project.images.length !== 1 ? 's' : ''}
                                    </p>
                                </div>

                                {/* Status + Actions */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className={`badge ${project.published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                        {project.published ? 'Published' : 'Draft'}
                                    </span>
                                    <button
                                        onClick={() => togglePublished(project)}
                                        className="btn-ghost p-2 text-text-secondary"
                                        title={project.published ? 'Unpublish' : 'Publish'}
                                    >
                                        {project.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <Link href={`/studio/website/portfolio/${project.id}`} className="btn-ghost p-2 text-text-secondary">
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => deleteProject(project.id)}
                                        disabled={deleting === project.id}
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
