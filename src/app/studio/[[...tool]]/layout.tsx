export const metadata = {
    title: 'Axis Living Studio',
    description: 'Sanity CMS for Axis Living',
    robots: { index: false, follow: false },
}

export default function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body style={{ margin: 0 }}>{children}</body>
        </html>
    )
}
