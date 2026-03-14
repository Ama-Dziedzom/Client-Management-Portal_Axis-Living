'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { StudioUser } from '@/types/database'
import { useRouter } from 'next/navigation'

interface StudioContextType {
    session: Session | null
    studioUser: StudioUser | null
    loading: boolean
    signOut: () => Promise<void>
}

const StudioContext = createContext<StudioContextType>({
    session: null,
    studioUser: null,
    loading: true,
    signOut: async () => { },
})

export function StudioProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [studioUser, setStudioUser] = useState<StudioUser | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) {
                console.warn('[StudioContext] Timed out')
                setLoading(false)
            }
        }, 5000)

        supabase.auth.getSession().then(({ data: { session } }) => {
            clearTimeout(timer)
            setSession(session)
            if (session?.user) {
                fetchStudioUser(session.user.id)
            } else {
                setLoading(false)
            }
        }).catch(() => {
            clearTimeout(timer)
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session)
                if (session?.user) {
                    fetchStudioUser(session.user.id)
                } else {
                    setStudioUser(null)
                    setLoading(false)
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const fetchStudioUser = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('studio_users')
                .select('*')
                .eq('id', userId)
                .maybeSingle()

            if (error) throw error
            setStudioUser(data)
        } catch (error) {
            console.error('Error fetching studio user:', error)
        } finally {
            setLoading(false)
        }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setSession(null)
        setStudioUser(null)
        router.push('/studio-login')
    }

    return (
        <StudioContext.Provider value={{ session, studioUser, loading, signOut }}>
            {children}
        </StudioContext.Provider>
    )
}

export const useStudio = () => useContext(StudioContext)
