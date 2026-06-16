'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { ChevronDown, Check } from '@/lib/icons'

export interface SelectOption {
    value: string
    label: string
    disabled?: boolean
}

interface CustomSelectProps {
    value: string
    onChange: (value: string) => void
    options: SelectOption[]
    placeholder?: string
    className?: string
    required?: boolean
    icon?: ReactNode
    size?: 'sm' | 'default'
}

export function CustomSelect({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    className = '',
    icon,
    size = 'default',
}: CustomSelectProps) {
    const [open, setOpen]   = useState(false)
    const ref               = useRef<HTMLDivElement>(null)
    const selected          = options.find(o => o.value === value)

    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [])

    const isSmall = size === 'sm'

    return (
        <div ref={ref} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={
                    isSmall
                        ? `flex items-center gap-1.5 border border-border rounded-lg px-2.5 py-1.5 text-xs text-text-secondary bg-surface hover:border-primary/40 focus:outline-none transition-colors cursor-pointer ${open ? 'border-primary/40' : ''}`
                        : `input-field w-full flex items-center gap-3 text-left cursor-pointer ${open ? 'ring-2 ring-primary/20 border-primary/40' : ''}`
                }
            >
                {icon && !isSmall && (
                    <span className="flex-shrink-0 text-text-secondary">{icon}</span>
                )}
                <span className={`flex-1 truncate text-sm ${selected && !isSmall ? 'text-text-primary font-medium' : isSmall ? (selected ? 'text-text-secondary' : 'text-text-secondary') : 'text-text-secondary'}`}>
                    {isSmall ? selected?.label ?? placeholder : selected?.label ?? placeholder}
                </span>
                <ChevronDown className={`flex-shrink-0 text-text-secondary transition-transform ${open ? 'rotate-180' : ''} ${isSmall ? 'w-3 h-3' : 'w-4 h-4'}`} />
            </button>

            {open && (
                <div className={`absolute z-50 mt-1.5 card-flat shadow-elevated py-1 overflow-y-auto ${isSmall ? 'left-0 right-auto min-w-[140px] max-h-48' : 'left-0 right-0 max-h-64'}`}>
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            disabled={opt.disabled}
                            onClick={() => {
                                if (!opt.disabled) { onChange(opt.value); setOpen(false) }
                            }}
                            className={`w-full flex items-center justify-between gap-3 text-left transition-colors ${
                                isSmall
                                    ? 'px-3 py-2 text-xs'
                                    : 'px-4 py-2.5 text-sm'
                            } ${
                                opt.disabled
                                    ? 'text-text-secondary/40 cursor-default italic'
                                    : opt.value === value
                                    ? 'text-primary font-semibold bg-primary/5'
                                    : 'text-text-primary hover:bg-accent/10 cursor-pointer'
                            }`}
                        >
                            <span className="flex-1">{opt.label}</span>
                            {opt.value === value && !opt.disabled && (
                                <Check className={`flex-shrink-0 text-primary ${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
