'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Booking } from '@/types/database'
import { CalendarDays, Clock, Mail, Phone, Search, CreditCard, Tag } from 'lucide-react'

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const STATUS_STYLES: Record<string, string> = {
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    completed:  'bg-blue-50 text-blue-700 border-blue-200',
    cancelled:  'bg-red-50 text-red-700 border-red-200',
    no_show:    'bg-amber-50 text-amber-700 border-amber-200',
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
    residential:  'Residential',
    commercial:   'Commercial',
    renovation:   'Renovation',
    consultation: 'Consultation',
    other:        'Other',
}

type Filter = 'upcoming' | 'past' | 'all'

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<Filter>('upcoming')

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        try {
            const res = await fetch('/api/studio/bookings')
            const result = await res.json()
            setBookings(result.data || [])
        } catch (err) {
            console.error('Failed to fetch bookings:', err)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (id: string, status: Booking['status']) => {
        await fetch('/api/studio/bookings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status }),
        })
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const filtered = bookings.filter(b => {
        const bookingDate = new Date(b.date)
        const isPast = bookingDate < today || b.status === 'completed' || b.status === 'cancelled' || b.status === 'no_show'
        const matchesFilter =
            filter === 'all'      ? true :
            filter === 'upcoming' ? !isPast :
                                    isPast

        const q = search.toLowerCase()
        const matchesSearch = !q || b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q)
        return matchesFilter && matchesSearch
    })

    const upcomingCount  = bookings.filter(b => new Date(b.date) >= today && b.status === 'confirmed' && !['completed', 'cancelled', 'no_show'].includes(b.status)).length
    const thisMonthCount = bookings.filter(b => {
        const d = new Date(b.created_at)
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
    }).length

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            {/* Header */}
            <motion.div variants={item} className="mb-10">
                <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-text-primary mb-2">Bookings</h1>
                <p className="text-text-secondary font-body text-lg">Consultation requests from axisliving.co.zm</p>
            </motion.div>

            {/* Stats */}
            <motion.div variants={item} className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Upcoming', value: upcomingCount },
                    { label: 'Total',    value: bookings.length },
                    { label: 'This Month', value: thisMonthCount },
                ].map(stat => (
                    <div key={stat.label} className="card-flat text-center">
                        <div className="text-3xl font-bold text-text-primary mb-1">{stat.value}</div>
                        <div className="text-text-secondary text-xs uppercase tracking-widest font-medium">{stat.label}</div>
                    </div>
                ))}
            </motion.div>

            {/* Filters + Search */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex gap-1 bg-surface border border-border rounded-xl p-1">
                    {(['upcoming', 'past', 'all'] as Filter[]).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                                filter === f
                                    ? 'bg-accent/20 text-primary border border-accent/30'
                                    : 'text-text-secondary hover:text-text-primary'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input-field pl-11"
                    />
                </div>
            </motion.div>

            {/* List */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
                </div>
            ) : filtered.length === 0 ? (
                <motion.div variants={item} className="card-flat flex flex-col items-center justify-center py-16 text-center">
                    <CalendarDays className="w-10 h-10 text-text-secondary/30 mb-4" />
                    <h3 className="font-heading text-lg font-semibold text-text-primary mb-1">
                        {filter === 'upcoming' ? 'No upcoming bookings' : 'No bookings found'}
                    </h3>
                    <p className="text-sm text-text-secondary">
                        {filter === 'upcoming' ? 'New bookings from the website will appear here.' : 'Try adjusting your filters.'}
                    </p>
                </motion.div>
            ) : (
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
                    {filtered.map(booking => (
                        <motion.div key={booking.id} variants={item} className="card-flat hover:shadow-elevated transition-all duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                {/* Avatar + Name */}
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                                        {booking.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-text-primary font-semibold text-sm">{booking.name}</div>
                                        <div className="flex items-center gap-1 text-text-secondary text-xs mt-0.5">
                                            <Mail className="w-3 h-3" /> {booking.email}
                                        </div>
                                        {booking.phone && (
                                            <div className="flex items-center gap-1 text-text-secondary text-xs mt-0.5">
                                                <Phone className="w-3 h-3" /> {booking.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Date + Time */}
                                <div className="flex flex-col gap-1 text-sm sm:text-right flex-shrink-0">
                                    <div className="flex items-center gap-1.5 text-text-primary font-medium sm:justify-end">
                                        <CalendarDays className="w-3.5 h-3.5 text-text-secondary" />
                                        {booking.date}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-text-secondary sm:justify-end">
                                        <Clock className="w-3.5 h-3.5" />
                                        {booking.time} CAT
                                    </div>
                                </div>
                            </div>

                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-border">
                                {booking.project_type && (
                                    <span className="flex items-center gap-1 text-xs text-text-secondary">
                                        <Tag className="w-3 h-3" />
                                        {PROJECT_TYPE_LABELS[booking.project_type] ?? booking.project_type}
                                    </span>
                                )}
                                {booking.amount && (
                                    <span className="flex items-center gap-1 text-xs text-text-secondary">
                                        <CreditCard className="w-3 h-3" />
                                        {booking.currency} {booking.amount.toLocaleString()}
                                        {booking.payment_reference && (
                                            <span className="text-text-secondary/50"> · {booking.payment_reference}</span>
                                        )}
                                    </span>
                                )}
                                {booking.message && (
                                    <span className="text-xs text-text-secondary italic truncate max-w-xs">
                                        &ldquo;{booking.message}&rdquo;
                                    </span>
                                )}

                                <div className="ml-auto flex items-center gap-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${STATUS_STYLES[booking.status] || STATUS_STYLES.confirmed}`}>
                                        {booking.status.replace('_', ' ')}
                                    </span>
                                    <select
                                        value={booking.status}
                                        onChange={e => updateStatus(booking.id, e.target.value as Booking['status'])}
                                        className="text-xs border border-border rounded-lg px-2 py-1.5 text-text-secondary bg-surface focus:outline-none focus:border-primary cursor-pointer"
                                    >
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="no_show">No Show</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    )
}
