export default {
    name: 'about',
    title: 'About Page',
    type: 'document',
    fields: [
        { name: 'headline', title: 'Headline', type: 'string' },
        { name: 'bio', title: 'Bio', type: 'text' },
        { name: 'philosophy', title: 'Design Philosophy', type: 'text' },
        { name: 'portrait', title: 'Portrait Photo', type: 'image', options: { hotspot: true } },
        {
            name: 'processSteps',
            title: 'Process Steps',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'number', title: 'Step Number', type: 'string' },
                        { name: 'title', title: 'Step Title', type: 'string' },
                        { name: 'description', title: 'Description', type: 'text' },
                    ],
                },
            ],
        },
        {
            name: 'pressLogos',
            title: 'Press Mentions',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'behindStudioTitle',
            title: 'Behind the Studio Title',
            type: 'string',
            initialValue: 'Behind the Studio'
        },
        {
            name: 'behindStudioBody',
            title: 'Behind the Studio Body',
            type: 'text',
            initialValue: 'Most of what we do happens before anything is bought or built. Site visits, material sourcing trips, vendor negotiations, late-night layout revisions. This is the work behind the work — and it’s what separates a space that looks good in photos from one that feels right to live in.'
        },
    ],
}
