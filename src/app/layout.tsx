import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    metadataBase: new URL('https://axisliving.co.zm'),
    title: {
        default: 'Axis Living | Bespoke Interiors - Custom Design, Lusaka',
        template: '%s | Axis Living',
    },
    description: 'Spaces designed for the way you live. We create interiors that are as intentional as they are beautiful, tailored to your life, not a trend. Lusaka-based interior design studio.',
    icons: {
        icon: '/favicon.jpeg',
        apple: '/apple-touch-icon.png',
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className="bg-background text-foreground antialiased min-h-screen overflow-x-hidden">
                {children}
            </body>
        </html>
    )
}
