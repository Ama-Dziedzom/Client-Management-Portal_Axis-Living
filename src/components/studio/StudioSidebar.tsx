'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    FolderKanban,
    MessageSquare,
    Receipt,
    LogOut,
    Settings,
    Globe,
    ImageIcon,
    BookOpen,
    Star,
    BookMarked,
    CalendarDays,
    ChevronDown,
    Mail,
} from '@/lib/icons'
import { useStudio } from '@/contexts/StudioContext'

import { cn, getInitials } from '@/lib/utils'

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/studio' },
    { label: 'Clients',   icon: Users,           href: '/studio/clients' },
    { label: 'Projects',  icon: FolderKanban,    href: '/studio/projects' },
    { label: 'Bookings',  icon: CalendarDays,    href: '/studio/bookings' },
    { label: 'Messages',  icon: MessageSquare,   href: '/studio/messages' },
    { label: 'Invoices',  icon: Receipt,         href: '/studio/invoices' },
    { label: 'Settings',  icon: Settings,        href: '/studio/settings' },
]

const websiteNavItems = [
    { label: 'Overview',      icon: Globe,      href: '/studio/website' },
    { label: 'Portfolio',     icon: ImageIcon,  href: '/studio/website/portfolio' },
    { label: 'Journal',       icon: BookOpen,   href: '/studio/website/journal' },
    { label: 'Testimonials',  icon: Star,       href: '/studio/website/testimonials' },
    { label: 'Lookbook',      icon: BookMarked, href: '/studio/website/lookbook' },
    { label: 'Emails',        icon: Mail,       href: '/studio/website/emails' },
    { label: 'Site Settings', icon: Settings,   href: '/studio/website/settings' },
]

export default function StudioSidebar() {
    const pathname = usePathname()
    const { signOut, studioUser, unreadCount } = useStudio()
    const isInWebsite = pathname.startsWith('/studio/website')
    const [websiteOpen, setWebsiteOpen] = useState(isInWebsite)

    return (
        <aside className="print:hidden hidden lg:flex w-[260px] flex-col fixed inset-y-0 left-0 bg-[#1a2018] z-50">
            {/* Branding */}
            <div className="px-7 pt-7 pb-5 border-b border-[#C6B9AA]/10">
                <Link href="/studio" className="block">
                    <img src="/axis-living.png" alt="Axis Living" className="h-[4.75rem] w-auto rounded-md" />
                </Link>
                <div className="text-[#a09489] text-[10px] font-bold tracking-[0.18em] uppercase mt-2.5">
                    Studio Panel
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 overflow-y-auto pt-5 pb-4 space-y-0.5">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/studio' && pathname.startsWith(item.href) && !pathname.startsWith('/studio/website'))
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150",
                                isActive
                                    ? "bg-[#2F402C] text-white"
                                    : "text-[#a09489] hover:bg-[#2F402C]/50 hover:text-white"
                            )}
                        >
                            <Icon className={cn(
                                "w-[18px] h-[18px] flex-shrink-0 transition-colors",
                                isActive ? "text-[#C6B9AA]" : "text-[#a09489] group-hover:text-[#C6B9AA]"
                            )} />
                            <span className="flex-1">{item.label}</span>
                            {item.label === 'Messages' && unreadCount > 0 && (
                                <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </Link>
                    )
                })}

                {/* Website Section */}
                <div className="pt-4">
                    <div className="px-4 mb-2">
                        <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-[#a09489]/50">
                            Website
                        </span>
                    </div>

                    <button
                        onClick={() => setWebsiteOpen(o => !o)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150",
                            isInWebsite
                                ? "bg-[#2F402C] text-white"
                                : "text-[#a09489] hover:bg-[#2F402C]/50 hover:text-white"
                        )}
                    >
                        <Globe className={cn(
                            "w-[18px] h-[18px] flex-shrink-0",
                            isInWebsite ? "text-[#C6B9AA]" : "text-[#a09489]"
                        )} />
                        <span className="flex-1 text-left">Manage Site</span>
                        <ChevronDown className={cn(
                            "w-4 h-4 text-[#a09489] transition-transform duration-200",
                            websiteOpen ? "rotate-180" : ""
                        )} />
                    </button>

                    {websiteOpen && (
                        <div className="mt-1 ml-4 pl-4 border-l border-[#C6B9AA]/15 space-y-0.5">
                            {websiteNavItems.map((item) => {
                                const isActive = item.href === '/studio/website'
                                    ? pathname === '/studio/website'
                                    : pathname.startsWith(item.href)
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                                            isActive
                                                ? "bg-[#2F402C] text-white"
                                                : "text-[#a09489] hover:bg-[#2F402C]/50 hover:text-white"
                                        )}
                                    >
                                        <Icon className={cn(
                                            "w-4 h-4 flex-shrink-0 transition-colors",
                                            isActive ? "text-[#C6B9AA]" : "text-[#a09489] group-hover:text-[#C6B9AA]"
                                        )} />
                                        <span>{item.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </nav>

            {/* User / Sign out */}
            <div className="px-6 py-5 border-t border-[#C6B9AA]/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#C6B9AA]/15 flex items-center justify-center text-[#C6B9AA] text-xs font-bold flex-shrink-0">
                        {studioUser ? getInitials(studioUser.name) : 'S'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">
                            {studioUser?.name || 'Studio User'}
                        </div>
                        <div className="text-[#a09489] text-xs truncate">
                            {studioUser?.role === 'admin' ? 'Admin' : 'Designer'}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 text-[#a09489] text-sm font-medium hover:text-white transition-colors py-1.5"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    )
}
