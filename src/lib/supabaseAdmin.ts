import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabaseAdmin: SupabaseClient | null = null

export function getSupabaseAdmin() {
    if (!_supabaseAdmin) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!url || !serviceKey) {
            throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL environment variables')
        }

        _supabaseAdmin = createClient(url, serviceKey)
    }
    return _supabaseAdmin
}

// For backwards compatibility
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
    get(_, prop) {
        return (getSupabaseAdmin() as any)[prop]
    },
})
