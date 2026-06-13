'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    FolderKanban,
    FileText,
    MessageSquare,
    Receipt,
    Settings,
    LogOut
} from '@/lib/icons'
import { useAuth } from '@/contexts/AuthContext'
import { useDashboard } from '@/contexts/DashboardContext'
import { cn } from '@/lib/utils'

const navItems = [
    { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Projects', icon: FolderKanban, href: '/projects' },
    { label: 'Documents', icon: FileText, href: '/documents' },
    { label: 'Messages', icon: MessageSquare, href: '/messages', showBadge: true },
    { label: 'Invoices', icon: Receipt, href: '/invoices' },
    { label: 'Settings', icon: Settings, href: '/settings' },
]

export default function Sidebar() {
    const pathname = usePathname()
    const { signOut, client } = useAuth()
    const { unreadCount } = useDashboard()

    return (
        <aside className="hidden lg:flex w-[240px] flex-col fixed inset-y-0 left-0 bg-[#2F402C] z-50">
            {/* Top Section */}
            <div className="px-7 pt-7 pb-5 border-b border-white/10">
                <Link href="/dashboard" className="block">
                    <img src="/axis-living.png" alt="Axis Living" className="h-[4.75rem] w-auto rounded-md" />
                </Link>
                <div className="text-[#C6B9AA] text-[10px] font-bold tracking-[0.1em] uppercase mt-2.5">
                    Client Portal
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 pt-5 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all relative overflow-hidden",
                                isActive
                                    ? "bg-white/10 text-[#C6B9AA]"
                                    : "text-white hover:bg-white/10"
                            )}
                        >
                            {/* Active indicator border */}
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-white" />
                            )}

                            <Icon className={cn("w-5 h-5", isActive ? "text-[#C6B9AA]" : "text-white")} />
                            <span className="flex-1">{item.label}</span>

                            {item.showBadge && unreadCount > 0 && (
                                <span className="bg-[#C6B9AA] text-[#2F402C] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-6 border-t border-white/10">
                <div className="mb-4">
                    <div className="text-white text-sm font-medium truncate">
                        {client?.name || 'Client Name'}
                    </div>
                    <div className="text-[#C6B9AA] text-xs truncate">
                        {client?.email || 'client@email.com'}
                    </div>
                </div>
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 text-[#C6B9AA] text-sm font-medium hover:text-white transition-colors py-2"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    )
}
