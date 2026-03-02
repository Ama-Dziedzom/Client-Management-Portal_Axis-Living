export default {
    name: 'testimonial',
    title: 'Testimonial',
    type: 'document',
    fields: [
        { name: 'quote', title: 'Quote', type: 'text' },
        { name: 'clientName', title: 'Client Name', type: 'string' },
        { name: 'location', title: 'Location', type: 'string' },
        { name: 'featured', title: 'Show on Homepage', type: 'boolean' },
        { name: 'order', title: 'Display Order', type: 'number' },
    ],
}
