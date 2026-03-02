export default {
    name: 'pricing',
    title: 'Pricing Tier',
    type: 'document',
    fields: [
        { name: 'tierName', title: 'Tier Name', type: 'string' },
        { name: 'startingPrice', title: 'Starting Price', type: 'string' },
        { name: 'popular', title: 'Mark as Most Popular', type: 'boolean' },
        { name: 'bestFor', title: 'Best For', type: 'string' },
        { name: 'inclusions', title: 'Inclusions', type: 'array', of: [{ type: 'string' }] },
        { name: 'order', title: 'Display Order', type: 'number' },
    ],
}
