import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// IMPORTANT: isSingleton must be false for both clients.
// createBrowserClient caches the first instance as a singleton by default,
// which means the second call would return the SAME client (with the wrong
// storageKey/cookie name). Setting isSingleton: false ensures each client
// has its own independent auth session storage.

export const clientSupabase = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    {
        isSingleton: false,
        cookieOptions: {
            name: 'sb-axis-client-token',
        }
    }
)

export const studioSupabase = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    {
        isSingleton: false,
        cookieOptions: {
            name: 'sb-axis-studio-token',
        }
    }
)

// Default export for client portal compatibility
export const supabase = clientSupabase

// Server-side admin client (uses service role key — server/API routes only)
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _serverClient: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
    if (!_serverClient) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
        _serverClient = createClient(url, key)
    }
    return _serverClient
}
