'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from '@/lib/icons'

interface DatePickerProps {
    value: string            // YYYY-MM-DD
    onChange: (v: string) => void
    placeholder?: string
    className?: string
    min?: string
    max?: string
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = ['Mo','Tu','We','Th','Fr','Sa','Su']

function parseLocal(iso: string): Date | null {
    if (!iso) return null
    const [y, m, d] = iso.split('-').map(Number)
    return new Date(y, m - 1, d)
}

function toISO(y: number, m: number, d: number) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export function DatePicker({ value, onChange, placeholder = 'Select a date', className = '' }: DatePickerProps) {
    const selected  = parseLocal(value)
    const today     = new Date(); today.setHours(0, 0, 0, 0)

    const [open, setOpen]         = useState(false)
    const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear())
    const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth())
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [])

    // Sync view when value changes externally
    useEffect(() => {
        if (selected) { setViewYear(selected.getFullYear()); setViewMonth(selected.getMonth()) }
    }, [value])

    const prevMonth = () => viewMonth === 0  ? (setViewMonth(11), setViewYear(y => y - 1)) : setViewMonth(m => m - 1)
    const nextMonth = () => viewMonth === 11 ? (setViewMonth(0),  setViewYear(y => y + 1)) : setViewMonth(m => m + 1)

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const rawFirst    = new Date(viewYear, viewMonth, 1).getDay()       // 0=Sun
    const firstOffset = rawFirst === 0 ? 6 : rawFirst - 1               // shift to Mon=0

    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate()
    const cells: { day: number; month: 'prev' | 'cur' | 'next' }[] = []

    for (let i = firstOffset - 1; i >= 0; i--)
        cells.push({ day: prevMonthDays - i, month: 'prev' })
    for (let d = 1; d <= daysInMonth; d++)
        cells.push({ day: d, month: 'cur' })
    const fill = 42 - cells.length
    for (let d = 1; d <= fill; d++)
        cells.push({ day: d, month: 'next' })

    const handleDay = (day: number) => { onChange(toISO(viewYear, viewMonth, day)); setOpen(false) }
    const goToday   = () => {
        setViewYear(today.getFullYear())
        setViewMonth(today.getMonth())
        onChange(toISO(today.getFullYear(), today.getMonth(), today.getDate()))
        setOpen(false)
    }

    const display = selected
        ? selected.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : ''

    return (
        <div ref={ref} className={`relative ${className}`}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={`input-field w-full flex items-center gap-3 text-left cursor-pointer ${open ? 'ring-2 ring-primary/20 border-primary/40' : ''}`}
            >
                <Calendar className="w-4 h-4 text-text-secondary flex-shrink-0" />
                <span className={`flex-1 text-sm ${display ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {display || placeholder}
                </span>
            </button>

            {/* Panel */}
            {open && (
                <div className="absolute top-[calc(100%+6px)] left-0 z-50 w-72 card-flat shadow-elevated p-4">
                    {/* Month / year nav */}
                    <div className="flex items-center justify-between mb-4">
                        <button type="button" onClick={prevMonth}
                            className="p-1.5 rounded-lg hover:bg-accent/20 text-text-secondary hover:text-text-primary transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-heading font-semibold text-text-primary select-none">
                            {MONTHS[viewMonth]} {viewYear}
                        </span>
                        <button type="button" onClick={nextMonth}
                            className="p-1.5 rounded-lg hover:bg-accent/20 text-text-secondary hover:text-text-primary transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 mb-1">
                        {DAYS.map(d => (
                            <p key={d} className="text-center text-[10px] font-bold text-text-secondary uppercase tracking-wide py-1">
                                {d}
                            </p>
                        ))}
                    </div>

                    {/* Day grid */}
                    <div className="grid grid-cols-7 gap-y-0.5">
                        {cells.map((cell, idx) => {
                            if (cell.month !== 'cur') return (
                                <div key={idx} className="h-8 flex items-center justify-center text-xs text-text-secondary/25 select-none">
                                    {cell.day}
                                </div>
                            )
                            const cellDate  = new Date(viewYear, viewMonth, cell.day)
                            const isSel     = selected && cellDate.getTime() === selected.getTime()
                            const isTod     = cellDate.getTime() === today.getTime()
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleDay(cell.day)}
                                    className={`h-8 flex items-center justify-center text-xs font-medium rounded-lg transition-all select-none ${
                                        isSel
                                            ? 'bg-primary text-white font-bold shadow-sm'
                                            : isTod
                                            ? 'ring-1 ring-primary text-primary font-bold'
                                            : 'text-text-primary hover:bg-accent/20'
                                    }`}
                                >
                                    {cell.day}
                                </button>
                            )
                        })}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                        <button
                            type="button"
                            onClick={() => { onChange(''); setOpen(false) }}
                            className="text-xs text-text-secondary hover:text-text-primary font-medium transition-colors"
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            onClick={goToday}
                            className="text-xs text-primary font-semibold hover:text-primary/80 transition-colors"
                        >
                            Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
