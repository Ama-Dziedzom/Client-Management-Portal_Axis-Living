'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

const COUNTRIES = [
    { name: 'Zambia',               code: 'ZM', dial: '260' },
    { name: 'Zimbabwe',             code: 'ZW', dial: '263' },
    { name: 'South Africa',         code: 'ZA', dial: '27'  },
    { name: 'Kenya',                code: 'KE', dial: '254' },
    { name: 'Tanzania',             code: 'TZ', dial: '255' },
    { name: 'Uganda',               code: 'UG', dial: '256' },
    { name: 'Botswana',             code: 'BW', dial: '267' },
    { name: 'Malawi',               code: 'MW', dial: '265' },
    { name: 'Mozambique',           code: 'MZ', dial: '258' },
    { name: 'Namibia',              code: 'NA', dial: '264' },
    { name: 'Ghana',                code: 'GH', dial: '233' },
    { name: 'Nigeria',              code: 'NG', dial: '234' },
    { name: 'Rwanda',               code: 'RW', dial: '250' },
    { name: 'Ethiopia',             code: 'ET', dial: '251' },
    { name: 'Angola',               code: 'AO', dial: '244' },
    { name: 'DR Congo',             code: 'CD', dial: '243' },
    { name: 'United Kingdom',       code: 'GB', dial: '44'  },
    { name: 'United States',        code: 'US', dial: '1'   },
    { name: 'Canada',               code: 'CA', dial: '1'   },
    { name: 'Australia',            code: 'AU', dial: '61'  },
    { name: 'Germany',              code: 'DE', dial: '49'  },
    { name: 'France',               code: 'FR', dial: '33'  },
    { name: 'Netherlands',          code: 'NL', dial: '31'  },
    { name: 'UAE',                  code: 'AE', dial: '971' },
    { name: 'India',                code: 'IN', dial: '91'  },
    { name: 'China',                code: 'CN', dial: '86'  },
]

function flag(code: string) {
    return code
        .toUpperCase()
        .split('')
        .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
        .join('')
}

interface PhoneInputProps {
    value: string
    onChange: (value: string) => void
    className?: string
}

export default function PhoneInput({ onChange, className }: PhoneInputProps) {
    const [selectedDial, setSelectedDial] = useState('260')
    const [localNumber, setLocalNumber] = useState('')
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const selected = COUNTRIES.find((c) => c.dial === selectedDial) ?? COUNTRIES[0]

    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', onClickOutside)
        return () => document.removeEventListener('mousedown', onClickOutside)
    }, [])

    const handleCountrySelect = (dial: string) => {
        setSelectedDial(dial)
        setOpen(false)
        onChange(localNumber ? `+${dial}${localNumber}` : '')
    }

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, '')
        setLocalNumber(digits)
        onChange(digits ? `+${selectedDial}${digits}` : '')
    }

    return (
        <div className={cn('flex gap-2', className)} ref={ref}>
            {/* Compact country trigger — shows flag + dial code only */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    className="flex items-center gap-1.5 h-full input-field px-3 cursor-pointer whitespace-nowrap text-sm font-medium"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                >
                    <span className="text-base leading-none">{flag(selected.code)}</span>
                    <span className="text-text-secondary">+{selected.dial}</span>
                    <svg className="w-3.5 h-3.5 text-text-secondary ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown list */}
                {open && (
                    <div className="absolute z-50 top-full left-0 mt-1 w-56 bg-white border border-border rounded-xl shadow-xl overflow-y-auto max-h-64 py-1">
                        {COUNTRIES.map((c) => (
                            <button
                                key={`${c.code}-${c.dial}`}
                                type="button"
                                onClick={() => handleCountrySelect(c.dial)}
                                className={cn(
                                    'w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-surface transition-colors',
                                    c.dial === selectedDial && 'bg-primary/5 text-primary font-medium'
                                )}
                            >
                                <span className="text-base leading-none">{flag(c.code)}</span>
                                <span className="flex-1 truncate">{c.name}</span>
                                <span className="text-text-secondary text-xs">+{c.dial}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Local number input */}
            <input
                type="tel"
                inputMode="numeric"
                placeholder="97 045 6789"
                value={localNumber}
                onChange={handleNumberChange}
                className="input-field flex-1"
            />
        </div>
    )
}
