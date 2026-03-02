export default {
    name: 'project',
    title: 'Portfolio Project',
    type: 'document',
    fields: [
        { name: 'title', title: 'Project Title', type: 'string' },
        { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
        { name: 'location', title: 'Location', type: 'string' },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
            options: { list: ['Residential', 'Commercial'] },
        },
        {
            name: 'style',
            title: 'Style Tag',
            type: 'string',
            options: {
                list: ['Contemporary', 'Minimalist', 'Japandi', 'Maximalist'],
            },
        },
        { name: 'year', title: 'Year', type: 'string' },
        { name: 'featured', title: 'Featured on Homepage', type: 'boolean' },
        { name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } },
        {
            name: 'gallery',
            title: 'Project Gallery',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
        },
        { name: 'briefHeading', title: 'Brief Heading', type: 'string' },
        { name: 'briefBody', title: 'Brief Body', type: 'text' },
        { name: 'approachHeading', title: 'Approach Heading', type: 'string' },
        { name: 'approachBody', title: 'Approach Body', type: 'text' },
        { name: 'resultHeading', title: 'Result Heading', type: 'string' },
        { name: 'resultBody', title: 'Result Body', type: 'text' },
    ],
}
