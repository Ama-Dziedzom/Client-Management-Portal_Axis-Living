'use client'

import { Toaster } from 'react-hot-toast'
import LoginForm from '@/components/auth/LoginForm'
import { studioSupabase } from '@/lib/supabase'

export default function StudioLoginPage() {
    return (
        <main className="min-h-screen bg-background flex items-center justify-center px-4">
            <Toaster position="top-center" />
            <LoginForm
                title="Studio"
                subtitle="Sign in to the studio dashboard"
                redirectPath="/studio"
                contactEmail="hello@axisliving.co.zm"
                supabaseClient={studioSupabase}
            />
        </main>
    )
}
