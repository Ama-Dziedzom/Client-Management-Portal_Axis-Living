'use client'

import { useEffect, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { useStudio } from '@/contexts/StudioContext'
import { studioSupabase as supabase } from '@/lib/supabase'
import { Client, Project, Invoice, Message } from '@/types/database'
import { formatCurrency, formatDate, formatStatus, getStatusBadgeClass } from '@/lib/utils'
import Link from 'next/link'
import {
    Users,
    FolderKanban,
    Receipt,
    MessageCircle,
    ArrowRight,
    TrendingUp,
    Plus,
    AlertTriangle,
    FileText,
    UserPlus,
    Bell,
} from '@/lib/icons'

const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const item: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

export default function StudioDashboardPage() {
    const { studioUser } = useStudio()
    const [clients, setClients] = useState<Client[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [recentMessages, setRecentMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => { fetchData() }, [])

    const fetchData = async () => {
        try {
            const [clientsRes, projectsRes, invoicesRes, messagesRes] = await Promise.all([
                supabase.from('clients').select('*').order('created_at', { ascending: false }),
                supabase.from('projects').select('*').order('updated_at', { ascending: false }),
                supabase.from('invoices').select('*').order('created_at', { ascending: false }).limit(20),
                supabase.from('messages').select('*').eq('sender_type', 'client').order('created_at', { ascending: false }).limit(10),
            ])
            setClients(clientsRes.data || [])
            setProjects(projectsRes.data || [])
            setInvoices(invoicesRes.data || [])
            setRecentMessages(messagesRes.data || [])
        } catch (error) {
            console.error('Studio dashboard fetch error:', error)
        } finally {
            setLoading(false)
        }
    }

    const getGreeting = () => {
        const h = new Date().getHours()
        if (h < 12) return 'Good morning'
        if (h < 17) return 'Good afternoon'
        return 'Good evening'
    }

    const activeProjects   = projects.filter(p => p.status === 'in_progress')
    const pendingInvoices  = invoices.filter(i => i.status === 'sent' || i.status === 'overdue')
    const overdueInvoices  = invoices.filter(i => i.status === 'overdue')
    const totalRevenue     = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.total), 0)
    const unreadMessages   = recentMessages.filter(m => !m.read)
    const hasAttentionItems = overdueInvoices.length > 0 || unreadMessages.length > 0

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-10 w-64" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => <div key={i} className="skeleton h-28 rounded-2xl" />)}
                </div>
                <div className="skeleton h-48 rounded-2xl" />
                <div className="skeleton h-64 rounded-2xl" />
            </div>
        )
    }

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

            {/* Greeting */}
            <motion.div variants={item}>
                <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-text-primary">
                    {getGreeting()}, {studioUser?.name?.split(' ')[0]}
                </h1>
                <p className="text-text-secondary mt-1">Here&apos;s your studio overview for today.</p>
            </motion.div>

            {/* ── Needs Attention ── */}
            {hasAttentionItems && (
                <motion.div variants={item}>
                    <div className="flex items-center gap-2 mb-3">
                        <Bell className="w-4 h-4 text-amber-600" />
                        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                            Needs your attention
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {overdueInvoices.length > 0 && (
                            <Link
                                href="/studio/invoices"
                                className="group flex items-start gap-4 bg-red-50 border border-red-200 rounded-2xl p-5 hover:bg-red-100 transition-colors"
                            >
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-colors">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-red-800">
                                        {overdueInvoices.length} overdue invoice{overdueInvoices.length > 1 ? 's' : ''}
                                    </p>
                                    <p className="text-sm text-red-600 mt-0.5">
                                        Follow up with clients — click to view
                                    </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-red-400 ml-auto self-center group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        )}
                        {unreadMessages.length > 0 && (
                            <Link
                                href="/studio/messages"
                                className="group flex items-start gap-4 bg-blue-50 border border-blue-200 rounded-2xl p-5 hover:bg-blue-100 transition-colors"
                            >
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                                    <MessageCircle className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-blue-800">
                                        {unreadMessages.length} unread message{unreadMessages.length > 1 ? 's' : ''}
                                    </p>
                                    <p className="text-sm text-blue-600 mt-0.5">
                                        Clients are waiting for a reply
                                    </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-blue-400 ml-auto self-center group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        )}
                    </div>
                </motion.div>
            )}

            {/* ── Stats ── */}
            <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/studio/clients" className="group card-flat flex flex-col gap-3 hover:shadow-elevated transition-all duration-300">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                        <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-2xl font-heading font-semibold text-text-primary">{clients.length}</p>
                        <p className="text-xs text-text-secondary mt-0.5 font-medium uppercase tracking-wide">Clients</p>
                    </div>
                </Link>

                <Link href="/studio/projects" className="group card-flat flex flex-col gap-3 hover:shadow-elevated transition-all duration-300">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                        <FolderKanban className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                        <p className="text-2xl font-heading font-semibold text-text-primary">{activeProjects.length}</p>
                        <p className="text-xs text-text-secondary mt-0.5 font-medium uppercase tracking-wide">Active Projects</p>
                    </div>
                </Link>

                <Link
                    href="/studio/invoices"
                    className={`group card-flat flex flex-col gap-3 hover:shadow-elevated transition-all duration-300 ${overdueInvoices.length > 0 ? 'ring-1 ring-red-200' : ''}`}
                >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${overdueInvoices.length > 0 ? 'bg-red-50 group-hover:bg-red-100' : 'bg-amber-50 group-hover:bg-amber-100'}`}>
                        <Receipt className={`w-5 h-5 ${overdueInvoices.length > 0 ? 'text-red-600' : 'text-amber-700'}`} />
                    </div>
                    <div>
                        <p className="text-2xl font-heading font-semibold text-text-primary">{pendingInvoices.length}</p>
                        <p className="text-xs text-text-secondary mt-0.5 font-medium uppercase tracking-wide">Pending Invoices</p>
                    </div>
                </Link>

                <div className="card-flat flex flex-col gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-2xl font-heading font-semibold text-text-primary">{formatCurrency(totalRevenue)}</p>
                        <p className="text-xs text-text-secondary mt-0.5 font-medium uppercase tracking-wide">Total Revenue</p>
                    </div>
                </div>
            </motion.div>

            {/* ── Quick Actions ── */}
            <motion.div variants={item}>
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        {
                            href: '/studio/projects/new',
                            icon: FolderKanban,
                            label: 'New Project',
                            desc: 'Start a client project',
                            color: 'bg-primary text-white hover:bg-primary-light',
                            iconColor: 'text-[#C6B9AA]',
                        },
                        {
                            href: '/studio/invoices/new',
                            icon: FileText,
                            label: 'Create Invoice',
                            desc: 'Bill a client',
                            color: 'bg-surface border border-border hover:shadow-elevated',
                            iconColor: 'text-primary',
                        },
                        {
                            href: '/studio/clients/new',
                            icon: UserPlus,
                            label: 'Add Client',
                            desc: 'Register a new client',
                            color: 'bg-surface border border-border hover:shadow-elevated',
                            iconColor: 'text-primary',
                        },
                        {
                            href: '/studio/messages',
                            icon: MessageCircle,
                            label: 'Messages',
                            desc: `${unreadMessages.length || 'No'} unread`,
                            color: 'bg-surface border border-border hover:shadow-elevated',
                            iconColor: 'text-primary',
                        },
                    ].map(action => {
                        const Icon = action.icon
                        return (
                            <Link
                                key={action.href}
                                href={action.href}
                                className={`group flex flex-col gap-3 p-5 rounded-2xl transition-all duration-200 ${action.color}`}
                            >
                                <Icon className={`w-6 h-6 ${action.iconColor}`} />
                                <div>
                                    <p className={`text-sm font-semibold ${action.color.includes('bg-primary') ? 'text-white' : 'text-text-primary'}`}>
                                        {action.label}
                                    </p>
                                    <p className={`text-xs mt-0.5 ${action.color.includes('bg-primary') ? 'text-white/70' : 'text-text-secondary'}`}>
                                        {action.desc}
                                    </p>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </motion.div>

            {/* ── Recent Projects + Messages ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div variants={item} className="lg:col-span-2">
                    <div className="section-header">
                        <h2 className="text-base font-heading font-semibold text-text-primary">Recent Projects</h2>
                        <Link href="/studio/projects" className="btn-ghost text-xs">
                            View all <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="space-y-2.5">
                        {projects.length === 0 ? (
                            <div className="card-flat text-center py-12">
                                <FolderKanban className="w-8 h-8 text-accent mx-auto mb-3" />
                                <p className="text-text-secondary text-sm">No projects yet.</p>
                                <Link href="/studio/projects/new" className="btn-primary mt-4 inline-flex">
                                    <Plus className="w-4 h-4" /> New Project
                                </Link>
                            </div>
                        ) : (
                            projects.slice(0, 6).map(project => (
                                <Link
                                    key={project.id}
                                    href={`/studio/projects/${project.id}`}
                                    className="group card-flat !p-4 flex items-center gap-4 hover:shadow-elevated transition-all duration-200"
                                >
                                    {project.cover_image_url ? (
                                        <img
                                            src={project.cover_image_url}
                                            alt={project.title}
                                            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-primary/8 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <FolderKanban className="w-5 h-5 text-primary/60" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors truncate">
                                            {project.title}
                                        </h3>
                                        <p className="text-xs text-text-secondary mt-0.5">
                                            {project.location || 'No location'} · {formatDate(project.updated_at, { month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <span className={getStatusBadgeClass(project.status)}>
                                        {formatStatus(project.status)}
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-border group-hover:text-primary transition-colors flex-shrink-0 hidden sm:block" />
                                </Link>
                            ))
                        )}
                    </div>
                </motion.div>

                <motion.div variants={item}>
                    <div className="section-header">
                        <h2 className="text-base font-heading font-semibold text-text-primary">Client Messages</h2>
                        <Link href="/studio/messages" className="btn-ghost text-xs">
                            View all <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="card-flat !p-0 overflow-hidden">
                        {recentMessages.length === 0 ? (
                            <div className="p-8 text-center">
                                <MessageCircle className="w-8 h-8 text-accent mx-auto mb-3" />
                                <p className="text-text-secondary text-sm">No client messages yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {recentMessages.slice(0, 6).map(msg => (
                                    <Link
                                        key={msg.id}
                                        href="/studio/messages"
                                        className="flex items-start gap-3 px-4 py-3.5 hover:bg-accent/5 transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary text-xs font-bold">
                                            {msg.sender_name?.charAt(0) || 'C'}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-sm font-medium text-text-primary truncate">{msg.sender_name}</p>
                                                <span className="text-[10px] text-text-secondary flex-shrink-0">
                                                    {formatDate(msg.created_at, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-text-secondary mt-0.5 truncate">{msg.body}</p>
                                        </div>
                                        {!msg.read && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
