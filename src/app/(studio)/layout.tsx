export const dynamic = 'force-dynamic'

import { StudioProvider } from '@/contexts/StudioContext'
import StudioLayout from '@/components/studio/StudioLayout'

export default function StudioRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <StudioProvider>
            <StudioLayout>{children}</StudioLayout>
        </StudioProvider>
    )
}
