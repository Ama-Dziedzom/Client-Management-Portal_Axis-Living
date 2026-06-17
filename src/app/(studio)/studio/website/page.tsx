'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { studioSupabase as supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Globe, ImageIcon, BookOpen, Tag, Star, BookMarked, Palette, Settings, ArrowRight } from '@/lib/icons'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function WebsiteOverviewPage() {
    const [counts, setCounts] = useState({
        projects: 0,
        posts: 0,
        pricing: 0,
        testimonials: 0,
        lookbooks: 0,
        moodbooks: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCounts() {
            const [projects, posts, pricing, testimonials, lookbooks, moodbooks] = await Promise.all([
                supabase.from('website_projects').select('id', { count: 'exact', head: true }),
                supabase.from('website_posts').select('id', { count: 'exact', head: true }),
                supabase.from('website_pricing').select('id', { count: 'exact', head: true }),
                supabase.from('website_testimonials').select('id', { count: 'exact', head: true }),
                supabase.from('website_lookbooks').select('id', { count: 'exact', head: true }),
                supabase.from('website_moodbooks').select('id', { count: 'exact', head: true }),
            ])
            setCounts({
                projects: projects.count ?? 0,
                posts: posts.count ?? 0,
                pricing: pricing.count ?? 0,
                testimonials: testimonials.count ?? 0,
                lookbooks: lookbooks.count ?? 0,
                moodbooks: moodbooks.count ?? 0,
            })
            setLoading(false)
        }
        fetchCounts()
    }, [])

    const sections = [
        { label: 'Portfolio', description: 'Manage your project showcase', icon: ImageIcon, href: '/studio/website/portfolio', count: counts.projects, color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Journal', description: 'Write and publish blog posts', icon: BookOpen, href: '/studio/website/journal', count: counts.posts, color: 'bg-blue-50 text-blue-600' },
        { label: 'Pricing', description: 'Edit service packages', icon: Tag, href: '/studio/website/pricing', count: counts.pricing, color: 'bg-amber-50 text-amber-600' },
        { label: 'Testimonials', description: 'Manage client quotes', icon: Star, href: '/studio/website/testimonials', count: counts.testimonials, color: 'bg-purple-50 text-purple-600' },
        { label: 'Lookbook', description: 'Subscribers receive it in their inbox', icon: BookMarked, href: '/studio/website/lookbook', count: counts.lookbooks, color: 'bg-pink-50 text-pink-600' },
        { label: 'Moodbook', description: 'Sent with booking confirmation emails', icon: Palette, href: '/studio/website/moodbook', count: counts.moodbooks, color: 'bg-violet-50 text-violet-600' },
        { label: 'Site Settings', description: 'Contact info, social links', icon: Settings, href: '/studio/website/settings', count: null, color: 'bg-gray-100 text-gray-600' },
    ]

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                        <Globe className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-text-primary">Website</h1>
                </div>
                <p className="text-text-secondary font-body text-lg">Manage content on axisliving.com</p>
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
                </div>
            ) : (
                <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {sections.map(section => {
                        const Icon = section.icon
                        return (
                            <motion.div key={section.href} variants={item}>
                                <Link
                                    href={section.href}
                                    className="card-flat group flex flex-col h-full hover:shadow-elevated transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${section.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        {section.count !== null && (
                                            <span className="text-2xl font-heading font-semibold text-text-primary">{section.count}</span>
                                        )}
                                    </div>
                                    <h3 className="font-heading font-semibold text-text-primary group-hover:text-primary transition-colors mb-1">
                                        {section.label}
                                    </h3>
                                    <p className="text-sm text-text-secondary flex-1">{section.description}</p>
                                    <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-text-secondary group-hover:text-primary transition-colors">
                                        Manage <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </motion.div>
            )}
        </motion.div>
    )
}
