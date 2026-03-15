'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStudio } from '@/contexts/StudioContext'
import { studioSupabase as supabase } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import {
    User, Mail, Shield, Lock, LogOut, Loader2, Palette, Bell,
    Globe, DollarSign, Calendar, Building2, Check, Sun, Moon, Monitor,
    MessageSquare, Receipt, FolderKanban, Users, AlertTriangle, ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'

// ────────────────── types ──────────────────
type SettingsTab = 'account' | 'notifications' | 'appearance'

interface ProfileForm {
    name: string
}

interface PasswordForm {
    newPassword: string
    confirmPassword: string
}

interface NotificationPrefs {
    emailNewMessage: boolean
    emailInvoicePaid: boolean
    emailProjectUpdate: boolean
    emailNewClient: boolean
    emailWeeklyDigest: boolean
    emailOverdueInvoice: boolean
}

interface AppearancePrefs {
    companyName: string
    currency: string
    dateFormat: string
    theme: 'light' | 'dark' | 'system'
}

// ────────────────── tab config ──────────────────
const tabs: { id: SettingsTab; label: string; icon: typeof User; description: string }[] = [
    { id: 'account', label: 'Account', icon: User, description: 'Profile & security' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email preferences' },
    { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Branding & display' },
]

// ────────────────── fade variant ──────────────────
const fadeIn = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.25 },
}

// ═════════════════════════════════════════════════════
// Main page
// ═════════════════════════════════════════════════════
export default function StudioSettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('account')

    return (
        <div className="max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-text-primary mb-2">
                        Studio Settings
                    </h1>
                    <p className="text-text-secondary font-body text-lg">
                        Manage your team profile, notifications &amp; portal preferences
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ───── Sidebar Tabs ───── */}
                    <div className="lg:col-span-1 space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            const active = activeTab === tab.id
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group ${
                                        active
                                            ? 'bg-primary/8 text-primary shadow-sm'
                                            : 'text-text-secondary hover:bg-accent/5 hover:text-text-primary'
                                    }`}
                                >
                                    <Icon className={`w-[18px] h-[18px] transition-colors ${active ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary'}`} />
                                    <div className="flex-1 text-left">
                                        <span className="block">{tab.label}</span>
                                        <span className={`block text-[10px] mt-0.5 font-normal ${active ? 'text-primary/60' : 'text-text-secondary/60'}`}>
                                            {tab.description}
                                        </span>
                                    </div>
                                    <ChevronRight className={`w-3.5 h-3.5 transition-all ${active ? 'opacity-100 text-primary' : 'opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0'}`} />
                                </button>
                            )
                        })}
                    </div>

                    {/* ───── Tab Content ───── */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {activeTab === 'account' && <AccountTab key="account" />}
                            {activeTab === 'notifications' && <NotificationsTab key="notifications" />}
                            {activeTab === 'appearance' && <AppearanceTab key="appearance" />}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

// ═════════════════════════════════════════════════════
// Account Tab
// ═════════════════════════════════════════════════════
function AccountTab() {
    const { studioUser, signOut } = useStudio()
    const [updatingProfile, setUpdatingProfile] = useState(false)
    const [updatingPassword, setUpdatingPassword] = useState(false)

    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors },
    } = useForm<ProfileForm>({
        defaultValues: { name: studioUser?.name || '' },
    })

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
        reset: resetPassword,
        watch,
    } = useForm<PasswordForm>()

    const newPassword = watch('newPassword')

    const onProfileSubmit = async (data: ProfileForm) => {
        if (!studioUser) return
        setUpdatingProfile(true)
        try {
            const { error } = await supabase
                .from('studio_users')
                .update({ name: data.name })
                .eq('id', studioUser.id)
            if (error) throw error
            toast.success('Studio profile updated')
        } catch (error: any) {
            toast.error(error.message || 'Failed to update studio profile')
        } finally {
            setUpdatingProfile(false)
        }
    }

    const onPasswordSubmit = async (data: PasswordForm) => {
        setUpdatingPassword(true)
        try {
            const { error } = await supabase.auth.updateUser({ password: data.newPassword })
            if (error) throw error
            toast.success('Password updated')
            resetPassword()
        } catch (error: any) {
            toast.error(error.message || 'Failed to update password')
        } finally {
            setUpdatingPassword(false)
        }
    }

    return (
        <motion.div {...fadeIn} className="space-y-8">
            {/* Profile */}
            <section className="card-flat">
                <h2 className="text-lg font-heading font-semibold text-text-primary mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" /> Profile Details
                </h2>

                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-primary ml-1">Full Name</label>
                        <input
                            type="text"
                            className={`input-field ${profileErrors.name ? 'border-error' : ''}`}
                            {...registerProfile('name', { required: 'Name is required' })}
                        />
                        {profileErrors.name && <p className="text-error text-xs mt-1">{profileErrors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-primary ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                            <input
                                type="email"
                                value={studioUser?.email || ''}
                                disabled
                                className="input-field pl-11 bg-accent/5 cursor-not-allowed opacity-70"
                            />
                        </div>
                        <p className="text-[10px] text-text-secondary ml-1 italic">
                            Email management is handled via the admin dashboard.
                        </p>
                    </div>

                    <div className="pt-2">
                        <button type="submit" disabled={updatingProfile} className="btn-primary min-w-[140px]">
                            {updatingProfile ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </section>

            {/* Security */}
            <section className="card-flat">
                <h2 className="text-lg font-heading font-semibold text-text-primary mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" /> Security
                </h2>

                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-primary ml-1">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                            <input
                                type="password"
                                placeholder="Min 8 characters"
                                className={`input-field pl-11 ${passwordErrors.newPassword ? 'border-error' : ''}`}
                                {...registerPassword('newPassword', {
                                    required: 'New password is required',
                                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                                })}
                            />
                        </div>
                        {passwordErrors.newPassword && <p className="text-error text-xs mt-1">{passwordErrors.newPassword.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-primary ml-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                            <input
                                type="password"
                                placeholder="Repeat new password"
                                className={`input-field pl-11 ${passwordErrors.confirmPassword ? 'border-error' : ''}`}
                                {...registerPassword('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: (v) => v === newPassword || 'Passwords do not match',
                                })}
                            />
                        </div>
                        {passwordErrors.confirmPassword && <p className="text-error text-xs mt-1">{passwordErrors.confirmPassword.message}</p>}
                    </div>

                    <div className="pt-2">
                        <button type="submit" disabled={updatingPassword} className="btn-secondary min-w-[140px]">
                            {updatingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                        </button>
                    </div>
                </form>
            </section>

            {/* Session */}
            <section className="card-flat border-red-100 bg-red-50/10">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary">Session Management</h3>
                        <p className="text-xs text-text-secondary mt-1">End your current session across all devices</p>
                    </div>
                    <button
                        onClick={signOut}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-error border border-red-200 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors shadow-sm"
                    >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                </div>
            </section>
        </motion.div>
    )
}

// ═════════════════════════════════════════════════════
// Notifications Tab
// ═════════════════════════════════════════════════════
const notificationGroups = [
    {
        title: 'Messages',
        icon: MessageSquare,
        color: 'blue',
        items: [
            {
                key: 'emailNewMessage' as const,
                label: 'New client message',
                description: 'Get notified when a client sends you a message',
            },
        ],
    },
    {
        title: 'Invoices',
        icon: Receipt,
        color: 'emerald',
        items: [
            {
                key: 'emailInvoicePaid' as const,
                label: 'Invoice paid',
                description: 'Receive confirmation when a client pays an invoice',
            },
            {
                key: 'emailOverdueInvoice' as const,
                label: 'Overdue invoice alerts',
                description: 'Get reminders about invoices that are past due',
            },
        ],
    },
    {
        title: 'Projects',
        icon: FolderKanban,
        color: 'amber',
        items: [
            {
                key: 'emailProjectUpdate' as const,
                label: 'Project status changes',
                description: 'Get notified when project milestones are updated',
            },
        ],
    },
    {
        title: 'Clients',
        icon: Users,
        color: 'violet',
        items: [
            {
                key: 'emailNewClient' as const,
                label: 'New client registration',
                description: 'Get notified when a new client signs up',
            },
        ],
    },
    {
        title: 'Summaries',
        icon: Calendar,
        color: 'rose',
        items: [
            {
                key: 'emailWeeklyDigest' as const,
                label: 'Weekly digest',
                description: 'Receive a summary of activity every Monday morning',
            },
        ],
    },
]

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-100' },
    violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-100' },
    rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-100' },
}

function NotificationsTab() {
    const { studioUser } = useStudio()
    const [saving, setSaving] = useState(false)
    const [prefs, setPrefs] = useState<NotificationPrefs>({
        emailNewMessage: true,
        emailInvoicePaid: true,
        emailProjectUpdate: true,
        emailNewClient: true,
        emailWeeklyDigest: false,
        emailOverdueInvoice: true,
    })

    // Load saved prefs from localStorage on mount
    useEffect(() => {
        const key = `studio_notif_prefs_${studioUser?.id || 'default'}`
        const saved = localStorage.getItem(key)
        if (saved) {
            try {
                setPrefs(JSON.parse(saved))
            } catch { /* ignore */ }
        }
    }, [studioUser?.id])

    const toggle = (key: keyof NotificationPrefs) => {
        setPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    const savePrefs = async () => {
        setSaving(true)
        try {
            const key = `studio_notif_prefs_${studioUser?.id || 'default'}`
            localStorage.setItem(key, JSON.stringify(prefs))
            // Simulate a quick delay so the user sees the save action
            await new Promise((r) => setTimeout(r, 400))
            toast.success('Notification preferences saved')
        } catch {
            toast.error('Failed to save preferences')
        } finally {
            setSaving(false)
        }
    }

    return (
        <motion.div {...fadeIn} className="space-y-6">
            {/* Info banner */}
            <div className="flex items-start gap-3 bg-blue-50/60 border border-blue-100 rounded-2xl p-4">
                <Bell className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="text-sm font-semibold text-text-primary">Email Notifications</p>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                        Choose which events trigger email alerts. These are sent to <strong className="text-text-primary font-medium">{studioUser?.email}</strong>.
                    </p>
                </div>
            </div>

            {/* Notification groups */}
            {notificationGroups.map((group) => {
                const Icon = group.icon
                const colors = colorMap[group.color] || colorMap.blue
                return (
                    <section key={group.title} className="card-flat">
                        <div className="flex items-center gap-3 mb-5">
                            <div className={`w-9 h-9 ${colors.bg} rounded-xl flex items-center justify-center`}>
                                <Icon className={`w-4 h-4 ${colors.text}`} />
                            </div>
                            <h3 className="text-sm font-heading font-semibold text-text-primary">{group.title}</h3>
                        </div>
                        <div className="space-y-4">
                            {group.items.map((item) => (
                                <div key={item.key} className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">{item.label}</p>
                                        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{item.description}</p>
                                    </div>
                                    <ToggleSwitch
                                        enabled={prefs[item.key]}
                                        onToggle={() => toggle(item.key)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )
            })}

            {/* Save / Reset buttons */}
            <div className="flex items-center gap-3 pt-2">
                <button onClick={savePrefs} disabled={saving} className="btn-primary min-w-[160px]">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Save Preferences'}
                </button>
                <button
                    onClick={() => {
                        setPrefs({
                            emailNewMessage: true,
                            emailInvoicePaid: true,
                            emailProjectUpdate: true,
                            emailNewClient: true,
                            emailWeeklyDigest: false,
                            emailOverdueInvoice: true,
                        })
                        toast.success('Reset to defaults')
                    }}
                    className="btn-ghost text-sm"
                >
                    Reset to Defaults
                </button>
            </div>
        </motion.div>
    )
}

// ═════════════════════════════════════════════════════
// Appearance Tab
// ═════════════════════════════════════════════════════
const currencies = [
    { code: 'GHS', symbol: '₵', label: 'Ghanaian Cedi' },
    { code: 'USD', symbol: '$', label: 'US Dollar' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
    { code: 'GBP', symbol: '£', label: 'British Pound' },
]

const dateFormats = [
    { value: 'DD/MM/YYYY', example: '15/03/2026' },
    { value: 'MM/DD/YYYY', example: '03/15/2026' },
    { value: 'YYYY-MM-DD', example: '2026-03-15' },
    { value: 'MMM DD, YYYY', example: 'Mar 15, 2026' },
]

const themeOptions: { value: AppearancePrefs['theme']; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
]

function AppearanceTab() {
    const { studioUser } = useStudio()
    const [saving, setSaving] = useState(false)
    const [prefs, setPrefs] = useState<AppearancePrefs>({
        companyName: 'Axis Living',
        currency: 'GHS',
        dateFormat: 'DD/MM/YYYY',
        theme: 'light',
    })

    // Load saved prefs on mount
    useEffect(() => {
        const key = `studio_appearance_prefs_${studioUser?.id || 'default'}`
        const saved = localStorage.getItem(key)
        if (saved) {
            try {
                setPrefs(JSON.parse(saved))
            } catch { /* ignore */ }
        }
    }, [studioUser?.id])

    const savePrefs = async () => {
        setSaving(true)
        try {
            const key = `studio_appearance_prefs_${studioUser?.id || 'default'}`
            localStorage.setItem(key, JSON.stringify(prefs))
            await new Promise((r) => setTimeout(r, 400))
            toast.success('Appearance preferences saved')
        } catch {
            toast.error('Failed to save preferences')
        } finally {
            setSaving(false)
        }
    }

    return (
        <motion.div {...fadeIn} className="space-y-8">
            {/* Company / Branding */}
            <section className="card-flat">
                <h2 className="text-lg font-heading font-semibold text-text-primary mb-6 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" /> Branding
                </h2>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-primary ml-1">Studio Name</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                            <input
                                type="text"
                                value={prefs.companyName}
                                onChange={(e) => setPrefs((p) => ({ ...p, companyName: e.target.value }))}
                                className="input-field pl-11"
                                placeholder="Your studio name"
                            />
                        </div>
                        <p className="text-[10px] text-text-secondary ml-1 italic">
                            Displayed in the sidebar, emails, and invoices.
                        </p>
                    </div>
                </div>
            </section>

            {/* Theme */}
            <section className="card-flat">
                <h2 className="text-lg font-heading font-semibold text-text-primary mb-6 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary" /> Theme
                </h2>

                <div className="grid grid-cols-3 gap-3">
                    {themeOptions.map((opt) => {
                        const Icon = opt.icon
                        const active = prefs.theme === opt.value
                        return (
                            <button
                                key={opt.value}
                                onClick={() => setPrefs((p) => ({ ...p, theme: opt.value }))}
                                className={`relative flex flex-col items-center gap-2.5 px-4 py-5 rounded-2xl border-2 transition-all ${
                                    active
                                        ? 'border-primary bg-primary/5 shadow-sm'
                                        : 'border-border bg-white hover:border-primary/30'
                                }`}
                            >
                                {active && (
                                    <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-primary/10' : 'bg-accent/10'}`}>
                                    <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-text-secondary'}`} />
                                </div>
                                <span className={`text-sm font-semibold ${active ? 'text-primary' : 'text-text-primary'}`}>
                                    {opt.label}
                                </span>
                            </button>
                        )
                    })}
                </div>
                <p className="text-[10px] text-text-secondary mt-3 italic ml-1">
                    Theme support is coming soon. Currently only Light mode is active.
                </p>
            </section>

            {/* Regional */}
            <section className="card-flat">
                <h2 className="text-lg font-heading font-semibold text-text-primary mb-6 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" /> Regional
                </h2>

                <div className="space-y-5">
                    {/* Currency */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-primary ml-1">Default Currency</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {currencies.map((c) => {
                                const active = prefs.currency === c.code
                                return (
                                    <button
                                        key={c.code}
                                        onClick={() => setPrefs((p) => ({ ...p, currency: c.code }))}
                                        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                                            active
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-border bg-white text-text-secondary hover:border-primary/30'
                                        }`}
                                    >
                                        <span className="text-base font-semibold">{c.symbol}</span>
                                        <span>{c.code}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Date Format */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-primary ml-1">Date Format</label>
                        <div className="grid grid-cols-2 gap-2.5">
                            {dateFormats.map((df) => {
                                const active = prefs.dateFormat === df.value
                                return (
                                    <button
                                        key={df.value}
                                        onClick={() => setPrefs((p) => ({ ...p, dateFormat: df.value }))}
                                        className={`flex flex-col items-start px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                                            active
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border bg-white hover:border-primary/30'
                                        }`}
                                    >
                                        <span className={`font-medium ${active ? 'text-primary' : 'text-text-primary'}`}>
                                            {df.value}
                                        </span>
                                        <span className="text-[10px] text-text-secondary mt-0.5">{df.example}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Save */}
            <div className="flex items-center gap-3 pt-2">
                <button onClick={savePrefs} disabled={saving} className="btn-primary min-w-[160px]">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Save Preferences'}
                </button>
            </div>
        </motion.div>
    )
}

// ═════════════════════════════════════════════════════
// Toggle Switch
// ═════════════════════════════════════════════════════
function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                enabled ? 'bg-primary' : 'bg-gray-200'
            }`}
        >
            <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform ring-0 transition-transform duration-200 ease-in-out mt-0.5 ${
                    enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`}
            />
        </button>
    )
}
