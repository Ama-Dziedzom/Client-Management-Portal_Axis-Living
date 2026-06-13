'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Menu, X,
    LayoutDashboard, Users, FolderKanban, MessageSquare, Receipt,
    CalendarDays, Settings, Globe, LogOut,
} from '@/lib/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { useStudio } from '@/contexts/StudioContext'
import { cn, getInitials } from '@/lib/utils'

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/studio' },
    { label: 'Clients',   icon: Users,           href: '/studio/clients' },
    { label: 'Projects',  icon: FolderKanban,    href: '/studio/projects' },
    { label: 'Bookings',  icon: CalendarDays,    href: '/studio/bookings' },
    { label: 'Messages',  icon: MessageSquare,   href: '/studio/messages' },
    { label: 'Invoices',  icon: Receipt,         href: '/studio/invoices' },
    { label: 'Website',   icon: Globe,           href: '/studio/website' },
    { label: 'Settings',  icon: Settings,        href: '/studio/settings' },
]

export default function StudioTopBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()
    const { signOut, studioUser } = useStudio()

    return (
        <>
            <header className="lg:hidden h-16 bg-[#1a2018] border-b border-[#C6B9AA]/10 flex items-center justify-between px-5 sticky top-0 z-40">
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="p-2 -ml-2 text-[#a09489] hover:text-white transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <Link href="/studio" className="absolute left-1/2 -translate-x-1/2">
                    <img src="/axis-living.png" alt="Axis Living" className="h-9 w-auto rounded-sm" />
                </Link>

                <div className="w-8 h-8 rounded-xl bg-[#C6B9AA]/15 flex items-center justify-center text-[#C6B9AA] text-xs font-bold">
                    {getInitials(studioUser?.name)}
                </div>
            </header>

            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-[#1a2018] z-[101] shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="px-6 py-5 flex items-center justify-between border-b border-[#C6B9AA]/10">
                                <div>
                                    <img src="/axis-living.png" alt="Axis Living" className="h-9 w-auto rounded-sm" />
                                    <div className="text-[#a09489] text-[10px] font-bold tracking-[0.18em] uppercase mt-2">
                                        Studio Panel
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 text-[#a09489] hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Nav */}
                            <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href ||
                                        (item.href !== '/studio' && pathname.startsWith(item.href))
                                    const Icon = item.icon
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={cn(
                                                "flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all",
                                                isActive
                                                    ? "bg-[#2F402C] text-white"
                                                    : "text-[#a09489] hover:bg-[#2F402C]/50 hover:text-white"
                                            )}
                                        >
                                            <Icon className={cn(
                                                "w-5 h-5",
                                                isActive ? "text-[#C6B9AA]" : "text-[#a09489]"
                                            )} />
                                            <span>{item.label}</span>
                                        </Link>
                                    )
                                })}
                            </nav>

                            {/* Footer */}
                            <div className="p-5 border-t border-[#C6B9AA]/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 rounded-xl bg-[#C6B9AA]/15 flex items-center justify-center text-[#C6B9AA] text-xs font-bold">
                                        {getInitials(studioUser?.name)}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-white text-sm font-medium truncate">{studioUser?.name}</div>
                                        <div className="text-[#a09489] text-xs">
                                            {studioUser?.role === 'admin' ? 'Admin' : 'Designer'}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setIsMenuOpen(false); signOut() }}
                                    className="w-full flex items-center justify-center gap-2 text-[#a09489] text-sm font-semibold border border-[#C6B9AA]/15 rounded-xl py-3 hover:bg-[#2F402C]/50 hover:text-white transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
