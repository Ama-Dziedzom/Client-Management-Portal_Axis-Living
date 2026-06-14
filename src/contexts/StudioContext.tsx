'use client'

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react'
import { Session } from '@supabase/supabase-js'
import { StudioUser } from '@/types/database'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { studioSupabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

interface StudioContextType {
    session: Session | null
    studioUser: StudioUser | null
    loading: boolean
    signOut: () => Promise<void>
    unreadCount: number
    refreshUnreadCount: () => Promise<void>
}

const StudioContext = createContext<StudioContextType>({
    session: null,
    studioUser: null,
    loading: true,
    signOut: async () => { },
    unreadCount: 0,
    refreshUnreadCount: async () => { },
})

export function StudioProvider({ children }: { children: ReactNode }) {
    const { session, user: studioUser, loading, signOut } = useSupabaseAuth<StudioUser>(
        studioSupabase,
        'studio_users',
        '/studio-login',
        async () => {
            logger.warn('Auth', 'User not found in studio_users table')
        }
    )

    const [unreadCount, setUnreadCount] = useState(0)

    const refreshUnreadCount = useCallback(async () => {
        const { count } = await studioSupabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_type', 'client')
            .eq('read', false)
        setUnreadCount(count || 0)
    }, [])

    // Initial fetch + Realtime subscription
    useEffect(() => {
        refreshUnreadCount()

        const channel = studioSupabase
            .channel('studio-context-unread')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, refreshUnreadCount)
            .subscribe()

        return () => { studioSupabase.removeChannel(channel) }
    }, [refreshUnreadCount])

    return (
        <StudioContext.Provider value={{ session, studioUser, loading, signOut, unreadCount, refreshUnreadCount }}>
            {children}
        </StudioContext.Provider>
    )
}

export const useStudio = () => {
    const context = useContext(StudioContext)
    if (!context) {
        throw new Error('useStudio must be used within a StudioProvider')
    }
    return context
}
