import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = Object.fromEntries(
    readFileSync('.env.local', 'utf-8')
        .split('\n')
        .filter(line => line && !line.startsWith('#'))
        .map(line => {
            const firstEq = line.indexOf('=')
            return [line.slice(0, firstEq).trim(), line.slice(firstEq + 1).trim()]
        })
)

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function check() {
    const { error } = await supabase.from('messages').select('sender_id').limit(1)
    if (error) {
        console.log('COLUMN_MISSING')
        console.log(error.message)
    } else {
        console.log('COLUMN_EXISTS')
    }
}

check()
