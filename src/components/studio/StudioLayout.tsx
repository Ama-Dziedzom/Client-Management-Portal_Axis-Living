'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from '@/lib/icons'
import { useStudio } from '@/contexts/StudioContext'
import StudioSidebar from '@/components/studio/StudioSidebar'
import StudioTopBar from '@/components/studio/StudioTopBar'

export default function StudioLayout({ children }: { children: React.ReactNode }) {
    const { loading } = useStudio()

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="w-16 h-16 bg-[#111318] rounded-[24px] flex items-center justify-center shadow-lg border border-white/10">
                        <span className="text-white font-heading text-2xl font-bold">A</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin opacity-60" />
                        <p className="text-xs font-bold tracking-widest uppercase text-white/40">
                            Loading Studio...
                        </p>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background transition-colors duration-200">
            <StudioSidebar />
            <StudioTopBar />

            <main className="lg:pl-[260px] print:pl-0 flex-1">
                <div className="px-6 py-8 md:px-10 lg:px-12 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    )
}
