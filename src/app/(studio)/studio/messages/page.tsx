'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { studioSupabase as supabase } from '@/lib/supabase'
import { Message } from '@/types/database'
import { useStudio } from '@/contexts/StudioContext'
import {
    Send,
    MessageSquare,
    Loader2,
    Plus,
    CheckCheck,
    Search as SearchIcon,
    ChevronUp,
} from '@/lib/icons'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { formatRelativeTime, cn, getInitials } from '@/lib/utils'

interface SidebarProject {
    id: string
    title: string
    client_id: string
    client_name: string
    updated_at: string
    last_message: Message | null
    unread_count: number
}

const PAGE_SIZE = 50

export default function StudioMessagesPage() {
    const { studioUser } = useStudio()

    // Sidebar state
    const [sidebarProjects, setSidebarProjects] = useState<SidebarProject[]>([])
    const [sidebarLoading, setSidebarLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    // Chat state
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
    const [chatMessages, setChatMessages] = useState<Message[]>([])
    const [chatLoading, setChatLoading] = useState(false)
    const [chatOffset, setChatOffset] = useState(0)
    const [hasMore, setHasMore] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)

    // Compose state
    const [newMessage, setNewMessage] = useState('')
    const [sending, setSending] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const selectedProject = sidebarProjects.find(p => p.id === selectedProjectId)

    // ─── Sidebar: fetch projects + preview messages ───────────────────────────
    const fetchSidebar = useCallback(async () => {
        setSidebarLoading(true)
        try {
            const { data: projectsData, error: pErr } = await supabase
                .from('projects')
                .select('id, title, client_id, updated_at')
                .order('updated_at', { ascending: false })

            if (pErr) throw pErr
            if (!projectsData?.length) { setSidebarProjects([]); return }

            const projectIds = projectsData.map(p => p.id)

            const [{ data: previewMsgs }, { data: clientsData }] = await Promise.all([
                supabase
                    .from('messages')
                    .select('*')
                    .in('project_id', projectIds)
                    .order('created_at', { ascending: false })
                    .limit(projectIds.length * 5),
                supabase.from('clients').select('id, name'),
            ])

            const clientMap = Object.fromEntries(clientsData?.map(c => [c.id, c.name]) || [])

            const formatted: SidebarProject[] = projectsData.map(p => {
                const msgs = (previewMsgs || []).filter(m => m.project_id === p.id)
                return {
                    id: p.id,
                    title: p.title,
                    client_id: p.client_id,
                    client_name: clientMap[p.client_id] || 'Unknown Client',
                    updated_at: p.updated_at,
                    last_message: msgs[0] || null,
                    unread_count: msgs.filter(m => !m.read && m.sender_type === 'client').length,
                }
            }).sort((a, b) => {
                const tA = a.last_message?.created_at || a.updated_at
                const tB = b.last_message?.created_at || b.updated_at
                return new Date(tB).getTime() - new Date(tA).getTime()
            })

            setSidebarProjects(formatted)
            if (!selectedProjectId && formatted.length > 0) {
                setSelectedProjectId(formatted[0].id)
            }
        } catch (err) {
            console.error('Sidebar fetch error:', err)
            toast.error('Failed to load conversations')
        } finally {
            setSidebarLoading(false)
        }
    }, [selectedProjectId])

    useEffect(() => { fetchSidebar() }, [])

    // ─── Chat: load messages for selected project ─────────────────────────────
    const loadConversation = useCallback(async (projectId: string, offset: number) => {
        if (offset === 0) setChatLoading(true)
        else setLoadingMore(true)

        try {
            const { data, count, error } = await supabase
                .from('messages')
                .select('*', { count: 'exact' })
                .eq('project_id', projectId)
                .order('created_at', { ascending: false })
                .range(offset, offset + PAGE_SIZE - 1)

            if (error) throw error

            const msgs = (data || []).reverse()
            if (offset === 0) {
                setChatMessages(msgs)
                setChatOffset(PAGE_SIZE)
                setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
            } else {
                setChatMessages(prev => [...msgs, ...prev])
                setChatOffset(offset + PAGE_SIZE)
            }
            setHasMore((count || 0) > offset + PAGE_SIZE)
        } catch (err) {
            console.error('Load conversation error:', err)
        } finally {
            setChatLoading(false)
            setLoadingMore(false)
        }
    }, [])

    useEffect(() => {
        if (!selectedProjectId) return
        loadConversation(selectedProjectId, 0)
        markMessagesAsRead(selectedProjectId)
    }, [selectedProjectId, loadConversation])

    // ─── Mark as read ─────────────────────────────────────────────────────────
    const markMessagesAsRead = async (projectId: string) => {
        const { error } = await supabase
            .from('messages')
            .update({ read: true })
            .eq('project_id', projectId)
            .eq('sender_type', 'client')
            .eq('read', false)

        if (!error) {
            setSidebarProjects(prev =>
                prev.map(p => p.id === projectId ? { ...p, unread_count: 0 } : p)
            )
        }
    }

    // ─── Realtime: new messages ───────────────────────────────────────────────
    useEffect(() => {
        const channel = supabase
            .channel('studio-messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                const msg = payload.new as Message
                if (msg.project_id === selectedProjectId) {
                    setChatMessages(prev => [...prev, msg])
                    if (msg.sender_type === 'client') markMessagesAsRead(msg.project_id)
                    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
                }
                // Refresh sidebar preview
                fetchSidebar()
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [selectedProjectId, fetchSidebar])

    // ─── Send message ─────────────────────────────────────────────────────────
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !selectedProjectId || !studioUser) return

        setSending(true)
        try {
            const { data, error } = await supabase
                .from('messages')
                .insert({
                    project_id: selectedProjectId,
                    sender_id: studioUser.id,
                    sender_name: studioUser.name,
                    sender_type: 'studio',
                    body: newMessage.trim(),
                    read: false,
                })
                .select()
                .single()

            if (error) throw error

            setChatMessages(prev => [...prev, data])
            setNewMessage('')
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)

            // Update sidebar preview
            setSidebarProjects(prev =>
                prev.map(p =>
                    p.id === selectedProjectId ? { ...p, last_message: data } : p
                )
            )
        } catch (err) {
            console.error('Send error:', err)
            toast.error('Failed to send message')
        } finally {
            setSending(false)
        }
    }

    const filteredProjects = sidebarProjects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="h-[calc(100vh-140px)] min-h-[600px] flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-[350px] flex flex-col bg-surface rounded-2xl border border-border overflow-hidden">
                <div className="p-5 border-b border-border">
                    <h2 className="text-xl font-heading font-semibold text-text-primary mb-4">Messages</h2>
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-accent/5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-border">
                    {sidebarLoading ? (
                        <div className="p-10 flex justify-center">
                            <Loader2 className="w-6 h-6 text-primary animate-spin opacity-40" />
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="p-10 text-center opacity-40">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm">No conversations found</p>
                        </div>
                    ) : (
                        filteredProjects.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedProjectId(p.id)}
                                className={cn(
                                    "w-full flex items-start gap-3 p-4 text-left transition-all hover:bg-accent/5",
                                    selectedProjectId === p.id
                                        ? "bg-primary/5 border-l-4 border-l-primary"
                                        : "border-l-4 border-l-transparent"
                                )}
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                                    {getInitials(p.client_name)}
                                </div>
                                <div className="flex-1 min-w-0 pr-2">
                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                        <h4 className="text-sm font-semibold text-text-primary truncate">{p.client_name}</h4>
                                        {p.last_message && (
                                            <span className="text-[10px] text-text-secondary whitespace-nowrap">
                                                {formatRelativeTime(p.last_message.created_at)}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest truncate mb-1">
                                        {p.title}
                                    </p>
                                    <p className="text-xs text-text-secondary truncate italic">
                                        {p.last_message ? p.last_message.body : 'Start a conversation...'}
                                    </p>
                                </div>
                                {p.unread_count > 0 && (
                                    <div className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                                        {p.unread_count > 9 ? '9+' : p.unread_count}
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col bg-surface rounded-2xl border border-border overflow-hidden">
                {selectedProject ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-6 py-4 border-b border-border bg-surface flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {getInitials(selectedProject.client_name)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-heading font-semibold text-text-primary">
                                        {selectedProject.client_name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-xs text-text-secondary font-medium uppercase tracking-tight">
                                            {selectedProject.title}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Link
                                href={`/studio/projects/${selectedProject.id}`}
                                className="btn-ghost p-2 rounded-full"
                                title="View Project"
                            >
                                <Plus className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-accent/5">
                            {/* Load older */}
                            {hasMore && (
                                <div className="flex justify-center pb-2">
                                    <button
                                        onClick={() => loadConversation(selectedProject.id, chatOffset)}
                                        disabled={loadingMore}
                                        className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full text-xs font-semibold text-text-secondary hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                                    >
                                        {loadingMore
                                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            : <ChevronUp className="w-3.5 h-3.5" />
                                        }
                                        Load older messages
                                    </button>
                                </div>
                            )}

                            {chatLoading ? (
                                <div className="flex justify-center py-16">
                                    <Loader2 className="w-7 h-7 text-primary animate-spin opacity-40" />
                                </div>
                            ) : chatMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full opacity-40 py-20">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                                        <MessageSquare className="w-7 h-7" />
                                    </div>
                                    <p className="text-sm text-text-secondary font-body">No messages yet. Start the conversation!</p>
                                </div>
                            ) : (
                                chatMessages.map((msg, idx) => {
                                    const isStudio = msg.sender_type === 'studio'
                                    const showDate = idx === 0 ||
                                        new Date(msg.created_at).toDateString() !==
                                        new Date(chatMessages[idx - 1].created_at).toDateString()

                                    return (
                                        <div key={msg.id} className="space-y-4">
                                            {showDate && (
                                                <div className="flex justify-center my-4">
                                                    <span className="px-3 py-1 bg-surface border border-border rounded-full text-[10px] font-bold text-text-secondary uppercase">
                                                        {formatDate(msg.created_at, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            )}
                                            <div className={cn(
                                                "flex flex-col max-w-[80%] gap-1",
                                                isStudio ? "ml-auto items-end" : "mr-auto items-start"
                                            )}>
                                                <div className={cn(
                                                    "px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm font-body",
                                                    isStudio
                                                        ? "bg-primary text-white rounded-tr-none"
                                                        : "bg-surface text-text-primary rounded-tl-none border border-border"
                                                )}>
                                                    {msg.body}
                                                </div>
                                                <div className="flex items-center gap-2 px-1">
                                                    <span className="text-[10px] text-text-secondary font-medium">
                                                        {formatDate(msg.created_at, { hour: 'numeric', minute: '2-digit' })}
                                                    </span>
                                                    {isStudio && (
                                                        <CheckCheck className={cn(
                                                            "w-3 h-3",
                                                            msg.read ? "text-blue-500" : "text-text-secondary opacity-50"
                                                        )} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Compose */}
                        <form onSubmit={handleSendMessage} className="p-6 border-t border-border bg-surface flex items-end gap-3">
                            <textarea
                                rows={1}
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder="Write your message here..."
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSendMessage(e)
                                    }
                                }}
                                className="flex-1 bg-accent/5 border border-border rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none max-h-40"
                            />
                            <button
                                type="submit"
                                disabled={sending || !newMessage.trim()}
                                className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                        <MessageSquare className="w-12 h-12 mb-4" />
                        <h3 className="text-xl font-heading font-semibold">Select a conversation</h3>
                        <p className="text-sm">Connect with your clients across projects</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
    return new Date(date).toLocaleDateString('en-US', options || {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })
}
