'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { 
    Project, 
    TimelineStage, 
    DocType, 
    GalleryImage, 
    ProjectStatus,
    ProjectWithDetails 
} from '@/types/database'
import { 
    ArrowLeft, 
    Plus, 
    Trash2, 
    Edit2, 
    Save, 
    X, 
    Upload, 
    Loader2, 
    CheckCircle2, 
    Clock, 
    Calendar,
    FileText,
    Image as ImageIcon,
    LayoutDashboard,
    ChevronRight,
    Search,
    AlertCircle,
    Globe,
    MapPin
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { formatStatus, getStatusBadgeClass, formatDate, getFileIcon, formatFileSize } from '@/lib/utils'

const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'timeline', label: 'Timeline', icon: CheckCircle2 },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'documents', label: 'Documents', icon: FileText },
]

export default function StudioProjectDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [project, setProject] = useState<ProjectWithDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')
    const [isEditingInfo, setIsEditingInfo] = useState(false)
    const [isAddingStage, setIsAddingStage] = useState(false)
    const [saving, setSaving] = useState(false)

    // Form states
    const [editForm, setEditForm] = useState({
        title: '',
        location: '',
        status: 'planning' as ProjectStatus,
        description: ''
    })

    useEffect(() => {
        if (id) fetchProject()
    }, [id])

    const fetchProject = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*, timeline_stages(*), documents(*), gallery(*)')
                .eq('id', id as string)
                .single()

            if (error) throw error
            const p = data as any
            setProject(p)
            setEditForm({
                title: p.title,
                location: p.location || '',
                status: p.status,
                description: p.description || ''
            })
        } catch (error) {
            console.error('Error fetching project:', error)
            toast.error('Failed to load project details')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateInfo = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const { error } = await supabase
                .from('projects')
                .update(editForm)
                .eq('id', id as string)

            if (error) throw error
            
            toast.success('Project updated')
            setProject(prev => prev ? { ...prev, ...editForm } : null)
            setIsEditingInfo(false)
        } catch (error) {
            console.error('Update error:', error)
            toast.error('Failed to update project')
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteProject = async () => {
        if (!window.confirm('Are you sure you want to delete this project? This cannot be undone.')) return
        
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id as string)

            if (error) throw error
            toast.success('Project deleted')
            router.push('/studio/projects')
        } catch (error) {
            console.error('Delete error:', error)
            toast.error('Failed to delete project')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin opacity-40" />
            </div>
        )
    }

    if (!project) return (
            <div className="text-center py-20">
                <p className="text-text-secondary">Project not found</p>
                <Link href="/studio/projects" className="btn-ghost mt-4">Back to Projects</Link>
            </div>
        )

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="mb-10">
                <Link 
                    href="/studio/projects" 
                    className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Projects
                </Link>
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={getStatusBadgeClass(project.status)}>
                                {formatStatus(project.status)}
                            </span>
                            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                                <MapPin className="w-3 h-3" /> {project.location || 'No location'}
                            </span>
                        </div>
                        <h1 className="text-3xl lg:text-5xl font-heading font-semibold text-text-primary tracking-tight">
                            {project.title}
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsEditingInfo(!isEditingInfo)}
                            className="btn-secondary"
                        >
                            <Edit2 className="w-4 h-4" /> Edit Details
                        </button>
                        <button 
                            onClick={handleDeleteProject}
                            className="btn-ghost text-error hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Editing Overlay */}
            <AnimatePresence>
                {isEditingInfo && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-10 overflow-hidden"
                    >
                        <form onSubmit={handleUpdateInfo} className="card-flat bg-accent/5 border-primary/20 p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary">Title</label>
                                    <input 
                                        type="text" 
                                        value={editForm.title} 
                                        onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                        className="input-field bg-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary">Location</label>
                                    <input 
                                        type="text" 
                                        value={editForm.location} 
                                        onChange={e => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                                        className="input-field bg-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary">Status</label>
                                    <select 
                                        value={editForm.status} 
                                        onChange={e => setEditForm(prev => ({ ...prev, status: e.target.value as ProjectStatus }))}
                                        className="input-field bg-white"
                                    >
                                        <option value="planning">Planning</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="on_hold">On Hold</option>
                                        <option value="complete">Complete</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary">Description</label>
                                    <textarea 
                                        value={editForm.description} 
                                        onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                        className="input-field bg-white h-full"
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button type="button" onClick={() => setIsEditingInfo(false)} className="btn-ghost">Cancel</button>
                                <button type="submit" disabled={saving} className="btn-primary">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map(tab => {
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap",
                                activeTab === tab.id
                                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                                    : "bg-white text-text-secondary hover:bg-accent/10 border border-border"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Content Area */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="card-flat">
                                <h3 className="font-heading text-lg font-semibold mb-4">Project Description</h3>
                                <p className="text-text-secondary font-body leading-relaxed whitespace-pre-wrap italic">
                                    {project.description || 'No description provided.'}
                                </p>
                            </div>
                            
                            {/* Short Summary Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="card-flat bg-primary/5 border-primary/10">
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Timeline</p>
                                    <p className="text-xl font-heading font-bold text-text-primary">
                                        {project.timeline_stages?.filter(s => s.status === 'complete').length || 0} / {project.timeline_stages?.length || 0}
                                    </p>
                                    <p className="text-xs text-text-secondary mt-1">Stages complete</p>
                                </div>
                                <div className="card-flat bg-blue-50/50 border-blue-100">
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Documents</p>
                                    <p className="text-xl font-heading font-bold text-text-primary">
                                        {project.documents?.length || 0}
                                    </p>
                                    <p className="text-xs text-text-secondary mt-1">Files shared</p>
                                </div>
                                <div className="card-flat bg-emerald-50/50 border-emerald-100">
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Gallery</p>
                                    <p className="text-xl font-heading font-bold text-text-primary">
                                        {project.gallery?.length || 0}
                                    </p>
                                    <p className="text-xs text-text-secondary mt-1">Images uploaded</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="card-flat">
                                <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-[#8b8fa3] mb-6">Internal Info</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-bold text-text-secondary mb-1 uppercase tracking-tighter">Client ID</p>
                                        <p className="text-sm font-medium font-mono text-text-primary bg-accent/5 p-2 rounded-lg truncate">
                                            {project.client_id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-text-secondary mb-1 uppercase tracking-tighter">Created At</p>
                                        <p className="text-sm font-medium text-text-primary">
                                            {formatDate(project.created_at)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-text-secondary mb-1 uppercase tracking-tighter">Last Update</p>
                                        <p className="text-sm font-medium text-text-primary">
                                            {formatDate(project.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <Link 
                                href="/studio/messages"
                                className="card-flat bg-primary text-white flex items-center justify-between group hover:bg-primary-light transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="w-5 h-5 text-accent" />
                                    <div>
                                        <p className="text-sm font-bold">Client Messages</p>
                                        <p className="text-[10px] text-accent/60 uppercase">Open Hub</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                )}

                {activeTab === 'timeline' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-border">
                            <div>
                                <h3 className="font-heading text-lg font-semibold">Project Roadmap</h3>
                                <p className="text-text-secondary text-sm">Define and track key project milestones</p>
                            </div>
                            <button className="btn-primary" onClick={() => setIsAddingStage(true)}>
                                <Plus className="w-4 h-4" /> Add Stage
                            </button>
                        </div>

                        {/* Timeline list stays here but with Edit/Delete buttons */}
                        <div className="space-y-4 pl-4 border-l-2 border-border ml-1.5">
                            {(!project.timeline_stages || project.timeline_stages.length === 0) ? (
                                <div className="card-flat text-center py-12">
                                    <Clock className="w-8 h-8 text-accent mx-auto mb-3" />
                                    <p className="text-text-secondary">No stages defined yet.</p>
                                </div>
                            ) : (
                                project.timeline_stages
                                    .sort((a, b) => a.display_order - b.display_order)
                                    .map((stage, idx) => (
                                        <div key={stage.id} className="relative group">
                                            <div className={cn(
                                                "absolute -left-[25px] top-4 w-4 h-4 rounded-full border-4 border-white shadow-sm ring-2 ring-transparent",
                                                stage.status === 'complete' ? "bg-emerald-500 ring-emerald-100" :
                                                stage.status === 'active' ? "bg-amber-500 ring-amber-100 animate-pulse" : "bg-gray-300 ring-gray-100"
                                            )} />
                                            
                                            <div className="card-flat py-5 px-6 group flex items-start justify-between hover:border-primary/30 transition-colors">
                                                <div className="flex-1 min-w-0 pr-10">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="font-heading font-semibold text-text-primary truncate">
                                                            {stage.stage_name}
                                                        </h4>
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                                            stage.status === 'complete' ? "bg-emerald-50 text-emerald-700" : 
                                                            stage.status === 'active' ? "bg-amber-50 text-amber-700" : "bg-gray-50 text-gray-500"
                                                        )}>
                                                            {stage.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-text-secondary line-clamp-2 italic leading-relaxed">
                                                        {stage.notes || 'No specific notes for this stage.'}
                                                    </p>
                                                </div>
                                                
                                                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 hover:bg-accent/10 rounded-lg text-text-secondary transition-colors" title="Edit Stage">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 hover:bg-red-50 rounded-lg text-error transition-colors" title="Delete Stage">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'gallery' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-border">
                            <div>
                                <h3 className="font-heading text-lg font-semibold">Visual Gallery</h3>
                                <p className="text-text-secondary text-sm">Upload and showcase project photos</p>
                            </div>
                            <button className="btn-primary">
                                <Upload className="w-4 h-4" /> Upload Photo
                            </button>
                        </div>

                        {(!project.gallery || project.gallery.length === 0) ? (
                            <div className="card-flat flex flex-col items-center justify-center py-20 text-center border-dashed border-2">
                                <ImageIcon className="w-12 h-12 text-accent/40 mb-4" />
                                <p className="text-text-secondary max-w-xs mx-auto">
                                    No photos added to this project's gallery yet.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {project.gallery.map((img) => (
                                    <div key={img.id} className="group relative aspect-square bg-accent/10 rounded-2xl overflow-hidden border border-border">
                                        <img 
                                            src={img.image_url} 
                                            alt={img.caption || ''} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-3 bg-red-500/20 backdrop-blur-md rounded-full text-white hover:bg-red-500/40 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {img.caption && (
                                            <div className="absolute bottom-3 left-3 right-3">
                                                <p className="text-[10px] text-white font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded w-fit truncate">
                                                    {img.caption}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-border">
                            <div>
                                <h3 className="font-heading text-lg font-semibold">Project Shared Files</h3>
                                <p className="text-text-secondary text-sm">Upload drawings, contracts, and proposals</p>
                            </div>
                            <button className="btn-primary">
                                <Plus className="w-4 h-4" /> Add Document
                            </button>
                        </div>

                        {(!project.documents || project.documents.length === 0) ? (
                            <div className="card-flat flex flex-col items-center justify-center py-20 text-center border-dashed border-2">
                                <FileText className="w-12 h-12 text-accent/40 mb-4" />
                                <p className="text-text-secondary max-w-xs mx-auto">
                                    No documents shared with client yet.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {project.documents.map((doc) => (
                                    <div key={doc.id} className="card-flat group flex items-center gap-4 hover:border-primary/30 transition-all">
                                        <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                                            {getFileIcon(doc.file_type || '')}
                                        </div>
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h4 className="text-sm font-semibold text-text-primary truncate">{doc.name}</h4>
                                            <p className="text-xs text-text-secondary mt-1">
                                                {formatFileSize(doc.size || 0)} · Uploaded {formatDate(doc.uploaded_at)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-accent/10 rounded-lg text-text-secondary transition-colors" title="Download">
                                                <Globe className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-red-50 rounded-lg text-error transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
