export default {
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    groups: [
        { name: 'general', title: 'Studio Info' },
        { name: 'header', title: 'Navigation Bar' },
        { name: 'footer', title: 'Footer' },
        { name: 'socials', title: 'Social Links & Contact' },
    ],
    fields: [
        { name: 'studioName', title: 'Studio Name', type: 'string', group: 'general' },
        { name: 'email', title: 'Contact Email', type: 'string', group: 'socials' },
        {
            name: 'headerLogo',
            title: 'Header Logo',
            type: 'image',
            group: 'header',
            description: 'The logo displayed in the navigation bar.'
        },
        {
            name: 'navbarLinks',
            title: 'Navbar Links',
            type: 'array',
            group: 'header',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'name', type: 'string', title: 'Link Text' },
                        { name: 'href', type: 'string', title: 'URL (e.g., /portfolio)' }
                    ]
                }
            ]
        },
        {
            name: 'footerLogo',
            title: 'Footer Logo',
            type: 'image',
            group: 'footer',
            description: 'The logo displayed in the footer.'
        },
        {
            name: 'footerDescription',
            title: 'Footer Description',
            type: 'text',
            rows: 3,
            group: 'footer'
        },
        { name: 'instagram', title: 'Instagram URL', type: 'url', group: 'socials' },
        { name: 'pinterest', title: 'Pinterest URL', type: 'url', group: 'socials' },
        { name: 'calendlyUrl', title: 'Calendly Booking URL', type: 'url', group: 'socials' },
        { name: 'footerTagline', title: 'Footer Tagline', type: 'string', group: 'footer' },
        { name: 'copyrightText', title: 'Copyright Text', type: 'string', group: 'footer', initialValue: 'Axis Living · Bespoke Interiors · Est. 2026' },
    ],
}
