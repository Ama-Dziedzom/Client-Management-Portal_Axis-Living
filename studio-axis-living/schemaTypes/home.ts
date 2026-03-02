export default {
    name: 'home',
    title: 'Home Page',
    type: 'document',
    groups: [
        { name: 'hero', title: 'Hero' },
        { name: 'about', title: 'About' },
        { name: 'projects', title: 'Projects' },
        { name: 'lookbookLogbook', title: 'Lookbook / Logbook' },
        { name: 'journal', title: 'Journal' },
        { name: 'preFooter', title: 'Pre-Footer' },
    ],
    fields: [
        // Hero
        {
            name: 'tagline',
            title: 'Hero Tagline',
            description: 'Use "for" to split into two lines with italics.',
            type: 'string',
            group: 'hero'
        },
        { name: 'heroSubtitle', title: 'Hero Subtitle', type: 'text', group: 'hero' },
        { name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true }, group: 'hero' },

        // About Section
        { name: 'aboutSubtitle', title: 'Subtitle', type: 'string', initialValue: 'About Us', group: 'about' },
        { name: 'aboutTitle', title: 'Title', type: 'string', initialValue: 'A Lusaka-based studio for deliberate living.', group: 'about' },
        { name: 'aboutBody', title: 'Body Text', type: 'text', group: 'about' },
        { name: 'aboutImage', title: 'Section Image', type: 'image', options: { hotspot: true }, group: 'about' },
        { name: 'aboutButtonText', title: 'Button Text', type: 'string', initialValue: 'Learn Our Story', group: 'about' },

        // Projects Section
        { name: 'projectsSubtitle', title: 'Subtitle', type: 'string', initialValue: 'Selected Works', group: 'projects' },
        { name: 'projectsTitle', title: 'Title', type: 'string', initialValue: 'The Portfolio', group: 'projects' },
        { name: 'projectsButtonText', title: 'Button Text', type: 'string', initialValue: 'Explore All Projects', group: 'projects' },

        // Lookbook Section
        { name: 'lookbookSubtitle', title: 'Subtitle', type: 'string', initialValue: 'Free Resource', group: 'lookbookLogbook' },
        { name: 'lookbookTitle', title: 'Title', type: 'string', initialValue: 'Get the Lookbook', group: 'lookbookLogbook' },
        { name: 'lookbookBody', title: 'Body Text', type: 'text', group: 'lookbookLogbook' },
        { name: 'lookbookButtonText', title: 'Button Text', type: 'string', initialValue: 'Get Free Access', group: 'lookbookLogbook' },

        // Journal Section
        { name: 'journalSubtitle', title: 'Subtitle', type: 'string', initialValue: 'From the Studio', group: 'journal' },
        { name: 'journalTitle', title: 'Title', type: 'string', initialValue: 'Thoughts on design, process, and living well', group: 'journal' },
        { name: 'journalButtonText', title: 'Button Text', type: 'string', initialValue: 'Read All Articles', group: 'journal' },

        // Pre-Footer Section
        { name: 'preFooterSubtitle', title: 'Subtitle', type: 'string', initialValue: 'Start Your Journey', group: 'preFooter' },
        { name: 'preFooterTitle', title: 'Title', type: 'string', initialValue: "Let's Talk About Your Space.", group: 'preFooter' },
        { name: 'preFooterBody', title: 'Body Text', type: 'text', group: 'preFooter' },
        { name: 'preFooterButtonText', title: 'Button Text', type: 'string', initialValue: 'Book a Free Consultation', group: 'preFooter' },
        { name: 'preFooterImage', title: 'Background Image', type: 'image', options: { hotspot: true }, group: 'preFooter' },
    ],
}
