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
    ],
}
