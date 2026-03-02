export default {
    name: 'post',
    title: 'Journal Post',
    type: 'document',
    fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: ['Design Guides', 'Art & Culture', 'Budgeting', 'Small Spaces'],
            },
        },
        { name: 'readTime', title: 'Read Time', type: 'string' },
        { name: 'publishedAt', title: 'Published At', type: 'date' },
        { name: 'excerpt', title: 'Excerpt', type: 'text' },
        { name: 'featured', title: 'Featured Post', type: 'boolean' },
        { name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } },
        { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] },
        {
            name: 'body',
            title: 'Post Body',
            type: 'array',
            of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
        },
    ],
}
