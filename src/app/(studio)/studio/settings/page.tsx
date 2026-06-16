'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStudio } from '@/contexts/StudioContext'
import { studioSupabase as supabase } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import {
    User, Mail, LogOut, Loader2, Palette, Bell,
    Check, Sun, Moon, Monitor, CreditCard,
} from '@/lib/icons'
import toast from 'react-hot-toast'
import EmailTemplatesTab from '@/components/studio/EmailTemplatesTab'
import { getInitials } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────
type SettingsTab = 'email_templates' | 'account' | 'notifications' | 'appearance' | 'payments'

interface ProfileForm    { name: string }
interface PasswordForm   { newPassword: string; confirmPassword: string }

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
    theme: 'light' | 'dark' | 'system'
}

export interface PaymentPrefs {
    bankName: string
    bankAccountName: string
    bankAccountNumber: string
    bankBranch: string
    momoProvider: string
    momoNumber: string
    momoName: string
    defaultTerms: string
}

// ─── Tab config ──────────────────────────────────────────
const tabs: { id: SettingsTab; label: string; icon: typeof User }[] = [
    { id: 'email_templates', label: 'Email Templates', icon: Mail },
    { id: 'account',         label: 'Account',         icon: User },
    { id: 'notifications',   label: 'Notifications',   icon: Bell },
    { id: 'appearance',      label: 'Appearance',      icon: Palette },
    { id: 'payments',        label: 'Payments',        icon: CreditCard },
]

const fadeIn = {
    initial:    { opacity: 0, y: 8 },
    animate:    { opacity: 1, y: 0 },
    exit:       { opacity: 0, y: -8 },
    transition: { duration: 0.2 },
}

// ─── Page ─────────────────────────────────────────────────
export default function StudioSettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('email_templates')

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-6">
                <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-text-primary mb-2">Settings</h1>
                <p className="text-text-secondary font-body text-lg">Manage your studio profile, notifications &amp; preferences</p>
            </div>

            {/* Tab bar — pill style, consistent with rest of studio */}
            <div className="flex gap-1 bg-surface border border-border rounded-xl p-1 w-fit mb-8 flex-wrap">
                {tabs.map(tab => {
                    const Icon = tab.icon
                    const active = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                active
                                    ? 'bg-accent/20 text-primary border border-accent/30'
                                    : 'text-text-secondary hover:text-text-primary'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'account'         && <AccountTab key="account" />}
                {activeTab === 'notifications'   && <NotificationsTab key="notifications" />}
                {activeTab === 'appearance'      && <AppearanceTab key="appearance" />}
                {activeTab === 'payments'        && <PaymentsTab key="payments" />}
                {activeTab === 'email_templates' && (
                    <motion.div key="email_templates" {...fadeIn}>
                        <EmailTemplatesTab />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// ─── Account Tab ─────────────────────────────────────────
function AccountTab() {
    const { studioUser, signOut } = useStudio()
    const [updatingProfile,  setUpdatingProfile]  = useState(false)
    const [updatingPassword, setUpdatingPassword] = useState(false)

    const {
        register: regProfile,
        handleSubmit: submitProfile,
        formState: { errors: profileErrors },
    } = useForm<ProfileForm>({ defaultValues: { name: studioUser?.name || '' } })

    const {
        register: regPassword,
        handleSubmit: submitPassword,
        formState: { errors: passwordErrors },
        reset: resetPassword,
        watch,
    } = useForm<PasswordForm>()

    const newPassword = watch('newPassword')

    const onProfileSubmit = async (data: ProfileForm) => {
        if (!studioUser) return
        setUpdatingProfile(true)
        try {
            const { error } = await supabase.from('studio_users').update({ name: data.name }).eq('id', studioUser.id)
            if (error) throw error
            toast.success('Profile updated')
        } catch (e: any) {
            toast.error(e.message || 'Failed to update profile')
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
        } catch (e: any) {
            toast.error(e.message || 'Failed to update password')
        } finally {
            setUpdatingPassword(false)
        }
    }

    return (
        <motion.div {...fadeIn} className="space-y-6 max-w-2xl">
            {/* User identity header */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-lg font-bold font-heading flex-shrink-0 select-none">
                    {studioUser ? getInitials(studioUser.name) : 'S'}
                </div>
                <div>
                    <p className="text-base font-semibold text-text-primary font-heading leading-tight">{studioUser?.name || 'Studio User'}</p>
                    <p className="text-sm text-text-secondary">{studioUser?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-accent/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                        {studioUser?.role === 'admin' ? 'Admin' : 'Designer'}
                    </span>
                </div>
            </div>

            {/* Settings card */}
            <div className="card-flat divide-y divide-border">

                {/* ── Profile ── */}
                <SettingSection label="Profile">
                    <form onSubmit={submitProfile(onProfileSubmit)} className="space-y-0 divide-y divide-border">
                        <SettingRow label="Full Name">
                            <input
                                type="text"
                                className={`input-field flex-1 ${profileErrors.name ? 'border-error' : ''}`}
                                {...regProfile('name', { required: 'Name is required' })}
                            />
                            <button type="submit" disabled={updatingProfile} className="btn-primary flex-shrink-0 min-w-[72px]">
                                {updatingProfile ? <Loader2 className="w-4 h-4 animate-spin text-white mx-auto" /> : 'Save'}
                            </button>
                        </SettingRow>
                        {profileErrors.name && <p className="text-error text-xs py-2 pl-[calc(9rem+16px)]">{profileErrors.name.message}</p>}

                        <SettingRow label="Email" sub="Managed via admin dashboard">
                            <input
                                type="email"
                                value={studioUser?.email || ''}
                                disabled
                                className="input-field flex-1 opacity-50 cursor-not-allowed"
                            />
                        </SettingRow>
                    </form>
                </SettingSection>

                {/* ── Security ── */}
                <SettingSection label="Security">
                    <form onSubmit={submitPassword(onPasswordSubmit)} className="space-y-0 divide-y divide-border">
                        <SettingRow label="New Password">
                            <input
                                type="password"
                                placeholder="Min 8 characters"
                                className={`input-field flex-1 ${passwordErrors.newPassword ? 'border-error' : ''}`}
                                {...regPassword('newPassword', {
                                    required: 'New password is required',
                                    minLength: { value: 8, message: 'At least 8 characters' },
                                })}
                            />
                        </SettingRow>
                        {passwordErrors.newPassword && <p className="text-error text-xs py-2 pl-[calc(9rem+16px)]">{passwordErrors.newPassword.message}</p>}

                        <SettingRow label="Confirm">
                            <input
                                type="password"
                                placeholder="Repeat new password"
                                className={`input-field flex-1 ${passwordErrors.confirmPassword ? 'border-error' : ''}`}
                                {...regPassword('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: v => v === newPassword || 'Passwords do not match',
                                })}
                            />
                            <button type="submit" disabled={updatingPassword} className="btn-secondary flex-shrink-0 min-w-[96px]">
                                {updatingPassword ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Update'}
                            </button>
                        </SettingRow>
                        {passwordErrors.confirmPassword && <p className="text-error text-xs py-2 pl-[calc(9rem+16px)]">{passwordErrors.confirmPassword.message}</p>}
                    </form>
                </SettingSection>

                {/* ── Danger zone ── */}
                <div className="flex items-center justify-between gap-4 pt-5 pb-1">
                    <div>
                        <p className="text-sm font-medium text-error">Sign Out</p>
                        <p className="text-xs text-text-secondary mt-0.5">End your session on all devices</p>
                    </div>
                    <button
                        onClick={signOut}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-error border border-error/25 rounded-xl hover:bg-error/5 transition-colors flex-shrink-0"
                    >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

// ─── Notifications Tab ───────────────────────────────────
const notificationItems: { key: keyof NotificationPrefs; label: string; description: string; group: string }[] = [
    { key: 'emailNewMessage',     label: 'New client message',      description: 'When a client sends a message',             group: 'Activity' },
    { key: 'emailNewClient',      label: 'New client registration', description: 'When a new client signs up to the portal',  group: 'Activity' },
    { key: 'emailProjectUpdate',  label: 'Project status changes',  description: 'When project milestones are updated',       group: 'Activity' },
    { key: 'emailInvoicePaid',    label: 'Invoice paid',            description: 'When a client pays an invoice',             group: 'Finance' },
    { key: 'emailOverdueInvoice', label: 'Overdue invoice alerts',  description: 'Invoices that are past their due date',     group: 'Finance' },
    { key: 'emailWeeklyDigest',   label: 'Weekly digest',           description: 'Summary of activity every Monday morning',  group: 'Summaries' },
]

const NOTIF_KEY = 'studio_notif_prefs'

const DEFAULT_NOTIF_PREFS: NotificationPrefs = {
    emailNewMessage:    true,
    emailInvoicePaid:   true,
    emailProjectUpdate: true,
    emailNewClient:     true,
    emailWeeklyDigest:  false,
    emailOverdueInvoice: true,
}

function NotificationsTab() {
    const { studioUser } = useStudio()
    const [saving, setSaving]  = useState(false)
    const [prefs, setPrefs]    = useState<NotificationPrefs>(DEFAULT_NOTIF_PREFS)

    useEffect(() => {
        try {
            const saved = localStorage.getItem(NOTIF_KEY)
            if (saved) setPrefs(JSON.parse(saved))
        } catch { }
    }, [])

    const toggle = (key: keyof NotificationPrefs) => setPrefs(p => ({ ...p, [key]: !p[key] }))

    const savePrefs = async () => {
        setSaving(true)
        try {
            localStorage.setItem(NOTIF_KEY, JSON.stringify(prefs))
            await new Promise(r => setTimeout(r, 300))
            toast.success('Notification preferences saved')
        } catch {
            toast.error('Failed to save preferences')
        } finally {
            setSaving(false)
        }
    }

    const groups = Array.from(new Set(notificationItems.map(i => i.group)))

    return (
        <motion.div {...fadeIn} className="space-y-6 max-w-2xl">
            <p className="text-sm text-text-secondary">
                Alerts sent to <span className="font-medium text-text-primary">{studioUser?.email}</span>
            </p>

            <div className="card-flat divide-y divide-border">
                {groups.map(group => (
                    <SettingSection key={group} label={group}>
                        <div className="divide-y divide-border">
                            {notificationItems.filter(i => i.group === group).map(item => (
                                <div key={item.key} className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">{item.label}</p>
                                        <p className="text-xs text-text-secondary mt-0.5">{item.description}</p>
                                    </div>
                                    <ToggleSwitch enabled={prefs[item.key]} onToggle={() => toggle(item.key)} />
                                </div>
                            ))}
                        </div>
                    </SettingSection>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <button onClick={savePrefs} disabled={saving} className="btn-primary min-w-[140px]">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Save Preferences'}
                </button>
                <button onClick={() => { setPrefs(DEFAULT_NOTIF_PREFS); toast.success('Reset to defaults') }} className="btn-ghost text-sm">
                    Reset to Defaults
                </button>
            </div>
        </motion.div>
    )
}

// ─── Appearance Tab ───────────────────────────────────────
const currencies = [
    { code: 'ZMW', symbol: 'K',  label: 'Zambian Kwacha' },
    { code: 'USD', symbol: '$',  label: 'US Dollar' },
    { code: 'EUR', symbol: '€',  label: 'Euro' },
    { code: 'GBP', symbol: '£',  label: 'British Pound' },
    { code: 'GHS', symbol: '₵',  label: 'Ghanaian Cedi' },
]

const themeOptions: { value: AppearancePrefs['theme']; label: string; icon: typeof Sun }[] = [
    { value: 'light',  label: 'Light',  icon: Sun },
    { value: 'dark',   label: 'Dark',   icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
]

const APPEARANCE_KEY = 'studio_appearance_prefs'

function applyTheme(theme: AppearancePrefs['theme']) {
    const root = document.documentElement
    if (theme === 'dark')   root.classList.add('dark')
    else if (theme === 'light') root.classList.remove('dark')
    else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) root.classList.add('dark')
        else root.classList.remove('dark')
    }
}

function AppearanceTab() {
    const [saving, setSaving] = useState(false)
    const [prefs, setPrefs]   = useState<AppearancePrefs>({
        companyName: 'Axis Living',
        currency:    'ZMW',
        theme:       'light',
    })

    useEffect(() => {
        try {
            const saved = localStorage.getItem(APPEARANCE_KEY)
            if (saved) { const p = JSON.parse(saved); setPrefs(p); applyTheme(p.theme) }
        } catch { }
    }, [])

    const setTheme = (theme: AppearancePrefs['theme']) => { setPrefs(p => ({ ...p, theme })); applyTheme(theme) }

    const savePrefs = async () => {
        setSaving(true)
        try {
            localStorage.setItem(APPEARANCE_KEY, JSON.stringify(prefs))
            await new Promise(r => setTimeout(r, 300))
            toast.success('Appearance preferences saved')
        } catch {
            toast.error('Failed to save preferences')
        } finally {
            setSaving(false)
        }
    }

    return (
        <motion.div {...fadeIn} className="space-y-6 max-w-2xl">
            <div className="card-flat divide-y divide-border">

                <SettingSection label="Branding">
                    <SettingRow label="Studio Name" sub="Shown in emails & invoices">
                        <input
                            type="text"
                            value={prefs.companyName}
                            onChange={e => setPrefs(p => ({ ...p, companyName: e.target.value }))}
                            className="input-field flex-1"
                            placeholder="Your studio name"
                        />
                    </SettingRow>
                </SettingSection>

                <SettingSection label="Theme">
                    <SettingRow label="Colour Mode" sub="Interface appearance">
                        <div className="flex gap-2 flex-wrap">
                            {themeOptions.map(opt => {
                                const Icon = opt.icon
                                const active = prefs.theme === opt.value
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => setTheme(opt.value)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                                            active
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-text-primary'
                                        }`}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {opt.label}
                                        {active && <Check className="w-3 h-3 ml-0.5" />}
                                    </button>
                                )
                            })}
                        </div>
                    </SettingRow>
                </SettingSection>

                <SettingSection label="Regional">
                    <div className="divide-y divide-border">
                        <SettingRow label="Currency" sub="Default for invoices">
                            <div className="flex flex-wrap gap-2">
                                {currencies.map(c => {
                                    const active = prefs.currency === c.code
                                    return (
                                        <button
                                            key={c.code}
                                            onClick={() => setPrefs(p => ({ ...p, currency: c.code }))}
                                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all ${
                                                active
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-text-primary'
                                            }`}
                                        >
                                            <span className="font-bold">{c.symbol}</span>
                                            {c.code}
                                            {active && <Check className="w-3 h-3 ml-0.5" />}
                                        </button>
                                    )
                                })}
                            </div>
                        </SettingRow>

                    </div>
                </SettingSection>
            </div>

            <button onClick={savePrefs} disabled={saving} className="btn-primary min-w-[140px]">
                {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Save Preferences'}
            </button>
        </motion.div>
    )
}

// ─── Payments Tab ────────────────────────────────────────
export const PAYMENT_PREFS_KEY = 'studio_payment_prefs'

export const DEFAULT_PAYMENT_PREFS: PaymentPrefs = {
    bankName:          '',
    bankAccountName:   '',
    bankAccountNumber: '',
    bankBranch:        '',
    momoProvider:      '',
    momoNumber:        '',
    momoName:          '',
    defaultTerms:      '',
}

function PaymentsTab() {
    const [saving, setSaving] = useState(false)
    const [prefs, setPrefs]   = useState<PaymentPrefs>(DEFAULT_PAYMENT_PREFS)

    useEffect(() => {
        try {
            const saved = localStorage.getItem(PAYMENT_PREFS_KEY)
            if (saved) setPrefs({ ...DEFAULT_PAYMENT_PREFS, ...JSON.parse(saved) })
        } catch { }
    }, [])

    const set = (key: keyof PaymentPrefs, value: string) =>
        setPrefs(p => ({ ...p, [key]: value }))

    const savePrefs = async () => {
        setSaving(true)
        try {
            localStorage.setItem(PAYMENT_PREFS_KEY, JSON.stringify(prefs))
            await new Promise(r => setTimeout(r, 300))
            toast.success('Payment details saved')
        } catch {
            toast.error('Failed to save payment details')
        } finally {
            setSaving(false)
        }
    }

    return (
        <motion.div {...fadeIn} className="space-y-6 max-w-2xl">
            <p className="text-sm text-text-secondary">
                These details are auto-filled on every new invoice. You can still edit them per invoice if needed.
            </p>

            <div className="card-flat divide-y divide-border">
                <SettingSection label="Bank Transfer">
                    <div className="divide-y divide-border">
                        <SettingRow label="Bank Name">
                            <input
                                type="text"
                                value={prefs.bankName}
                                onChange={e => set('bankName', e.target.value)}
                                className="input-field flex-1"
                                placeholder="e.g. Zanaco"
                            />
                        </SettingRow>
                        <SettingRow label="Account Name">
                            <input
                                type="text"
                                value={prefs.bankAccountName}
                                onChange={e => set('bankAccountName', e.target.value)}
                                className="input-field flex-1"
                                placeholder="e.g. Axis Living Studio Ltd"
                            />
                        </SettingRow>
                        <SettingRow label="Account Number">
                            <input
                                type="text"
                                value={prefs.bankAccountNumber}
                                onChange={e => set('bankAccountNumber', e.target.value)}
                                className="input-field flex-1 font-mono tracking-wide"
                                placeholder="e.g. 0123456789"
                            />
                        </SettingRow>
                        <SettingRow label="Branch" sub="Optional">
                            <input
                                type="text"
                                value={prefs.bankBranch}
                                onChange={e => set('bankBranch', e.target.value)}
                                className="input-field flex-1"
                                placeholder="e.g. Cairo Road"
                            />
                        </SettingRow>
                    </div>
                </SettingSection>

                <SettingSection label="Mobile Money">
                    <div className="divide-y divide-border">
                        <SettingRow label="Provider">
                            <div className="flex gap-2 flex-wrap flex-1">
                                {['MTN Money', 'Airtel Money', 'Zamtel'].map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => set('momoProvider', prefs.momoProvider === p ? '' : p)}
                                        className={`px-3.5 py-2 rounded-xl border text-sm font-medium transition-all ${
                                            prefs.momoProvider === p
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-text-primary'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <input
                                    type="text"
                                    value={['MTN Money', 'Airtel Money', 'Zamtel'].includes(prefs.momoProvider) ? '' : prefs.momoProvider}
                                    onChange={e => set('momoProvider', e.target.value)}
                                    className="input-field flex-1 min-w-[120px]"
                                    placeholder="Other provider"
                                />
                            </div>
                        </SettingRow>
                        <SettingRow label="Number">
                            <input
                                type="tel"
                                value={prefs.momoNumber}
                                onChange={e => set('momoNumber', e.target.value)}
                                className="input-field flex-1 font-mono tracking-wide"
                                placeholder="e.g. 0977 123 456"
                            />
                        </SettingRow>
                        <SettingRow label="Account Name" sub="Name on mobile wallet">
                            <input
                                type="text"
                                value={prefs.momoName}
                                onChange={e => set('momoName', e.target.value)}
                                className="input-field flex-1"
                                placeholder="e.g. Axis Living"
                            />
                        </SettingRow>
                    </div>
                </SettingSection>

                <SettingSection label="Additional Terms">
                    <div className="space-y-1">
                        <textarea
                            value={prefs.defaultTerms}
                            onChange={e => set('defaultTerms', e.target.value)}
                            rows={3}
                            className="input-field w-full resize-none text-sm"
                            placeholder="e.g. Payment due within 14 days. Late payments attract a 5% monthly fee."
                        />
                        <p className="text-xs text-text-secondary">Appended to the payment notes on every invoice.</p>
                    </div>
                </SettingSection>
            </div>

            <button onClick={savePrefs} disabled={saving} className="btn-primary min-w-[140px]">
                {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Save Payment Details'}
            </button>
        </motion.div>
    )
}

// ─── Shared layout primitives ────────────────────────────
function SettingSection({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="py-5 first:pt-0 last:pb-0 space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">{label}</p>
            {children}
        </div>
    )
}

function SettingRow({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
            <div className="w-36 flex-shrink-0">
                <p className="text-sm font-medium text-text-primary">{label}</p>
                {sub && <p className="text-xs text-text-secondary mt-0.5">{sub}</p>}
            </div>
            <div className="flex-1 flex items-center gap-3 min-w-0">
                {children}
            </div>
        </div>
    )
}

// ─── Toggle Switch ───────────────────────────────────────
function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${
                enabled ? 'bg-primary' : 'bg-border'
            }`}
        >
            <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transform ring-0 transition-transform duration-200 mt-0.5 ${
                enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
            }`} />
        </button>
    )
}
