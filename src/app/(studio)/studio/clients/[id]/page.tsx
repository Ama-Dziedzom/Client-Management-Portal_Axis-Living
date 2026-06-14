'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { studioSupabase as supabase } from '@/lib/supabase'
import { Client, Project, Invoice } from '@/types/database'
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    FolderKanban,
    Receipt,
    Loader2,
    Plus,
    ExternalLink,
    CreditCard,
    X,
    Save,
} from '@/lib/icons'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { formatCurrency, formatDate, getInitials, getStatusBadgeClass, formatStatus } from '@/lib/utils'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }

export default function StudioClientDetailPage() {
    const { id } = useParams()
    const [client, setClient] = useState<Client | null>(null)
    const [projects, setProjects] = useState<Project[]>([])
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [loading, setLoading] = useState(true)
    const [editOpen, setEditOpen] = useState(false)
    const [editForm, setEditForm] = useState({ name: '', phone: '', address: '' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (id) fetchClientData()
    }, [id])

    const fetchClientData = async () => {
        try {
            const [clientRes, projectsRes, invoicesRes] = await Promise.all([
                supabase.from('clients').select('*').eq('id', id as string).single(),
                supabase.from('projects').select('*').eq('client_id', id as string).order('created_at', { ascending: false }),
                supabase.from('invoices').select('*').eq('client_id', id as string).order('created_at', { ascending: false }),
            ])
            if (clientRes.error) throw clientRes.error
            setClient(clientRes.data)
            setProjects(projectsRes.data || [])
            setInvoices(invoicesRes.data || [])
        } catch {
            toast.error('Failed to load client profile')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin opacity-40" />
        </div>
    )

    if (!client) return (
        <div className="text-center py-20">
            <p className="text-text-secondary">Client not found</p>
            <Link href="/studio/clients" className="btn-ghost mt-4">Back to Clients</Link>
        </div>
    )

    const openEdit = () => {
        if (!client) return
        setEditForm({ name: client.name, phone: client.phone ?? '', address: client.address ?? '' })
        setEditOpen(true)
    }

    const saveEdit = async () => {
        if (!client) return
        setSaving(true)
        const { data, error } = await supabase
            .from('clients')
            .update({ name: editForm.name, phone: editForm.phone || null, address: editForm.address || null })
            .eq('id', client.id)
            .select()
            .single()
        setSaving(false)
        if (error) { toast.error('Failed to save changes'); return }
        setClient(data)
        setEditOpen(false)
        toast.success('Profile updated')
    }

    const totalSpent = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.total), 0)
    const paidCount = invoices.filter(i => i.status === 'paid').length

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="pb-20">

            {/* Back */}
            <motion.div variants={item} className="mb-8">
                <Link href="/studio/clients"
                    className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Clients
                </Link>
            </motion.div>

            {/* Profile header */}
            <motion.div variants={item} className="card-flat mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                            {getInitials(client.name)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-heading font-semibold text-text-primary">{client.name}</h1>
                            <div className="flex flex-wrap items-center gap-3 mt-1">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${client.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {client.active ? 'Active Portal Access' : 'Access Restricted'}
                                </span>
                                <span className="text-xs text-text-secondary flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Joined {formatDate(client.created_at, { month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={openEdit} className="px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded-xl hover:text-text-primary hover:border-primary/30 transition-colors">
                            Edit Profile
                        </button>
                        <Link href={`/studio/projects/new?client=${id}`}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
                            <Plus className="w-4 h-4" /> New Project
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={item} className="grid grid-cols-3 gap-4 mb-6">
                <div className="card-flat text-center">
                    <p className="text-2xl font-bold text-text-primary">{projects.length}</p>
                    <p className="text-[10px] uppercase tracking-widest text-text-secondary mt-0.5">Projects</p>
                </div>
                <div className="card-flat text-center">
                    <p className="text-2xl font-bold text-text-primary">{paidCount}</p>
                    <p className="text-[10px] uppercase tracking-widest text-text-secondary mt-0.5">Invoices Paid</p>
                </div>
                <div className="card-flat text-center">
                    <p className="text-2xl font-bold text-primary">{formatCurrency(totalSpent)}</p>
                    <p className="text-[10px] uppercase tracking-widest text-text-secondary mt-0.5">Lifetime Billing</p>
                </div>
            </motion.div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left — contact */}
                <motion.div variants={item} className="card-flat h-fit lg:sticky lg:top-6 self-start">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-5">Contact Details</p>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Mail className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-tight mb-0.5">Email</p>
                                <p className="text-sm text-text-primary truncate">{client.email}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-tight mb-0.5">Phone</p>
                                <p className="text-sm text-text-primary">{client.phone || '—'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-tight mb-0.5">Location</p>
                                <p className="text-sm text-text-primary">{client.address || '—'}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right — projects + invoices */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Projects */}
                    <motion.div variants={item}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-heading font-semibold text-text-primary flex items-center gap-2">
                                <FolderKanban className="w-4 h-4 text-text-secondary" />
                                Projects
                                <span className="text-[10px] font-bold bg-surface border border-border px-2 py-0.5 rounded-full text-text-secondary">{projects.length}</span>
                            </h2>
                            <Link href="/studio/projects" className="text-xs font-semibold text-primary hover:underline">View all</Link>
                        </div>

                        {projects.length === 0 ? (
                            <div className="card-flat flex items-center gap-3 py-5 border-dashed border-2">
                                <FolderKanban className="w-5 h-5 text-text-secondary/30 flex-shrink-0" />
                                <p className="text-sm text-text-secondary">No projects started yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {projects.map(project => (
                                    <Link key={project.id} href={`/studio/projects/${project.id}`}
                                        className="card-flat group hover:border-primary/30 hover:shadow-elevated transition-all">
                                        <div className="flex items-start justify-between mb-3">
                                            <span className={getStatusBadgeClass(project.status)}>{formatStatus(project.status)}</span>
                                            <ExternalLink className="w-3.5 h-3.5 text-text-secondary/40 group-hover:text-primary transition-colors" />
                                        </div>
                                        <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-1 mb-0.5">
                                            {project.title}
                                        </p>
                                        <p className="text-xs text-text-secondary">{project.location || 'No location'}</p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Invoices */}
                    <motion.div variants={item}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-heading font-semibold text-text-primary flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-text-secondary" />
                                Invoices
                                <span className="text-[10px] font-bold bg-surface border border-border px-2 py-0.5 rounded-full text-text-secondary">{invoices.length}</span>
                            </h2>
                            <Link href="/studio/invoices" className="text-xs font-semibold text-primary hover:underline">Billing Hub</Link>
                        </div>

                        {invoices.length === 0 ? (
                            <div className="card-flat flex items-center gap-3 py-5 border-dashed border-2">
                                <Receipt className="w-5 h-5 text-text-secondary/30 flex-shrink-0" />
                                <p className="text-sm text-text-secondary">No billing records for this client.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {invoices.slice(0, 5).map(invoice => (
                                    <Link key={invoice.id} href={`/studio/invoices/${invoice.id}`}
                                        className="card-flat flex items-center justify-between gap-4 hover:border-primary/30 transition-all group">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="text-xs font-mono font-bold text-text-primary group-hover:text-primary transition-colors flex-shrink-0">
                                                {invoice.invoice_number}
                                            </span>
                                            <span className="text-xs text-text-secondary truncate">{formatDate(invoice.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <span className="text-sm font-bold text-text-primary">{formatCurrency(invoice.total)}</span>
                                            <span className={getStatusBadgeClass(invoice.status)}>{formatStatus(invoice.status)}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </motion.div>

                </div>
            </div>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {editOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
                        onClick={e => { if (e.target === e.currentTarget) setEditOpen(false) }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 8 }}
                            transition={{ duration: 0.2 }}
                            className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-heading font-semibold text-text-primary">Edit Profile</h2>
                                <button onClick={() => setEditOpen(false)} className="p-1.5 rounded-lg hover:bg-surface text-text-secondary hover:text-text-primary transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block mb-1.5">Full Name</label>
                                    <input
                                        value={editForm.name}
                                        onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                        className="input-field w-full"
                                        placeholder="Client name"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block mb-1.5">Phone</label>
                                    <input
                                        value={editForm.phone}
                                        onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                                        className="input-field w-full"
                                        placeholder="+260 97 000 0000"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block mb-1.5">Location</label>
                                    <input
                                        value={editForm.address}
                                        onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))}
                                        className="input-field w-full"
                                        placeholder="e.g. Lusaka, Zambia"
                                    />
                                </div>
                                <div className="pt-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block mb-1.5">Email</label>
                                    <p className="text-sm text-text-secondary bg-surface border border-border rounded-xl px-4 py-2.5">{client.email}</p>
                                    <p className="text-[10px] text-text-secondary/60 mt-1 ml-1">Email is linked to the portal login and cannot be changed here.</p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button onClick={saveEdit} disabled={saving || !editForm.name.trim()}
                                    className="flex items-center gap-2 flex-1 justify-center bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-opacity">
                                    <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Changes'}
                                </button>
                                <button onClick={() => setEditOpen(false)}
                                    className="px-4 py-2.5 rounded-xl text-sm font-medium border border-border text-text-secondary hover:text-text-primary transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
