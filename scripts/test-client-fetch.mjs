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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function testAsClient() {
    const testEmail = 'demo@example.com'
    const testPassword = 'password123'
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
    })
    
    if (authError) {
        console.error('Auth Error:', authError.message)
        return
    }
    
    console.log('Logged in as:', authData.user.id)
    
    const { data: projects, error: pError } = await supabase
        .from('projects')
        .select('*, messages(*)')
        .eq('client_id', authData.user.id)
    
    if (pError) {
        console.error('Fetch Error:', pError.message)
    } else {
        console.log('Projects count:', projects?.length || 0)
        if (projects && projects.length > 0) {
            console.log('Project 0 messages count:', projects[0].messages?.length || 0)
        }
    }
}

testAsClient()
