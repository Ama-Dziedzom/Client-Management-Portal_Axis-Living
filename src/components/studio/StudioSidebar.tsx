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
} from 'lucide-react'
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
    const { signOut, studioUser } = useStudio()
    const isInWebsite = pathname.startsWith('/studio/website')
    const [websiteOpen, setWebsiteOpen] = useState(isInWebsite)

    return (
        <aside className="hidden lg:flex w-[260px] flex-col fixed inset-y-0 left-0 bg-[#111318] z-50">
            {/* Top */}
            <div className="p-8">
                <Link href="/studio" className="block mb-1">
                    <h1 className="text-white font-heading text-[22px] font-semibold leading-tight">
                        Axis Living
                    </h1>
                </Link>
                <div className="text-[#8b8fa3] text-[10px] font-bold tracking-[0.15em] uppercase mt-1">
                    Studio Panel
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 overflow-y-auto space-y-1 pb-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/studio' && pathname.startsWith(item.href) && !pathname.startsWith('/studio/website'))
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                isActive
                                    ? "bg-white/10 text-white"
                                    : "text-[#8b8fa3] hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "text-[#8b8fa3] group-hover:text-white")} />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}

                {/* Website section — collapsible */}
                <div className="pt-2">
                    <button
                        onClick={() => setWebsiteOpen(o => !o)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                            isInWebsite
                                ? "bg-white/10 text-white"
                                : "text-[#8b8fa3] hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <Globe className={cn("w-5 h-5", isInWebsite ? "text-emerald-400" : "text-[#8b8fa3]")} />
                        <span className="flex-1 text-left">Website</span>
                        <ChevronDown className={cn(
                            "w-4 h-4 transition-transform duration-200",
                            websiteOpen ? "rotate-180" : ""
                        )} />
                    </button>

                    {websiteOpen && (
                        <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1">
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
                                            "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                                            isActive
                                                ? "bg-white/10 text-white"
                                                : "text-[#8b8fa3] hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <Icon className={cn("w-4 h-4", isActive ? "text-emerald-400" : "text-[#8b8fa3] group-hover:text-white")} />
                                        <span>{item.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </nav>

            {/* Bottom */}
            <div className="p-6 border-t border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                        {studioUser ? getInitials(studioUser.name) : 'S'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">
                            {studioUser?.name || 'Studio User'}
                        </div>
                        <div className="text-[#8b8fa3] text-xs truncate">
                            {studioUser?.role === 'admin' ? 'Admin' : 'Designer'}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 text-[#8b8fa3] text-sm font-medium hover:text-white transition-colors py-2"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    )
}
