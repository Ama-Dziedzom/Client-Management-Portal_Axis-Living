import { client } from '@/lib/sanity'
import { projectsQuery, postsQuery } from '@/lib/queries'

export default async function SanityTestPage() {
    let projects = []
    let posts = []
    let connectionStatus = 'unknown'
    let error = ''

    try {
        projects = await client.fetch(projectsQuery)
        posts = await client.fetch(postsQuery)
        connectionStatus = 'connected'
    } catch (err) {
        connectionStatus = 'error'
        error = err instanceof Error ? err.message : String(err)
    }

    return (
        <div style={{ padding: '60px 40px', fontFamily: 'monospace', maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ fontSize: 28, marginBottom: 20 }}>🔌 Sanity Connection Test</h1>

            <div style={{
                padding: 20,
                borderRadius: 8,
                marginBottom: 30,
                backgroundColor: connectionStatus === 'connected' ? '#d4edda' : '#f8d7da',
                border: `1px solid ${connectionStatus === 'connected' ? '#28a745' : '#dc3545'}`,
            }}>
                <strong>Status:</strong> {connectionStatus === 'connected' ? '✅ Connected' : `❌ Error: ${error}`}
                <br />
                <strong>Project ID:</strong> {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                <br />
                <strong>Dataset:</strong> {process.env.NEXT_PUBLIC_SANITY_DATASET}
            </div>

            <h2 style={{ fontSize: 20, marginBottom: 10 }}>📦 Projects from Sanity ({projects.length})</h2>
            {projects.length === 0 ? (
                <p style={{ color: '#666' }}>No projects in Sanity yet — the CMS is empty. This is expected before seeding.</p>
            ) : (
                <ul>
                    {projects.map((p: any) => (
                        <li key={p._id}>{p.title} — {p.location}</li>
                    ))}
                </ul>
            )}

            <h2 style={{ fontSize: 20, marginTop: 30, marginBottom: 10 }}>📝 Posts from Sanity ({posts.length})</h2>
            {posts.length === 0 ? (
                <p style={{ color: '#666' }}>No posts in Sanity yet — the CMS is empty. This is expected before seeding.</p>
            ) : (
                <ul>
                    {posts.map((p: any) => (
                        <li key={p._id}>{p.title} — {p.category}</li>
                    ))}
                </ul>
            )}

            <div style={{ marginTop: 40, padding: 20, background: '#f0f0f0', borderRadius: 8 }}>
                <strong>Next steps:</strong>
                <ol style={{ paddingLeft: 20 }}>
                    <li>If status is ✅ Connected — the Sanity integration is working!</li>
                    <li>Counts of 0 are normal — the CMS is empty until we run the seed script.</li>
                    <li>After seeding, refresh this page to see data populate.</li>
                </ol>
            </div>
        </div>
    )
}
