'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function StudioLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (authError) {
                setError(authError.message)
                toast.error(authError.message)
                setLoading(false)
                return
            }

            // Verify the user is a studio user
            const { data: studioUser, error: studioError } = await supabase
                .from('studio_users')
                .select('id')
                .eq('id', data.user.id)
                .maybeSingle()

            if (studioError || !studioUser) {
                await supabase.auth.signOut()
                setError('Access denied. This login is for studio team members only.')
                toast.error('Access denied')
                setLoading(false)
                return
            }

            toast.success('Welcome back!')
            setTimeout(() => {
                window.location.href = '/studio'
            }, 100)
        } catch (err) {
            console.error('Sign in error:', err)
            setError('An unexpected error occurred')
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-[#0f1117]">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-[45%] flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-[#0f1117] to-purple-600/10" />
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center px-12"
                >
                    <h1 className="text-white text-5xl font-heading tracking-tight mb-4">AXIS</h1>
                    <div className="h-px w-12 bg-white/20 mx-auto mb-6" />
                    <p className="text-white/50 text-lg font-body">
                        Studio Management Panel
                    </p>
                </motion.div>
            </div>

            {/* Right panel */}
            <div className="flex flex-1 flex-col items-center justify-center p-8 lg:p-12 bg-[#f7f4f1]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-10 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111318]/10 rounded-full mb-4">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span className="text-xs font-bold tracking-wider uppercase text-[#111318]/60">Studio Access</span>
                        </div>
                        <h2 className="text-4xl font-semibold text-text-primary mb-3 font-heading">Studio Login</h2>
                        <p className="text-text-secondary font-body text-lg">Sign in to manage your clients and projects</p>
                    </div>

                    <form onSubmit={handleSignIn} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="studio-email" className="block text-sm font-medium text-text-primary font-body ml-1">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Mail className="h-4 w-4 text-text-secondary" />
                                </div>
                                <input
                                    id="studio-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-11 shadow-sm border-[#e5e0da]"
                                    placeholder="studio@axisliving.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="studio-password" className="block text-sm font-medium text-text-primary font-body ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Lock className="h-4 w-4 text-text-secondary" />
                                </div>
                                <input
                                    id="studio-password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pl-11 pr-12 shadow-sm border-[#e5e0da]"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#111318] text-white font-body font-semibold text-base rounded-xl transition-all duration-200 ease-out hover:bg-[#1a1f2e] hover:shadow-elevated active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In to Studio'
                            )}
                        </button>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-error text-sm mt-4 text-center font-body bg-red-50 p-3 rounded-xl border border-red-100"
                            >
                                {error}
                            </motion.div>
                        )}
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-sm text-text-secondary font-body">
                            Looking for the client portal?{' '}
                            <a href="/login" className="text-primary font-semibold hover:underline">
                                Sign in here
                            </a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
