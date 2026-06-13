'use client'

import { Toaster } from 'react-hot-toast'
import LoginForm from '@/components/auth/LoginForm'
import { clientSupabase } from '@/lib/supabase'

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-background flex items-center justify-center px-4">
            <Toaster position="top-center" />
            <LoginForm
                title="Welcome back"
                subtitle="Sign in to your client portal"
                redirectPath="/dashboard"
                contactEmail="hello@axisliving.co.zm"
                supabaseClient={clientSupabase}
            />
        </main>
    )
}
