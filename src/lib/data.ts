/**
 * Static data fetchers with Sanity hooks (disabled for now).
 * 
 * Reverting to hardcoded/static data as requested.
 */

import { projects as staticProjects, getFeaturedProjects, getProjectBySlug, getRelatedProjects } from '../data/projects'
import { posts as staticPosts, getFeaturedPosts, getPostBySlug, getRelatedPosts } from '../data/journal'

// ───── Projects ─────

export async function fetchProjects() {
    return staticProjects;
}

export async function fetchFeaturedProjects() {
    return getFeaturedProjects();
}

export async function fetchProjectBySlug(slug: string) {
    return getProjectBySlug(slug);
}

export async function fetchRelatedProjects(currentSlug: string, limit = 2) {
    return getRelatedProjects(currentSlug);
}

// ───── Posts ─────

export async function fetchPosts() {
    return staticPosts;
}

export async function fetchFeaturedPosts() {
    return getFeaturedPosts();
}

export async function fetchPostBySlug(slug: string) {
    return getPostBySlug(slug);
}

export async function fetchRelatedPosts(currentSlug: string, limit = 2) {
    return getRelatedPosts(currentSlug);
}

// ───── Pricing ─────

export async function fetchPricing() {
    return [
        {
            title: "Interior Design Consultation",
            price: "Free",
            description: "A complimentary session to discuss your vision and project requirements.",
            inclusions: [
                "30-minute virtual or in-person meeting",
                "Discussion of your vision, lifestyle & aesthetic preferences",
                "Initial space assessment & recommendations",
                "Overview of our design process & timelines",
                "Custom proposal tailored to your project scope",
                "No obligation, just a conversation about your space",
            ]
        }
    ];
}

// ───── Testimonials ─────

export async function fetchTestimonials() {
    return [
        {
            quote: "Axis Living transformed our house into a home that truly reflects who we are. Their attention to detail and understanding of our lifestyle was exceptional.",
            clientName: "Sarah M.",
            location: "Leopard's Hill"
        },
        {
            quote: "Working with Ama and her team was a breeze. They handled everything from concept to installation with such professionalism and grace.",
            clientName: "David K.",
            location: "Roma Park"
        },
        {
            quote: "The result exceeded all our expectations. Our living space is now both functional and incredibly beautiful.",
            clientName: "Michelle T.",
            location: "New Kasama"
        }
    ];
}

// ───── Site Settings & Home Data ─────

export async function fetchHomeData() {
    return {
        tagline: "DELIBERATE INTERIORS FOR MODERN LIVING",
        heroImage: "/projects/project-1-1.jpg",
        aboutSection: {
            subtitle: "About Us",
            title: "A Lusaka-based studio for deliberate living.",
            body: "We believe that your home should be a reflection of your soul. Our approach combines functional design with timeless aesthetics to create spaces that feel both elevated and lived-in.",
            image: "/projects/project-1-2.jpg",
            buttonText: "Learn Our Story"
        },
        projectsSection: {
            subtitle: "Selected Works",
            title: "The Portfolio",
            buttonText: "Explore All Projects"
        },
        lookbookSection: {
            subtitle: "Free Resource",
            title: "Get the Lookbook",
            body: "Download our curated guide to modern interior styles and start envisioning your dream space today.",
            buttonText: "Get Free Access"
        },
        journalSection: {
            subtitle: "From the Studio",
            title: "Thoughts on design, process, and living well",
            buttonText: "Read All Articles"
        },
        testimonialsSection: {
            subtitle: "Client Stories",
            title: "Designing with Purpose"
        },
        preFooterSection: {
            subtitle: "Start Your Journey",
            title: "Let's Talk About Your Space.",
            body: "Begin your design journey with a complimentary consultation. Tell us about your vision, and we'll help you bring it to life.",
            image: "/projects/project-2-1.jpg",
            buttonText: "Book a Free Consultation"
        }
    };
}

export async function fetchSiteSettings() {
    return {
        studioName: "Axis Living",
        tagline: "Bespoke Interiors",
        email: "hello@axisliving.co.zm",
        phone: "+260 971 251 110",
        address: "Lusaka, Zambia",
        socialLinks: [
            { platform: "Instagram", url: "https://instagram.com/axisliving.zm" },
            { platform: "Pinterest", url: "https://pinterest.com/axisliving" }
        ]
    };
}

export async function fetchAboutData() {
    return {
        heroImage: "/projects/project-1-1.jpg",
        headline: "Deliberate design for elevated living.",
        philosophy: {
            title: "Our Philosophy",
            body: "We believe in the power of intentionality. Every piece we select, every color we choose, and every layout we design is purposed to enhance the quality of your daily life."
        },
        bio: {
            title: "The Vision",
            body: "Founded on the principles of balance and beauty, Axis Living has grown into a studio known for its unique ability to blend contemporary luxury with African heritage.",
            image: "/ama-portrait.jpg"
        },
        studioImages: [
            "/projects/project-1-2.jpg",
            "/projects/project-2-1.jpg",
            "/projects/project-3-1.jpg"
        ],
        processes: [
            { title: "Discovery", description: "Getting to know you and your vision." },
            { title: "Design", description: "Crafting the perfect aesthetic and layout." },
            { title: "Delivery", description: "Bringing the design to life in your space." }
        ],
        press: [
            { name: "Lusaka Times", url: "#" },
            { name: "Zambia Design Week", url: "#" }
        ]
    };
}
