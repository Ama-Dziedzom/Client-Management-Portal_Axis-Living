// Relative URL works in the preview iframe (same-origin sandbox).
// For server-side email sends, we need the absolute Vercel URL.
const siteUrl = (process.env.PORTAL_URL ?? 'https://client-axis-living.vercel.app').replace(/\/$/, '')

export const EMAIL_LOGO_SRC =
    typeof window !== 'undefined'
        ? '/axis-living-email.png'
        : `${siteUrl}/axis-living-email.png`
