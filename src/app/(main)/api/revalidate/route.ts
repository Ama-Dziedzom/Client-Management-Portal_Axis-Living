import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST() {
    const paths = ['/', '/portfolio', '/journal', '/about']
    paths.forEach((path) => revalidatePath(path))
    return NextResponse.json({ revalidated: true, now: Date.now() })
}
