'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { studioSupabase as supabase } from '@/lib/supabase'
import { Settings, Loader2, Check, ArrowLeft } from '@/lib/icons'
import Link from 'next/link'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

const SETTING_LABELS: Record<string, { label: string; placeholder: string; type?: string }> = {
    tagline:          { label: 'Tagline', placeholder: 'Your brand tagline' },
    contact_email:    { label: 'Contact Email', placeholder: 'hello@axisliving.com', type: 'email' },
    contact_phone:    { label: 'Contact Phone', placeholder: '+233 ...' },
    contact_address:  { label: 'Contact Address', placeholder: 'Accra, Ghana' },
    instagram_url:    { label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
    facebook_url:     { label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
    twitter_url:      { label: 'Twitter / X URL', placeholder: 'https://x.com/...' },
    pinterest_url:    { label: 'Pinterest URL', placeholder: 'https://pinterest.com/...' },
}

export default function SiteSettingsPage() {
    const [settings, setSettings] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => { fetchSettings() }, [])

    async function fetchSettings() {
        const { data } = await supabase.from('website_settings').select('key, value')
        const map: Record<string, string> = {}
        for (const row of data ?? []) {
            map[row.key] = row.value ?? ''
        }
        setSettings(map)
        setLoading(false)
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        setError('')
        setSaved(false)

        const updates = Object.entries(settings).map(([key, value]) => ({
            key,
            value: value || null,
            updated_at: new Date().toISOString(),
        }))

        const { error: err } = await supabase
            .from('website_settings')
            .upsert(updates, { onConflict: 'key' })

        if (err) {
            setError(err.message)
        } else {
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        }
        setSaving(false)
    }

    if (loading) return (
        <div className="space-y-6 max-w-lg">
            <div className="skeleton h-10 w-48" />
            <div className="space-y-4">{[1,2,3,4,5].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
        </div>
    )

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="mb-10">
                <Link
                    href="/studio/website"
                    className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Website
                </Link>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Settings className="w-5 h-5 text-gray-600" />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-text-primary">Site Settings</h1>
                </div>
                <p className="text-text-secondary font-body text-lg">Contact info, tagline, and social links</p>
            </motion.div>

            <form onSubmit={handleSave} className="max-w-lg">
                {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">{error}</div>}

                <motion.div variants={item} className="card-flat space-y-5 mb-6">
                    <h2 className="font-heading font-semibold text-text-primary">General</h2>
                    {(['tagline', 'contact_email', 'contact_phone', 'contact_address'] as const).map(key => {
                        const meta = SETTING_LABELS[key]
                        return (
                            <div key={key}>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">{meta.label}</label>
                                <input
                                    type={meta.type ?? 'text'}
                                    value={settings[key] ?? ''}
                                    onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                                    className="input-field"
                                    placeholder={meta.placeholder}
                                />
                            </div>
                        )
                    })}
                </motion.div>

                <motion.div variants={item} className="card-flat space-y-5 mb-6">
                    <h2 className="font-heading font-semibold text-text-primary">Social Links</h2>
                    {(['instagram_url', 'facebook_url', 'twitter_url', 'pinterest_url'] as const).map(key => {
                        const meta = SETTING_LABELS[key]
                        return (
                            <div key={key}>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">{meta.label}</label>
                                <input
                                    type="url"
                                    value={settings[key] ?? ''}
                                    onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                                    className="input-field"
                                    placeholder={meta.placeholder}
                                />
                            </div>
                        )
                    })}
                </motion.div>

                <motion.div variants={item}>
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                        ) : saved ? (
                            <><Check className="w-4 h-4" /> Saved!</>
                        ) : (
                            'Save Settings'
                        )}
                    </button>
                </motion.div>
            </form>
        </motion.div>
    )
}
