import { Project } from "../types/project";

export const projects: Project[] = [
    {
        id: 1,
        slug: "the-mwansa-residence",
        title: "The Mwansa Residence",
        location: "Kabulonga, Lusaka",
        category: "Residential",
        style: "Contemporary",
        year: "2024",
        coverImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400&q=85",
            "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1400&q=85",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=85",
            "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1400&q=85",
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=85",
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=85"
        ],
        tags: ["Contemporary", "Residential", "Full Home"],
        featured: true,

        brief: {
            heading: "The Client Brief",
            body: "The Mwansa family had just completed a four-bedroom home in Kabulonga and wanted an interior that reflected their dual sensibility — globally cultured but deeply rooted in Zambian identity. They wanted warmth without being traditional, modernity without being cold. The brief was clear: make it feel like us, not like a hotel."
        },
        approach: {
            heading: "The Design Approach",
            body: "We anchored the entire home in a palette of warm terracotta, aged brass, and deep forest green — colours that echo the Zambian landscape while reading as unmistakably contemporary. Custom furniture pieces were sourced from local artisans in Lusaka and combined with carefully selected European finishes. Every room was designed around a single hero moment: a hand-plastered feature wall in the living room, a ceiling installation in the primary bedroom, a bespoke kitchen island in book-matched marble."
        },
        result: {
            heading: "The Result",
            body: "A home that stops guests at the door. The Mwansas describe it as the first time a space has truly felt like theirs. The living areas flow naturally into one another while maintaining distinct personalities, and the African art collection they'd accumulated over years finally has a home worthy of it. We documented the full project for an upcoming feature in a regional design publication."
        }
    },

    {
        id: 2,
        slug: "haven-wellness-studio",
        title: "Haven Wellness Studio",
        location: "Woodlands, Lusaka",
        category: "Commercial",
        style: "Minimalist",
        year: "2024",
        coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=85",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=85",
            "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1400&q=85",
            "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1400&q=85",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=85",
            "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1400&q=85"
        ],
        tags: ["Minimalist", "Commercial", "Wellness"],
        featured: true,

        brief: {
            heading: "The Client Brief",
            body: "Haven is a boutique wellness studio offering yoga, sound healing, and breathwork sessions to Lusaka's professional class. The founder came to us with a single instruction: when someone walks in, they should immediately feel their shoulders drop. The 1,800 sq ft space in Woodlands needed to communicate calm, premium quality, and intentionality — without feeling clinical or austere."
        },
        approach: {
            heading: "The Design Approach",
            body: "We stripped everything back. The intervention was largely subtractive — removing visual noise to let the architecture breathe. Natural Japanese white oak flooring runs throughout. Walls were hand-finished in a warm limewash plaster that catches light differently throughout the day. We introduced biophilic elements — a living moss wall at reception, potted fiddle leaf figs in the practice rooms, and skylights cut into the ceiling above the main studio. Every material was chosen to engage the senses: rough textures against smooth, warm light against cool stone."
        },
        result: {
            heading: "The Result",
            body: "Haven opened to a fully-booked first month, with multiple clients citing the space itself as the reason they signed up for memberships. The founder has since been approached by two hospitality groups wanting to replicate the aesthetic for their properties. The design has been featured on three interior design blogs and was shortlisted for a commercial interiors award."
        }
    },

    {
        id: 3,
        slug: "the-banda-apartment",
        title: "The Banda Apartment",
        location: "Roma, Lusaka",
        category: "Residential",
        style: "Japandi",
        year: "2023",
        coverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=85",
            "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=1400&q=85",
            "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1400&q=85",
            "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1400&q=85",
            "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1400&q=85",
            "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=1400&q=85"
        ],
        tags: ["Japandi", "Residential", "Apartment"],
        featured: false,

        brief: {
            heading: "The Client Brief",
            body: "Mutale Banda is a 34-year-old creative director who travels frequently between Lusaka and Tokyo for work. She wanted her Roma apartment to feel like a personal sanctuary — a deliberate counterpoint to the noise of her career. Her references were equal parts Japanese wabi-sabi and Scandinavian hygge. She wanted stillness she could come home to."
        },
        approach: {
            heading: "The Design Approach",
            body: "Japandi — the design language born from the overlap between Japanese and Scandinavian aesthetics — was the perfect framework. We worked in a tight palette of warm whites, nude plaster, natural rattan, and charcoal. Custom low-profile furniture was built locally to our specifications. Storage was designed to be invisible — every object that remained in view was there because it deserved to be. We introduced a small tatami-adjacent reading nook with a floor-to-ceiling linen curtain that creates a room-within-a-room effect Mutale now calls her favourite place in Lusaka."
        },
        result: {
            heading: "The Result",
            body: "Mutale told us she cried when she walked in for the reveal. The apartment, once a generic two-bedroom with builder-grade finishes, now reads as a considered, deeply personal space. She's since referred three colleagues. The reading nook has become something of a design conversation piece — we've been asked about it specifically by four subsequent clients who saw it on Instagram."
        }
    },

    {
        id: 4,
        slug: "longacres-penthouse",
        title: "Longacres Penthouse",
        location: "Longacres, Lusaka",
        category: "Residential",
        style: "Maximalist",
        year: "2023",
        coverImage: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=1400&q=85",
            "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1400&q=85",
            "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1400&q=85",
            "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1400&q=85",
            "https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=1400&q=85",
            "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1400&q=85"
        ],
        tags: ["Maximalist", "Residential", "Penthouse"],
        featured: true,

        brief: {
            heading: "The Client Brief",
            body: "Our client — a senior partner at a pan-African law firm — had spent 20 years living in what he called 'safe' interiors. He'd recently acquired a penthouse in Longacres and wanted, in his words, 'to finally be brave.' He had an extensive collection of African contemporary art, a love of deep colour, and the conviction that his home should feel nothing like anyone else's. Budget was not the primary constraint. Boldness was the brief."
        },
        approach: {
            heading: "The Design Approach",
            body: "We leaned in. The living room was anchored by a custom 4-metre sofa in deep teal velvet, facing floor-to-ceiling windows overlooking the city. Walls were treated in a dramatic dark olive limewash — a backdrop that made the art collection sing. We mixed antique Moroccan brass lanterns with custom contemporary lighting, layered multiple rugs in the dining area, and used rich jewel tones — emerald, burnt sienna, indigo — across the five-bedroom layout. Every room has a different personality but they speak the same visual language: opulent, confident, African."
        },
        result: {
            heading: "The Result",
            body: "The penthouse has since hosted a private art exhibition and two editorial shoots. Our client describes dinner parties there as 'events' in a way they never were before. The project marked our most ambitious residential commission to date and established our capability in high-end maximalist work — a portfolio category that has since generated three new enquiries from clients in the same tier."
        }
    }
];

// Helper functions
export const getFeaturedProjects = () => projects.filter(p => p.featured);
export const getProjectBySlug = (slug: string) => projects.find(p => p.slug === slug);
export const getProjectsByCategory = (category: string) => projects.filter(p => p.category === category);
export const getProjectsByStyle = (style: string) => projects.filter(p => p.style === style);
export const getRelatedProjects = (currentSlug: string, limit = 2) =>
    projects.filter(p => p.slug !== currentSlug).slice(0, limit);
