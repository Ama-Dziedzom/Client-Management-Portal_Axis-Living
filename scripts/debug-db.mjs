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
    const { data: projects, error: pError } = await supabase.from('projects').select('*')
    console.log('--- PROJECTS ---')
    console.log('Count:', projects?.length || 0)
    if (pError) console.error('Error projects:', pError.message)
    
    if (projects && projects.length > 0) {
        console.log('Sample Project:', projects[0].id, projects[0].title, 'Client ID:', projects[0].client_id)
        const { data: messages, error: mError } = await supabase.from('messages').select('*').eq('project_id', projects[0].id)
        console.log('--- MESSAGES for first project ---')
        console.log('Count:', messages?.length || 0)
        if (mError) console.error('Error messages:', mError.message)
        if (messages && messages.length > 0) {
            console.log('Sample Message:', messages[0])
        }
    }
    
    const { data: clients, error: cError } = await supabase.from('clients').select('*')
    console.log('--- CLIENTS ---')
    console.log('Count:', clients?.length || 0)
    if (clients && clients.length > 0) {
        console.log('Sample Client:', clients[0].id, clients[0].name)
    }
}

debug()
