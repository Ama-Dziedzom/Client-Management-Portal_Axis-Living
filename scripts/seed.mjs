import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Load .env.local manually
let env = {}
try {
    const envFile = readFileSync('.env.local', 'utf-8')
    env = Object.fromEntries(
        envFile.split('\n')
            .filter(line => line && !line.startsWith('#'))
            .map(line => {
                const firstEq = line.indexOf('=')
                if (firstEq === -1) return [line.trim(), '']
                return [line.slice(0, firstEq).trim(), line.slice(firstEq + 1).trim()]
            })
    )
} catch (e) {
    console.error('Error: Could not read .env.local file.')
    process.exit(1)
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('\n--- ERROR: MISSING CONFIGURATION ---')
    if (!supabaseUrl) console.error('Missing: NEXT_PUBLIC_SUPABASE_URL')
    if (!supabaseServiceKey) console.error('Missing: SUPABASE_SERVICE_ROLE_KEY')
    console.error('\nPlease add these to your .env.local file.')
    console.error('You can find the Service Role Key in: Supabase Dashboard -> Settings -> API')
    console.error('------------------------------------\n')
    process.exit(1)
}

const supabase = createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

async function seed() {
    const testEmail = 'demo@example.com'
    const testPassword = 'password123'
    const testName = 'Demo Client'

    console.log('--- SEEDING TEST DATA ---')

    // 1. Create/Get Auth User
    let authId
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    const existingUser = users?.users.find(u => u.email === testEmail)

    if (existingUser) {
        console.log(`User ${testEmail} already exists. Using existing ID.`)
        authId = existingUser.id
    } else {
        console.log(`Creating user ${testEmail}...`)
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: testEmail,
            password: testPassword,
            email_confirm: true
        })

        if (createError) {
            console.error('Error creating auth user:', createError.message)
            return
        }
        authId = newUser.user.id
    }

    // 2. Create/Update Client
    const { error: clientError } = await supabase
        .from('clients')
        .upsert({
            id: authId,
            email: testEmail,
            name: testName,
            active: true
        })

    if (clientError) {
        console.error('Error upserting client:', clientError.message)
        return
    }
    console.log('Client record created.')

    // 3. Create/Get Project
    let project
    const { data: existingProjects, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', authId)
        .limit(1)

    if (existingProjects && existingProjects.length > 0) {
        project = existingProjects[0]
        console.log('Using existing project:', project.title)
    } else {
        console.log('Creating new project...')
        const { data: newProject, error: projectError } = await supabase
            .from('projects')
            .insert({
                client_id: authId,
                title: 'The Axis Residence',
                location: 'Lusaka, Zambia',
                status: 'in_progress',
                description: 'A contemporary luxury residence featuring Quinsi-inspired architectural elements and modern minimalist interiors.'
            })
            .select()
            .single()

        if (projectError) {
            console.error('Error creating project:', projectError.message)
            return
        }
        project = newProject
        console.log('Project created:', project.title)
    }

    // 4. Create Timeline Stages
    const stages = [
        { project_id: project.id, stage_name: 'Architectural Planning', status: 'complete', display_order: 1, notes: 'Initial site survey and concept designs approved.' },
        { project_id: project.id, stage_name: 'Foundation & Framing', status: 'complete', display_order: 2, notes: 'Main structure framing completed.' },
        { project_id: project.id, stage_name: 'Interior Design', status: 'active', display_order: 3, notes: 'Currently selecting finishes and furniture layouts.' },
        { project_id: project.id, stage_name: 'Final Inspection', status: 'upcoming', display_order: 4, notes: 'Scheduled for next month.' }
    ]

    // Delete old stages first
    await supabase.from('timeline_stages').delete().eq('project_id', project.id)

    const { error: stageError } = await supabase
        .from('timeline_stages')
        .insert(stages)

    if (stageError) {
        console.error('Error creating stages:', stageError.message)
        return
    }
    console.log('Timeline stages created.')

    console.log('\n--- SUCCESS ---')
    console.log('EMAIL:    ', testEmail)
    console.log('PASSWORD: ', testPassword)
    console.log('---------------')
}

seed()
