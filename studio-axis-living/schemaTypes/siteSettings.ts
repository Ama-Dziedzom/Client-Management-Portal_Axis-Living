export default {
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        { name: 'studioName', title: 'Studio Name', type: 'string' },
        { name: 'tagline', title: 'Hero Tagline', type: 'string' },
        { name: 'heroSubtitle', title: 'Hero Subtitle', type: 'text' },
        { name: 'heroImage', title: 'Hero Background Image', type: 'image', options: { hotspot: true } },
        { name: 'email', title: 'Contact Email', type: 'string' },
        { name: 'instagram', title: 'Instagram URL', type: 'url' },
        { name: 'pinterest', title: 'Pinterest URL', type: 'url' },
        { name: 'calendlyUrl', title: 'Calendly Booking URL', type: 'url' },
        { name: 'footerTagline', title: 'Footer Tagline', type: 'string' },
    ],
}
