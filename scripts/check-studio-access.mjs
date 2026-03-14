import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = Object.fromEntries(
    readFileSync('.env.local', 'utf-8')
        .split('\n')
        .filter(line => line && !line.startsWith('#'))
        .map(line => {
            const firstEq = line.indexOf('=')
            if (firstEq === -1) return ['', '']
            return [line.slice(0, firstEq).trim(), line.slice(firstEq + 1).trim()]
        })
        .filter(([k]) => k)
)

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function checkStudioUsers() {
    console.log('Checking studio_users...')
    const { data: studioUsers, error: sError } = await supabase.from('studio_users').select('*')
    if (sError) {
        console.error('Error fetching studio_users:', sError.message)
    } else {
        console.log('--- Studio Users ---')
        studioUsers.forEach(u => console.log(`ID: ${u.id}, Email: ${u.email}, Name: ${u.name}, Role: ${u.role}`))
    }

    console.log('\nChecking active auth sessions/users...')
    const { data: { users }, error: aError } = await supabase.auth.admin.listUsers()
    if (aError) {
        console.error('Error fetching auth users:', aError.message)
    } else {
        console.log('--- Auth Users (Recent) ---')
        users.slice(0, 10).forEach(u => console.log(`ID: ${u.id}, Email: ${u.email}, Last Sign In: ${u.last_sign_in_at}`))
    }
}

checkStudioUsers()
