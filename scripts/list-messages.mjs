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

async function debug() {
    const { data: messages, error } = await supabase.from('messages').select('*')
    if (error) {
        console.error('Error:', error.message)
    } else {
        console.log('--- ALL MESSAGES ---')
        console.table(messages.map(m => ({ id: m.id, project: m.project_id, sender_name: m.sender_name, sender_id: m.sender_id })))
    }
}

debug()
