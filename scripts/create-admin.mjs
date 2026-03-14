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
    console.error('Error: Missing Supabase configuration in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdmin() {
    const email = process.argv[2]
    const password = process.argv[3]
    const name = process.argv[4] || 'Studio Admin'

    if (!email || !password) {
        console.log('Usage: node scripts/create-admin.mjs <email> <password> "<name>"')
        process.exit(1)
    }

    console.log(`--- CREATING STUDIO ADMIN: ${email} ---`)

    // 1. Create/Get Auth User
    const { data: users } = await supabase.auth.admin.listUsers()
    let authUser = users?.users.find(u => u.email === email)

    if (authUser) {
        console.log('User already exists in Auth. Linking to Studio...')
    } else {
        console.log('Creating new Auth user...')
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        })

        if (createError) {
            console.error('Error creating auth user:', createError.message)
            return
        }
        authUser = newUser.user
    }

    // 2. Create Studio User entry
    const { error: studioError } = await supabase
        .from('studio_users')
        .upsert({
            id: authUser.id,
            email: email,
            name: name,
            role: 'admin'
        })

    if (studioError) {
        console.error('Error creating studio admin record:', studioError.message)
        if (studioError.message.includes('relation "studio_users" does not exist')) {
            console.error('TIP: Make sure you have run the create-studio-users.sql script in Supabase first!')
        }
        return
    }

    console.log('\n--- SUCCESS ---')
    console.log(`Admin created: ${name} (${email})`)
    console.log('You can now log in at /studio-login')
    console.log('---------------')
}

createAdmin()
