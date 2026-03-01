import { Post } from "../types/journal";

export const posts: Post[] = [
    {
        id: 1,
        slug: "how-to-choose-your-interior-design-style",
        title: "How to Choose Your Interior Design Style (Without Regret)",
        category: "Design Guides",
        readTime: "6 min read",
        publishedAt: "2024-10-14",
        excerpt: "Most people pick a style they love on Pinterest and end up living in a space that feels like a showroom. Here's how to find the aesthetic that actually fits your life.",
        coverImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80",
        featured: true,
        tags: ["Design Tips", "Getting Started", "Style"],
        content: [
            {
                type: "paragraph",
                text: "The most common mistake we see from new clients is choosing an aesthetic before understanding how they actually live. They fall in love with a minimalist Japanese interior on Instagram — all clean lines and negative space — and then they have three kids, a dog, and a husband who collects vintage cameras. The minimalist interior lasts about four months."
            },
            {
                type: "heading",
                text: "Start With Function, Not Feeling"
            },
            {
                type: "paragraph",
                text: "Before you open Pinterest, answer these questions honestly: How many people live in this space? Do you entertain frequently or prefer intimate gatherings? Do you work from home? Do you have children or pets? Are you a natural minimalist or do you love having your collections and memories on display? The answers will eliminate at least half the aesthetic options immediately — and that's a good thing."
            },
            {
                type: "heading",
                text: "The Three Styles Most Zambians Actually Live Well In"
            },
            {
                type: "paragraph",
                text: "After years of projects across Lusaka and the Copperbelt, we've noticed patterns. Contemporary African works for almost everyone — it's warm, it's personal, it ages well, and it gets better as you add art and objects over time. Japandi works beautifully for professionals who travel frequently and want a home that resets them. Maximalism works for collectors, entertainers, and people who find sparse spaces anxiety-inducing rather than calming. Knowing which category you fall into is half the decision."
            },
            {
                type: "heading",
                text: "The Test We Give Every New Client"
            },
            {
                type: "paragraph",
                text: "We ask clients to send us 10 photos of spaces they love — not from interior design accounts, but from anywhere. Hotels they've stayed in. Restaurants they return to. A friend's house they always feel good in. The patterns that emerge from those 10 photos tell us more about their real aesthetic than any style quiz ever could."
            },
            {
                type: "cta",
                text: "Not sure where to start? Book a free discovery call and we'll help you figure it out.",
                buttonText: "Book a Call",
                buttonLink: "/booking"
            }
        ]
    },
    {
        id: 2,
        slug: "why-zambian-homes-should-embrace-african-art",
        title: "Why Your Home Needs African Art (And How to Hang It)",
        category: "Art & Culture",
        readTime: "5 min read",
        publishedAt: "2024-09-02",
        excerpt: "African contemporary art is having a global moment. But beyond the market buzz, there's a more personal reason to live with it — and a right and wrong way to display it.",
        coverImage: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&q=80",
        featured: true,
        tags: ["Art", "African Design", "Styling"],
        content: [
            {
                type: "paragraph",
                text: "We've noticed something over the years: the homes that feel the most alive are almost always the ones with original art on the walls. Not prints. Not poster frames from a furniture store. Original works — paintings, sculptures, textiles — by artists who made something with intention."
            },
            {
                type: "heading",
                text: "The Market Argument (And Why It's Not the Point)"
            },
            {
                type: "paragraph",
                text: "Yes, African contemporary art has appreciated significantly in value over the last decade. Artists like Njideka Akunyili Crosby, Toyin Ojih Odutola, and Omar Ba now command prices that would have been unthinkable fifteen years ago. But buying art as investment is the wrong starting point for a home. Buy what moves you first. The value will take care of itself."
            },
            {
                type: "heading",
                text: "How to Hang It Without Getting It Wrong"
            },
            {
                type: "paragraph",
                text: "The single most common mistake: hanging art too high. Eye level means the centre of the piece at roughly 145-150cm from the floor — not the top of the frame at ceiling height. Group smaller pieces in odd numbers. Let large pieces breathe — don't crowd them with furniture pushed directly underneath. And resist the urge to match: art should contrast with its surroundings, not blend in."
            },
            {
                type: "cta",
                text: "Want help integrating your art collection into a new design? Let's talk.",
                buttonText: "Book a Consultation",
                buttonLink: "/booking"
            }
        ]
    },
    {
        id: 3,
        slug: "interior-design-budget-guide-zambia",
        title: "What Does Interior Design Actually Cost in Zambia?",
        category: "Budgeting",
        readTime: "8 min read",
        publishedAt: "2024-08-19",
        excerpt: "The question everyone has but few ask openly. We break down real costs, common budget mistakes, and how to get the most from whatever you're working with.",
        coverImage: "https://images.unsplash.com/photo-1554469384-e58fac937c8b?w=1200&q=80",
        featured: false,
        tags: ["Budgeting", "Getting Started", "Zambia"],
        content: [
            {
                type: "paragraph",
                text: "Budget is the conversation nobody wants to have first. Clients worry they'll be judged for their number. Designers worry they'll scare clients off. The result is a lot of vague early conversations that waste everyone's time. We'd rather just be direct."
            },
            {
                type: "heading",
                text: "The Honest Numbers"
            },
            {
                type: "paragraph",
                text: "A single room refresh — new furniture, lighting, soft furnishings, styling — done properly in Lusaka starts at around K15,000 and can go to K45,000 depending on material choices. A full apartment redesign (3-4 rooms, including kitchen and bathrooms) typically runs between K65,000 and K220,000. A full build or developer collaboration starts at K170,000 and scales with scope and finish level."
            },
            {
                type: "heading",
                text: "Where People Overspend (And Where They Shouldn't Cut)"
            },
            {
                type: "paragraph",
                text: "Overspend: imported furniture that ships slowly, arrives damaged, and depreciates the moment it lands. Undersupport: lighting. Nothing transforms a space faster than good lighting and nothing kills a beautiful room faster than bad lighting. It is never the place to cut corners. Same goes for upholstery fabric — cheap fabric looks cheap within a year."
            },
            {
                type: "heading",
                text: "The 60/30/10 Rule We Actually Use"
            },
            {
                type: "paragraph",
                text: "For most residential projects we allocate roughly 60% of the budget to large furniture and fixed elements, 30% to lighting and soft furnishings, and 10% to art, accessories, and styling. This ratio shifts for commercial projects where lighting often takes a larger share. It's a starting framework, not a rule — but it prevents the common mistake of blowing the budget on a sofa and having nothing left for anything else."
            },
            {
                type: "cta",
                text: "Want a realistic estimate for your project? Let's start with a conversation.",
                buttonText: "Book a Free Call",
                buttonLink: "/booking"
            }
        ]
    },
    {
        id: 4,
        slug: "designing-small-apartments-lusaka",
        title: "How to Make a Small Lusaka Apartment Feel Twice the Size",
        category: "Small Spaces",
        readTime: "7 min read",
        publishedAt: "2024-07-30",
        excerpt: "Most apartments in Lusaka are smaller than they should be for the price. Here are the spatial strategies we use on every small-space project to make rooms feel generous.",
        coverImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
        featured: false,
        tags: ["Small Spaces", "Lusaka", "Tips"],
        content: [
            {
                type: "paragraph",
                text: "The most requested thing we hear from Lusaka clients: make it feel bigger. Land is expensive, builds are dense, and a lot of people are living in 60-80 sqm apartments that need to do a lot of work. The good news is that spatial generosity is mostly a design problem, not a square footage problem."
            },
            {
                type: "heading",
                text: "Vertical Space Is Almost Always Wasted"
            },
            {
                type: "paragraph",
                text: "Most Lusaka apartments have ceilings between 2.7m and 3.2m. Most furniture stops at 2m. That gap between the top of your bookshelf and the ceiling is dead space that makes rooms feel low and cluttered simultaneously. Floor-to-ceiling storage, tall curtains hung from ceiling height (not window height), and vertical artwork all draw the eye up and make the room feel taller and more spacious."
            },
            {
                type: "heading",
                text: "The One Furniture Rule That Changes Everything"
            },
            {
                type: "paragraph",
                text: "In a small space, choose fewer pieces of better quality rather than many pieces of modest quality. A room with four well-chosen pieces reads as curated and spacious. The same room with eight modest pieces reads as cluttered, regardless of how good each individual piece is. Restraint is a spatial strategy."
            },
            {
                type: "heading",
                text: "Mirrors, Light, and the Illusion of Depth"
            },
            {
                type: "paragraph",
                text: "A large mirror on the wall opposite your main window effectively doubles the perceived width of a room. Warm lighting in corners (rather than a single central ceiling light) creates depth and shadow that makes spaces feel more three-dimensional. Light paint colours help but are often overrated — a small room in a deep, confident colour with great lighting can feel more generous than the same room painted white with poor lighting."
            },
            {
                type: "cta",
                text: "Working with a small space in Lusaka? We specialise in this. Let's talk.",
                buttonText: "Book a Consultation",
                buttonLink: "/booking"
            }
        ]
    }
];

export const getFeaturedPosts = (): Post[] => posts.filter(p => p.featured);
export const getPostBySlug = (slug: string): Post | undefined => posts.find(p => p.slug === slug);
export const getPostsByCategory = (category: string): Post[] => posts.filter(p => p.category === category);
export const getRelatedPosts = (currentSlug: string, limit = 2): Post[] =>
    posts.filter(p => p.slug !== currentSlug).slice(0, limit);
