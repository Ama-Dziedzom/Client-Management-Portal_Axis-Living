/**
 * Seed script — migrates existing static data from the Next.js app
 * into Sanity CMS.
 *
 * Usage: node seed.mjs
 * (run from the studio-axis-living directory)
 */

import { createClient } from '@sanity/client'

const client = createClient({
    projectId: '7fzpugbc',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN, // needs write access
})

// ───── PROJECTS DATA ─────
const projects = [
    {
        _id: 'project-1',
        _type: 'project',
        title: 'The Mwansa Residence',
        slug: { _type: 'slug', current: 'the-mwansa-residence' },
        location: 'Kabulonga, Lusaka',
        category: 'Residential',
        style: 'Contemporary',
        year: '2024',
        featured: true,
        briefHeading: 'The Client Brief',
        briefBody: "The Mwansa family had just completed a four-bedroom home in Kabulonga and wanted an interior that reflected their dual sensibility, globally cultured but deeply rooted in Zambian identity. They wanted warmth without being traditional, modernity without being cold. The brief was clear: make it feel like us, not like a hotel.",
        approachHeading: 'The Design Approach',
        approachBody: "We anchored the entire home in a palette of warm terracotta, aged brass, and deep forest green. Colours that echo the Zambian landscape while reading as unmistakably contemporary. Custom furniture pieces were sourced from local artisans in Lusaka and combined with carefully selected European finishes. Every room was designed around a single hero moment: a hand-plastered feature wall in the living room, a ceiling installation in the primary bedroom, a bespoke kitchen island in book-matched marble.",
        resultHeading: 'The Result',
        resultBody: "A home that stops guests at the door. The Mwansas describe it as the first time a space has truly felt like theirs. The living areas flow naturally into one another while maintaining distinct personalities, and the African art collection they'd accumulated over years finally has a home worthy of it. We documented the full project for an upcoming feature in a regional design publication.",
    },
    {
        _id: 'project-2',
        _type: 'project',
        title: 'Haven Wellness Studio',
        slug: { _type: 'slug', current: 'haven-wellness-studio' },
        location: 'Woodlands, Lusaka',
        category: 'Commercial',
        style: 'Minimalist',
        year: '2024',
        featured: true,
        briefHeading: 'The Client Brief',
        briefBody: "Haven is a boutique wellness studio offering yoga, sound healing, and breathwork sessions to Lusaka's professional class. The founder came to us with a single instruction: when someone walks in, they should immediately feel their shoulders drop. The 1,800 sq ft space in Woodlands needed to communicate calm, premium quality, and intentionality without feeling clinical or austere.",
        approachHeading: 'The Design Approach',
        approachBody: "We stripped everything back to raw materials: polished concrete floors, lime-washed walls in warm white, and ceiling beams left exposed in their natural timber. Sound absorption panels were custom-wrapped in undyed linen and mounted as a geometric wall feature in the main studio. A reception desk was carved from a single piece of reclaimed mukwa wood, anchoring the entrance with a sense of permanence. Lighting throughout is indirect — concealed LED strips behind wall panels and pendant fixtures in hand-blown glass.",
        resultHeading: 'The Result',
        resultBody: "Haven has become one of Lusaka's most photographed commercial interiors. The studio operates at capacity most evenings, and the spatial design plays a direct role in client retention — members consistently cite the atmosphere as a reason for renewing. The founder has since engaged us to design a second location in the Copperbelt, currently in concept phase.",
    },
    {
        _id: 'project-3',
        _type: 'project',
        title: 'The Banda Apartment',
        slug: { _type: 'slug', current: 'the-banda-apartment' },
        location: 'Roma, Lusaka',
        category: 'Residential',
        style: 'Japandi',
        year: '2023',
        featured: true,
        briefHeading: 'The Client Brief',
        briefBody: "A young couple returning from six years in Tokyo wanted their new Lusaka apartment to honour their time in Japan without feeling like a replica. They were drawn to Japandi — the intersection of Japanese minimalism and Scandinavian warmth — and wanted a space that felt curated, calm, and deeply personal. The 120 sqm apartment in Roma had good bones but generic finishes throughout.",
        approachHeading: 'The Design Approach',
        approachBody: "We rebuilt the interior around a philosophy of visible restraint. Every surface was carefully considered: oak-effect flooring replaced the original tiles, walls were finished in a warm putty plaster, and the kitchen was redesigned in matte black cabinetry with wooden handles. The furniture is low-profile and deeply comfortable — a conscious departure from the upright, display-oriented layouts common in Lusaka apartments. Textiles are muted and layered: linen, cotton, unbleached wool. A single large-format photograph by a Zambian artist anchors the living room wall.",
        resultHeading: 'The Result',
        resultBody: "The apartment has a stillness to it that photographs can only partially convey. Our clients describe coming home as a physical relief — the space drops their nervous system in a way no previous home achieved. One unexpected outcome: the project generated significant interest from other returning diaspora professionals seeking similar work, opening a new client segment for our studio.",
    },
    {
        _id: 'project-4',
        _type: 'project',
        title: 'The Mulenga Penthouse',
        slug: { _type: 'slug', current: 'the-mulenga-penthouse' },
        location: 'Sunningdale, Lusaka',
        category: 'Residential',
        style: 'Maximalist',
        year: '2023',
        featured: false,
        briefHeading: 'The Client Brief',
        briefBody: "Dr. Mulenga is one of Lusaka's most prominent art collectors. Her penthouse apartment in a new Sunningdale development was to be both a home and a private gallery — a space where important works could be displayed properly while still functioning as a warm, liveable family environment. The challenge: 320 sqm of brand-new developer-finish space with no character, high ceilings, and floor-to-ceiling glazing that flooded the interior with harsh afternoon light.",
        approachHeading: 'The Design Approach',
        approachBody: "We leaned in. The living room was anchored by a custom 4-metre sofa in deep teal velvet, facing floor-to-ceiling windows overlooking the city. Walls were treated in a dramatic dark olive limewash, a backdrop that made the art collection sing. We mixed antique Moroccan brass lanterns with custom contemporary lighting, layered multiple rugs in the dining area, and used rich jewel tones (emerald, burnt sienna, indigo) across the five-bedroom layout. Every room has a different personality but they speak the same visual language: opulent, confident, African.",
        resultHeading: 'The Result',
        resultBody: "The penthouse has since hosted a private art exhibition and two editorial shoots. Our client describes dinner parties there as 'events' in a way they never were before. The project marked our most ambitious residential commission to date and established our capability in high-end maximalist work, a portfolio category that has since generated three new enquiries from clients in the same tier.",
    },
]

// ───── JOURNAL POSTS DATA ─────
const posts = [
    {
        _id: 'post-1',
        _type: 'post',
        title: 'How to Choose Your Interior Design Style (Without Regret)',
        slug: { _type: 'slug', current: 'how-to-choose-your-interior-design-style' },
        category: 'Design Guides',
        readTime: '6 min read',
        publishedAt: '2024-10-14',
        excerpt: "Most people pick a style they love on Pinterest and end up living in a space that feels like a showroom. Here's how to find the aesthetic that actually fits your life.",
        featured: true,
        tags: ['Design Tips', 'Getting Started', 'Style'],
        body: [
            { _type: 'block', _key: 'p1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: "The most common mistake we see from new clients is choosing an aesthetic before understanding how they actually live. They fall in love with a minimalist Japanese interior on Instagram — all clean lines and negative space — and then they have three kids, a dog, and a husband who collects vintage cameras. The minimalist interior lasts about four months." }], markDefs: [] },
            { _type: 'block', _key: 'h1', style: 'h2', children: [{ _type: 'span', _key: 's2', text: 'Start With Function, Not Feeling' }], markDefs: [] },
            { _type: 'block', _key: 'p2', style: 'normal', children: [{ _type: 'span', _key: 's3', text: "Before you open Pinterest, answer these questions honestly: How many people live in this space? Do you entertain frequently or prefer intimate gatherings? Do you work from home? Do you have children or pets? Are you a natural minimalist or do you love having your collections and memories on display? The answers will eliminate at least half the aesthetic options immediately — and that's a good thing." }], markDefs: [] },
            { _type: 'block', _key: 'h2', style: 'h2', children: [{ _type: 'span', _key: 's4', text: 'The Three Styles Most Zambians Actually Live Well In' }], markDefs: [] },
            { _type: 'block', _key: 'p3', style: 'normal', children: [{ _type: 'span', _key: 's5', text: "After years of projects across Lusaka and the Copperbelt, we've noticed patterns. Contemporary African works for almost everyone — it's warm, it's personal, it ages well, and it gets better as you add art and objects over time. Japandi works beautifully for professionals who travel frequently and want a home that resets them. Maximalism works for collectors, entertainers, and people who find sparse spaces anxiety-inducing rather than calming. Knowing which category you fall into is half the decision." }], markDefs: [] },
            { _type: 'block', _key: 'h3', style: 'h2', children: [{ _type: 'span', _key: 's6', text: 'The Test We Give Every New Client' }], markDefs: [] },
            { _type: 'block', _key: 'p4', style: 'normal', children: [{ _type: 'span', _key: 's7', text: "We ask clients to send us 10 photos of spaces they love — not from interior design accounts, but from anywhere. Hotels they've stayed in. Restaurants they return to. A friend's house they always feel good in. The patterns that emerge from those 10 photos tell us more about their real aesthetic than any style quiz ever could." }], markDefs: [] },
        ],
    },
    {
        _id: 'post-2',
        _type: 'post',
        title: 'Why Your Home Needs African Art (And How to Hang It)',
        slug: { _type: 'slug', current: 'why-zambian-homes-should-embrace-african-art' },
        category: 'Art & Culture',
        readTime: '5 min read',
        publishedAt: '2024-09-02',
        excerpt: "African contemporary art is having a global moment. But beyond the market buzz, there's a more personal reason to live with it — and a right and wrong way to display it.",
        featured: true,
        tags: ['Art', 'African Design', 'Styling'],
        body: [
            { _type: 'block', _key: 'p1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: "We've noticed something over the years: the homes that feel the most alive are almost always the ones with original art on the walls. Not prints. Not poster frames from a furniture store. Original works — paintings, sculptures, textiles — by artists who made something with intention." }], markDefs: [] },
            { _type: 'block', _key: 'h1', style: 'h2', children: [{ _type: 'span', _key: 's2', text: "The Market Argument (And Why It's Not the Point)" }], markDefs: [] },
            { _type: 'block', _key: 'p2', style: 'normal', children: [{ _type: 'span', _key: 's3', text: "Yes, African contemporary art has appreciated significantly in value over the last decade. Artists like Njideka Akunyili Crosby, Toyin Ojih Odutola, and Omar Ba now command prices that would have been unthinkable fifteen years ago. But buying art as investment is the wrong starting point for a home. Buy what moves you first. The value will take care of itself." }], markDefs: [] },
            { _type: 'block', _key: 'h2', style: 'h2', children: [{ _type: 'span', _key: 's4', text: 'How to Hang It Without Getting It Wrong' }], markDefs: [] },
            { _type: 'block', _key: 'p3', style: 'normal', children: [{ _type: 'span', _key: 's5', text: "The single most common mistake: hanging art too high. Eye level means the centre of the piece at roughly 145-150cm from the floor — not the top of the frame at ceiling height. Group smaller pieces in odd numbers. Let large pieces breathe — don't crowd them with furniture pushed directly underneath. And resist the urge to match: art should contrast with its surroundings, not blend in." }], markDefs: [] },
        ],
    },
    {
        _id: 'post-3',
        _type: 'post',
        title: 'What Does Interior Design Actually Cost in Zambia?',
        slug: { _type: 'slug', current: 'interior-design-budget-guide-zambia' },
        category: 'Budgeting',
        readTime: '8 min read',
        publishedAt: '2024-08-19',
        excerpt: "The question everyone has but few ask openly. We break down real costs, common budget mistakes, and how to get the most from whatever you're working with.",
        featured: false,
        tags: ['Budgeting', 'Getting Started', 'Zambia'],
        body: [
            { _type: 'block', _key: 'p1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: "Budget is the conversation nobody wants to have first. Clients worry they'll be judged for their number. Designers worry they'll scare clients off. The result is a lot of vague early conversations that waste everyone's time. We'd rather just be direct." }], markDefs: [] },
            { _type: 'block', _key: 'h1', style: 'h2', children: [{ _type: 'span', _key: 's2', text: 'The Honest Numbers' }], markDefs: [] },
            { _type: 'block', _key: 'p2', style: 'normal', children: [{ _type: 'span', _key: 's3', text: "A single room refresh — new furniture, lighting, soft furnishings, styling — done properly in Lusaka starts at around K15,000 and can go to K45,000 depending on material choices. A full apartment redesign (3-4 rooms, including kitchen and bathrooms) typically runs between K65,000 and K220,000. A full build or developer collaboration starts at K170,000 and scales with scope and finish level." }], markDefs: [] },
            { _type: 'block', _key: 'h2', style: 'h2', children: [{ _type: 'span', _key: 's4', text: "Where People Overspend (And Where They Shouldn't Cut)" }], markDefs: [] },
            { _type: 'block', _key: 'p3', style: 'normal', children: [{ _type: 'span', _key: 's5', text: "Overspend: imported furniture that ships slowly, arrives damaged, and depreciates the moment it lands. Undersupport: lighting. Nothing transforms a space faster than good lighting and nothing kills a beautiful room faster than bad lighting. It is never the place to cut corners. Same goes for upholstery fabric — cheap fabric looks cheap within a year." }], markDefs: [] },
            { _type: 'block', _key: 'h3', style: 'h2', children: [{ _type: 'span', _key: 's6', text: 'The 60/30/10 Rule We Actually Use' }], markDefs: [] },
            { _type: 'block', _key: 'p4', style: 'normal', children: [{ _type: 'span', _key: 's7', text: "For most residential projects we allocate roughly 60% of the budget to large furniture and fixed elements, 30% to lighting and soft furnishings, and 10% to art, accessories, and styling. This ratio shifts for commercial projects where lighting often takes a larger share. It's a starting framework, not a rule — but it prevents the common mistake of blowing the budget on a sofa and having nothing left for anything else." }], markDefs: [] },
        ],
    },
    {
        _id: 'post-4',
        _type: 'post',
        title: 'How to Make a Small Lusaka Apartment Feel Twice the Size',
        slug: { _type: 'slug', current: 'designing-small-apartments-lusaka' },
        category: 'Small Spaces',
        readTime: '7 min read',
        publishedAt: '2024-07-30',
        excerpt: "Most apartments in Lusaka are smaller than they should be for the price. Here are the spatial strategies we use on every small-space project to make rooms feel generous.",
        featured: false,
        tags: ['Small Spaces', 'Lusaka', 'Tips'],
        body: [
            { _type: 'block', _key: 'p1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: "The most requested thing we hear from Lusaka clients: make it feel bigger. Land is expensive, builds are dense, and a lot of people are living in 60-80 sqm apartments that need to do a lot of work. The good news is that spatial generosity is mostly a design problem, not a square footage problem." }], markDefs: [] },
            { _type: 'block', _key: 'h1', style: 'h2', children: [{ _type: 'span', _key: 's2', text: 'Vertical Space Is Almost Always Wasted' }], markDefs: [] },
            { _type: 'block', _key: 'p2', style: 'normal', children: [{ _type: 'span', _key: 's3', text: "Most Lusaka apartments have ceilings between 2.7m and 3.2m. Most furniture stops at 2m. That gap between the top of your bookshelf and the ceiling is dead space that makes rooms feel low and cluttered simultaneously. Floor-to-ceiling storage, tall curtains hung from ceiling height (not window height), and vertical artwork all draw the eye up and make the room feel taller and more spacious." }], markDefs: [] },
            { _type: 'block', _key: 'h2', style: 'h2', children: [{ _type: 'span', _key: 's4', text: 'The One Furniture Rule That Changes Everything' }], markDefs: [] },
            { _type: 'block', _key: 'p3', style: 'normal', children: [{ _type: 'span', _key: 's5', text: "In a small space, choose fewer pieces of better quality rather than many pieces of modest quality. A room with four well-chosen pieces reads as curated and spacious. The same room with eight modest pieces reads as cluttered, regardless of how good each individual piece is. Restraint is a spatial strategy." }], markDefs: [] },
            { _type: 'block', _key: 'h3', style: 'h2', children: [{ _type: 'span', _key: 's6', text: 'Mirrors, Light, and the Illusion of Depth' }], markDefs: [] },
            { _type: 'block', _key: 'p4', style: 'normal', children: [{ _type: 'span', _key: 's7', text: "A large mirror on the wall opposite your main window effectively doubles the perceived width of a room. Warm lighting in corners (rather than a single central ceiling light) creates depth and shadow that makes spaces feel more three-dimensional. Light paint colours help but are often overrated — a small room in a deep, confident colour with great lighting can feel more generous than the same room painted white with poor lighting." }], markDefs: [] },
        ],
    },
]

// ───── TESTIMONIALS DATA ─────
const testimonials = [
    {
        _id: 'testimonial-1',
        _type: 'testimonial',
        quote: "They didn't just design a space — they understood how we live in it. Every detail feels intentional.",
        clientName: 'The Mwansa Family',
        location: 'Kabulonga, Lusaka',
        featured: true,
        order: 1,
    },
    {
        _id: 'testimonial-2',
        _type: 'testimonial',
        quote: "Our members consistently cite the atmosphere as a reason for renewing. That's the power of thoughtful design.",
        clientName: 'Haven Wellness Studio',
        location: 'Woodlands, Lusaka',
        featured: true,
        order: 2,
    },
    {
        _id: 'testimonial-3',
        _type: 'testimonial',
        quote: "Coming home feels like a physical relief now. The space drops your nervous system in a way no previous home achieved.",
        clientName: 'The Banda Family',
        location: 'Roma, Lusaka',
        featured: true,
        order: 3,
    },
]

// ───── ABOUT PAGE ─────
const about = {
    _id: 'about',
    _type: 'about',
    headline: "Design is more than aesthetic; it's problem-solving with beauty.",
    bio: "I'm Kas, the principal designer and founder of Axis Living. For over 5 years, I've been transforming residential and commercial spaces across Lusaka and beyond. From intimate apartment refreshes to full-scale builds for clients who refuse to compromise on beauty.\n\nMy approach sits at the intersection of function and feeling. Every room I design begins with a deep understanding of the person who will live or work in it, their rhythms, their aesthetics, their aspirations. The result is always spaces that feel inevitable, like they couldn't have been any other way.\n\nI've worked with clients across Lusaka, and I collaborate with a trusted network of craftspeople, suppliers, and architects to deliver work that lasts.",
    philosophy: "Good design isn't decorating. It's problem-solving with beauty. I believe every space has a best version of itself. My job is to find it, and then build it.",
    processSteps: [
        {
            _key: 'step1',
            number: "01",
            title: "Discovery",
            description: "We start with a conversation. I learn about your life, your taste, your non-negotiables, and your budget. No judgement, just listening.",
        },
        {
            _key: 'step2',
            number: "02",
            title: "Concept",
            description: "I develop a full design concept — mood boards, spatial plans, material palettes — and we align before anything is ordered or built.",
        },
        {
            _key: 'step3',
            number: "03",
            title: "Design & Execution",
            description: "I manage procurement, contractor coordination, and quality control so you don’t have to. You stay informed without being overwhelmed.",
        },
        {
            _key: 'step4',
            number: "04",
            title: "The Reveal",
            description: "The moment the space comes together exactly as envisioned. We document everything, walk you through care instructions, and hand over your home.",
        },
    ],
    pressLogos: [
        "Design Digest Africa",
        "Vanguard Style",
        "The Guardian Life",
        "Bella Naija Living",
        "Dezeen",
    ],
    behindStudioTitle: "Behind the Studio",
    behindStudioBody: "Most of what we do happens before anything is bought or built. Site visits, material sourcing trips, vendor negotiations, late-night layout revisions. This is the work behind the work — and it's what separates a space that looks good in photos from one that feels right to live in.",
}

// ───── HOME PAGE ─────
const home = {
    _id: 'home',
    _type: 'home',
    tagline: 'Spaces Designed for the Way You Live',
    heroSubtitle: 'Bespoke interior design for discerning homeowners and forward-thinking businesses across Zambia.',
    aboutSubtitle: 'About Us',
    aboutTitle: 'A Lusaka-based studio for deliberate living.',
    aboutBody: "Axis Living is a Lusaka-based interior design practice working with clients who believe their space should feel like a deliberate choice. We don't do generic. We do yours.",
    aboutButtonText: 'Learn Our Story',
    projectsSubtitle: 'Selected Works',
    projectsTitle: 'The Portfolio',
    projectsButtonText: 'Explore All Projects',
    lookbookSubtitle: 'Free Resource',
    lookbookTitle: 'Get the Lookbook',
    lookbookBody: "Behind the Design is our curated 12-page guide featuring material palettes, spatial planning tips, and an inside look at how we approach every project. It's free.",
    lookbookButtonText: 'Get Free Access',
    journalSubtitle: 'From the Studio',
    journalTitle: 'Thoughts on design, process, and living well',
    journalButtonText: 'Read All Articles',
    preFooterSubtitle: 'Start Your Journey',
    preFooterTitle: "Let's Talk About Your Space.",
    preFooterBody: "Every great space begins with a conversation. Book your free discovery call and let's explore what's possible.",
    preFooterButtonText: 'Book a Free Consultation',
}

// ───── SITE SETTINGS ─────
const siteSettings = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    studioName: 'Axis Living',
    email: 'hello@axisliving.co.zm',
    footerTagline: "Bespoke Interiors, Lusaka",
    footerDescription: "Designing spaces that feel inevitable. We create interiors that are as intentional as they are beautiful, tailored to your life, not a trend.",
    copyrightText: "Axis Living · Bespoke Interiors · Est. 2026",
    instagram: "https://www.instagram.com/axisliving.zm",
    pinterest: "https://pinterest.com",
    navbarLinks: [
        { _key: 'link1', name: "Portfolio", href: "/portfolio" },
        { _key: 'link2', name: "Pricing", href: "/pricing" },
        { _key: 'link3', name: "About", href: "/about" },
        { _key: 'link4', name: "Journal", href: "/journal" },
    ]
}

// ───── SEED FUNCTION ─────
async function seed() {
    console.log('🌱 Starting Sanity seed...\n')

    const allDocs = [...projects, ...posts, ...testimonials, about, home, siteSettings]

    for (const doc of allDocs) {
        try {
            await client.createOrReplace(doc)
            console.log(`  ✅ ${doc._type}: ${doc.title || doc.clientName || doc.studioName || doc._id}`)
        } catch (err) {
            console.error(`  ❌ ${doc._type} ${doc._id}: ${err.message}`)
        }
    }

    console.log(`\n🎉 Seed complete! ${allDocs.length} documents created/updated.`)
    console.log('\n📌 Note: Images are not included in this seed.')
    console.log('   Upload cover images through the Sanity Studio UI.')
}

seed()
