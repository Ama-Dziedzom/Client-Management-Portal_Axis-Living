// Relative URL works in the preview iframe (same-origin sandbox).
// For server-side email sends, we need the absolute Vercel URL.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '')

export const EMAIL_LOGO_SRC =
    typeof window !== 'undefined'
        ? '/axis-living-email.png'
        : `${siteUrl}/axis-living-email.png`
