'use client'

// import { NextStudio } from 'next-sanity/studio'
// import config from '../../../../studio-axis-living/sanity.config'

export default function StudioPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-12 text-center">
            <h1 className="text-4xl font-heading mb-4">Studio Temporarily Disabled</h1>
            <p className="text-foreground/60 max-w-md mx-auto">
                The Sanity Studio is currently disabled while we revert to static content.
                Please ensure the sanity config file is present to re-enable.
            </p>
        </div>
    )
    // return <NextStudio config={config} />
}
