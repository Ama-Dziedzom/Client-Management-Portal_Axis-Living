'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Booking } from '@/types/database'
import { CalendarDays, Clock, Mail, Phone, Search, CreditCard, Tag, ChevronLeft, ChevronRight, X, Calendar, ListTodo } from '@/lib/icons'
import { CustomSelect } from '@/components/ui/CustomSelect'
import toast from 'react-hot-toast'

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

const STATUS_DOT: Record<string, string> = {
    confirmed: 'bg-emerald-500',
    completed: 'bg-blue-500',
    cancelled:  'bg-red-400',
    no_show:    'bg-amber-400',
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
    residential:  'Residential',
    commercial:   'Commercial',
    renovation:   'Renovation',
    consultation: 'Consultation',
    other:        'Other',
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

type Filter = 'upcoming' | 'past' | 'all'
type View = 'list' | 'calendar'

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<Filter>('upcoming')
    const [view, setView] = useState<View>('list')
    const [consultationType, setConsultationType] = useState<string | null>(null)

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
        const res = await fetch('/api/studio/bookings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status }),
        })
        if (res.ok) {
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
            toast.success(`Status updated to ${status.replace('_', ' ')}`)
        } else {
            toast.error('Failed to update status')
        }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const consultationTypes = Array.from(
        new Set(bookings.map(b => b.consultation_type).filter((t): t is string => !!t))
    ).sort()

    const filtered = bookings
        .filter(b => {
            const bookingDate = new Date(b.date)
            const isPast = bookingDate < today || b.status === 'completed' || b.status === 'cancelled' || b.status === 'no_show'
            const matchesFilter =
                filter === 'all'      ? true :
                filter === 'upcoming' ? !isPast :
                                        isPast

            const q = search.toLowerCase()
            const matchesSearch = !q || b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q)
            const matchesType = !consultationType || b.consultation_type === consultationType
            return matchesFilter && matchesSearch && matchesType
        })
        .sort((a, b) => {
            const diff = new Date(a.date).getTime() - new Date(b.date).getTime()
            return filter === 'past' ? -diff : diff
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

            {/* Consultation type chips */}
            {consultationTypes.length > 1 && (
                <motion.div variants={item} className="flex flex-wrap gap-2 mb-4">
                    <button
                        onClick={() => setConsultationType(null)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                            !consultationType
                                ? 'bg-primary text-white border-primary'
                                : 'bg-surface text-text-secondary border-border hover:text-text-primary hover:border-primary/30'
                        }`}
                    >
                        All types
                    </button>
                    {consultationTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => setConsultationType(consultationType === type ? null : type)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                consultationType === type
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-surface text-text-secondary border-border hover:text-text-primary hover:border-primary/30'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </motion.div>
            )}

            {/* Toolbar */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 mb-6">
                {view === 'list' && (
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
                )}
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
                <div className="flex gap-1 bg-surface border border-border rounded-xl p-1">
                    <button
                        onClick={() => setView('list')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                            view === 'list'
                                ? 'bg-accent/20 text-primary border border-accent/30'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        <ListTodo className="w-4 h-4" /> List
                    </button>
                    <button
                        onClick={() => setView('calendar')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                            view === 'calendar'
                                ? 'bg-accent/20 text-primary border border-accent/30'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        <Calendar className="w-4 h-4" /> Calendar
                    </button>
                </div>
            </motion.div>

            {/* Content */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
                </div>
            ) : view === 'calendar' ? (
                <motion.div variants={item}>
                    <CalendarView bookings={bookings} search={search} updateStatus={updateStatus} />
                </motion.div>
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
                        <motion.div key={booking.id} variants={item}>
                            <BookingCard booking={booking} updateStatus={updateStatus} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    )
}

// ─── Calendar View ────────────────────────────────────────────────────────────

function CalendarView({ bookings, search, updateStatus }: {
    bookings: Booking[]
    search: string
    updateStatus: (id: string, status: Booking['status']) => Promise<void>
}) {
    const [currentMonth, setCurrentMonth] = useState(() => {
        const d = new Date()
        d.setDate(1)
        d.setHours(0, 0, 0, 0)
        return d
    })
    const [selectedDay, setSelectedDay] = useState<string | null>(null)

    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = toDateStr(today)

    const q = search.toLowerCase()
    const visibleBookings = !q
        ? bookings
        : bookings.filter(b => b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q))

    const byDate = visibleBookings.reduce<Record<string, Booking[]>>((acc, b) => {
        const key = normalizeDateStr(b.date)
        acc[key] = acc[key] ? [...acc[key], b] : [b]
        return acc
    }, {})

    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: (number | null)[] = [
        ...Array(firstDayOfMonth).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ]
    while (cells.length % 7 !== 0) cells.push(null)

    const selectedBookings = selectedDay
        ? (byDate[selectedDay] ?? []).slice().sort((a, b) => a.time.localeCompare(b.time))
        : []

    const goToPrev = () => setCurrentMonth(new Date(year, month - 1, 1))
    const goToNext = () => setCurrentMonth(new Date(year, month + 1, 1))

    return (
        <div className="flex gap-5 items-start">
            {/* Grid */}
            <div className="flex-1 card-flat min-w-0">
                {/* Month nav */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={goToPrev}
                        className="p-2 rounded-lg hover:bg-accent/10 text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <h2 className="font-heading font-semibold text-text-primary text-lg">
                        {MONTH_NAMES[month]} {year}
                    </h2>
                    <button
                        onClick={goToNext}
                        className="p-2 rounded-lg hover:bg-accent/10 text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 mb-1">
                    {DAYS_OF_WEEK.map(d => (
                        <div key={d} className="text-center text-xs font-medium text-text-secondary uppercase tracking-wider py-2">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                    {cells.map((day, i) => {
                        if (day === null) return <div key={`e-${i}`} className="min-h-[60px]" />

                        const dateStr = toDateStr(new Date(year, month, day))
                        const dayBookings = byDate[dateStr] ?? []
                        const isToday = dateStr === todayStr
                        const isSelected = dateStr === selectedDay
                        const isPast = new Date(year, month, day) < today

                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                                className={[
                                    'relative flex flex-col items-center pt-2 pb-2 px-1 rounded-xl min-h-[60px] transition-all duration-150',
                                    isSelected
                                        ? 'bg-primary text-white shadow-md'
                                        : isToday
                                            ? 'bg-accent/15 text-primary ring-1 ring-primary/20'
                                            : 'hover:bg-surface text-text-primary',
                                    isPast && !isSelected && !isToday ? 'opacity-50' : '',
                                ].join(' ')}
                            >
                                <span className={`text-sm leading-none mb-1.5 ${isToday && !isSelected ? 'font-bold' : 'font-medium'}`}>
                                    {day}
                                </span>
                                {dayBookings.length > 0 && (
                                    <div className="flex gap-0.5 flex-wrap justify-center">
                                        {dayBookings.slice(0, 3).map((b, idx) => (
                                            <span
                                                key={idx}
                                                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isSelected ? 'bg-white/75' : STATUS_DOT[b.status] ?? 'bg-primary'}`}
                                            />
                                        ))}
                                        {dayBookings.length > 3 && (
                                            <span className={`text-[9px] font-bold leading-none mt-px ${isSelected ? 'text-white/75' : 'text-text-secondary'}`}>
                                                +{dayBookings.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border flex-wrap">
                    {Object.entries(STATUS_DOT).map(([status, cls]) => (
                        <span key={status} className="flex items-center gap-1.5 text-xs text-text-secondary capitalize">
                            <span className={`w-2 h-2 rounded-full ${cls}`} />
                            {status.replace('_', ' ')}
                        </span>
                    ))}
                </div>
            </div>

            {/* Day panel */}
            <AnimatePresence>
                {selectedDay && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="w-80 flex-shrink-0 flex flex-col gap-3"
                    >
                        {/* Panel header */}
                        <div className="card-flat flex items-center justify-between">
                            <div>
                                <div className="text-xs text-text-secondary uppercase tracking-widest font-medium mb-0.5">
                                    {toDisplayDate(selectedDay)}
                                </div>
                                <div className="font-semibold text-text-primary">
                                    {selectedBookings.length === 0
                                        ? 'No bookings'
                                        : `${selectedBookings.length} booking${selectedBookings.length > 1 ? 's' : ''}`}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedDay(null)}
                                className="p-2 rounded-lg hover:bg-accent/10 text-text-secondary hover:text-text-primary transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {selectedBookings.length === 0 ? (
                            <div className="card-flat flex flex-col items-center py-10 text-center">
                                <CalendarDays className="w-8 h-8 text-text-secondary/30 mb-3" />
                                <p className="text-sm text-text-secondary">Nothing scheduled for this day.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-22rem)]">
                                {selectedBookings.map(booking => (
                                    <BookingCard key={booking.id} booking={booking} updateStatus={updateStatus} compact />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ─── Booking Card ─────────────────────────────────────────────────────────────

function BookingCard({ booking, updateStatus, compact = false }: {
    booking: Booking
    updateStatus: (id: string, status: Booking['status']) => Promise<void>
    compact?: boolean
}) {
    return (
        <div className="card-flat hover:shadow-elevated transition-all duration-300">
            <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                    {booking.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-text-primary font-semibold text-sm">{booking.name}</div>
                    <div className="flex items-center gap-1 text-text-secondary text-xs mt-0.5">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{booking.email}</span>
                    </div>
                    {booking.phone && (
                        <div className="flex items-center gap-1 text-text-secondary text-xs mt-0.5">
                            <Phone className="w-3 h-3 flex-shrink-0" /> {booking.phone}
                        </div>
                    )}
                </div>
                <div className={`flex flex-col items-end gap-1 text-sm flex-shrink-0 ${compact ? '' : 'hidden sm:flex'}`}>
                    {!compact && (
                        <div className="flex items-center gap-1.5 text-text-primary font-medium">
                            <CalendarDays className="w-3.5 h-3.5 text-text-secondary" />
                            {booking.date}
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 text-text-secondary">
                        <Clock className="w-3.5 h-3.5" />
                        {booking.time} CAT
                    </div>
                </div>
            </div>

            {/* Date/time row for list view on mobile */}
            {!compact && (
                <div className="flex items-center gap-3 mt-3 sm:hidden text-xs text-text-secondary">
                    <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {booking.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {booking.time} CAT</span>
                </div>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
                {booking.consultation_type && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/8 border border-primary/15 px-2 py-0.5 rounded-full">
                        <Tag className="w-3 h-3" /> {booking.consultation_type}
                    </span>
                )}
                {booking.project_type && (
                    <span className="flex items-center gap-1 text-xs text-text-secondary">
                        <Tag className="w-3 h-3" />
                        {PROJECT_TYPE_LABELS[booking.project_type] ?? booking.project_type}
                    </span>
                )}
                {!compact && booking.amount && (
                    <span className="flex items-center gap-1 text-xs text-text-secondary">
                        <CreditCard className="w-3 h-3" />
                        {booking.currency} {booking.amount.toLocaleString()}
                        {booking.payment_reference && (
                            <span className="text-text-secondary/50"> · {booking.payment_reference}</span>
                        )}
                    </span>
                )}
                {!compact && booking.message && (
                    <span className="text-xs text-text-secondary italic truncate max-w-xs">
                        &ldquo;{booking.message}&rdquo;
                    </span>
                )}

                <div className="ml-auto">
                    <CustomSelect
                        size="sm"
                        value={booking.status}
                        onChange={v => updateStatus(booking.id, v as Booking['status'])}
                        triggerClassName={`flex items-center gap-1.5 border rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors focus:outline-none ${STATUS_STYLES[booking.status] || STATUS_STYLES.confirmed}`}
                        options={[
                            { value: 'confirmed', label: 'Confirmed' },
                            { value: 'completed', label: 'Completed' },
                            { value: 'cancelled', label: 'Cancelled' },
                            { value: 'no_show',   label: 'No Show' },
                        ]}
                    />
                </div>
            </div>
        </div>
    )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateStr(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Converts any date string (ISO "2026-06-23" or long "June 23, 2026") to "YYYY-MM-DD"
function normalizeDateStr(dateStr: string): string {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? dateStr : toDateStr(d)
}

function toDisplayDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}
