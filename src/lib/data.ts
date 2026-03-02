/**
 * Sanity data fetchers with static fallback.
 *
 * Each function tries Sanity first. If Sanity returns empty results
 * (CMS not populated yet, or images missing), it falls back to the
 * static data files so the site always renders.
 */

import { client, urlFor } from './sanity'
import {
    projectsQuery,
    featuredProjectsQuery,
    projectBySlugQuery,
    postsQuery,
    featuredPostsQuery,
    postBySlugQuery,
    relatedPostsQuery,
    testimonialsQuery,
    siteSettingsQuery,
    aboutQuery,
    homeQuery,
} from './queries'

// Static fallbacks
import { projects as staticProjects, getFeaturedProjects, getProjectBySlug, getRelatedProjects } from '../data/projects'
import { posts as staticPosts, getFeaturedPosts, getPostBySlug, getRelatedPosts } from '../data/journal'

// ───── Projects ─────

export async function fetchProjects() {
    try {
        const sanityProjects = await client.fetch(projectsQuery)
        if (sanityProjects && sanityProjects.length > 0) {
            return sanityProjects.map(normaliseSanityProject)
        }
    } catch (e) {
        console.warn('Sanity fetch failed for projects, using static fallback', e)
    }
    return staticProjects
}

export async function fetchFeaturedProjects() {
    try {
        const sanityProjects = await client.fetch(featuredProjectsQuery)
        if (sanityProjects && sanityProjects.length > 0) {
            return sanityProjects.map(normaliseSanityProject)
        }
    } catch (e) {
        console.warn('Sanity fetch failed for featured projects, using static fallback', e)
    }
    return getFeaturedProjects()
}

export async function fetchProjectBySlug(slug: string) {
    try {
        const project = await client.fetch(projectBySlugQuery, { slug })
        if (project) return normaliseSanityProjectDetail(project)
    } catch (e) {
        console.warn('Sanity fetch failed for project by slug, using static fallback', e)
    }
    return getProjectBySlug(slug)
}

export async function fetchRelatedProjects(currentSlug: string, limit = 2) {
    // For now, related projects always use static data
    // (Sanity query for related is complex — we can enhance later)
    return getRelatedProjects(currentSlug, limit)
}

// ───── Posts ─────

export async function fetchPosts() {
    try {
        const sanityPosts = await client.fetch(postsQuery)
        if (sanityPosts && sanityPosts.length > 0) {
            return sanityPosts.map(normaliseSanityPost)
        }
    } catch (e) {
        console.warn('Sanity fetch failed for posts, using static fallback', e)
    }
    return staticPosts
}

export async function fetchFeaturedPosts() {
    try {
        const sanityPosts = await client.fetch(featuredPostsQuery)
        if (sanityPosts && sanityPosts.length > 0) {
            return sanityPosts.map(normaliseSanityPost)
        }
    } catch (e) {
        console.warn('Sanity fetch failed for featured posts, using static fallback', e)
    }
    return getFeaturedPosts()
}

export async function fetchPostBySlug(slug: string) {
    try {
        const post = await client.fetch(postBySlugQuery, { slug })
        if (post) return normaliseSanityPostDetail(post)
    } catch (e) {
        console.warn('Sanity fetch failed for post by slug, using static fallback', e)
    }
    return getPostBySlug(slug)
}

export async function fetchRelatedPosts(currentSlug: string, limit = 2) {
    try {
        const posts = await client.fetch(relatedPostsQuery, { slug: currentSlug, limit })
        if (posts && posts.length > 0) {
            return posts.map(normaliseSanityPost)
        }
    } catch (e) {
        console.warn('Sanity fetch failed for related posts, using static fallback', e)
    }
    return getRelatedPosts(currentSlug, limit)
}

// ───── Testimonials ─────

export async function fetchTestimonials() {
    try {
        const testimonials = await client.fetch(testimonialsQuery)
        if (testimonials && testimonials.length > 0) return testimonials
    } catch (e) {
        console.warn('Sanity fetch failed for testimonials, using static fallback', e)
    }
    // Static fallback — these are hardcoded in the homepage currently
    return null // Signals to use inline static data
}

// ───── Site Settings ─────

export async function fetchHomeData() {
    try {
        const home = await client.fetch(homeQuery)
        if (home) {
            return {
                ...home,
                heroImage: home.heroImage?.asset ? urlFor(home.heroImage).url() : null,
                aboutSection: {
                    subtitle: home.aboutSubtitle,
                    title: home.aboutTitle,
                    body: home.aboutBody,
                    image: home.aboutImage?.asset ? urlFor(home.aboutImage).url() : null,
                    buttonText: home.aboutButtonText
                },
                projectsSection: {
                    subtitle: home.projectsSubtitle,
                    title: home.projectsTitle,
                    buttonText: home.projectsButtonText
                },
                lookbookSection: {
                    subtitle: home.lookbookSubtitle,
                    title: home.lookbookTitle,
                    body: home.lookbookBody,
                    buttonText: home.lookbookButtonText
                },
                journalSection: {
                    subtitle: home.journalSubtitle,
                    title: home.journalTitle,
                    buttonText: home.journalButtonText
                },
                preFooterSection: {
                    subtitle: home.preFooterSubtitle,
                    title: home.preFooterTitle,
                    body: home.preFooterBody,
                    image: home.preFooterImage?.asset ? urlFor(home.preFooterImage).url() : null,
                    buttonText: home.preFooterButtonText
                }
            }
        }
    } catch (e) {
        console.warn('Sanity fetch failed for home data, using static fallback', e)
    }
    return null
}

export async function fetchSiteSettings() {
    try {
        const settings = await client.fetch(siteSettingsQuery)
        if (settings) {
            return {
                ...settings,
                headerLogo: settings.headerLogo?.asset ? urlFor(settings.headerLogo).url() : null,
                footerLogo: settings.footerLogo?.asset ? urlFor(settings.footerLogo).url() : null,
            }
        }
    } catch (e) {
        console.warn('Sanity fetch failed for site settings, using static fallback', e)
    }
    return null
}

export async function fetchAboutData() {
    try {
        const about = await client.fetch(aboutQuery)
        if (about) {
            return {
                ...about,
                portrait: about.portrait?.asset ? urlFor(about.portrait).url() : null
            }
        }
    } catch (e) {
        console.warn('Sanity fetch failed for about data, using static fallback', e)
    }
    return null
}

// ───── Normalisers ─────
// Transform Sanity document shape → static data shape
// so client components don't need to change

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normaliseSanityProject(doc: any) {
    return {
        id: doc._id,
        slug: doc.slug?.current || doc.slug,
        title: doc.title,
        location: doc.location,
        category: doc.category,
        style: doc.style,
        year: doc.year,
        coverImage: doc.coverImage?.asset ? urlFor(doc.coverImage).url() : null,
        featured: doc.featured,
        tags: doc.tags || [],
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normaliseSanityProjectDetail(doc: any) {
    return {
        id: doc._id,
        slug: doc.slug?.current || doc.slug,
        title: doc.title,
        location: doc.location,
        category: doc.category,
        style: doc.style,
        year: doc.year,
        coverImage: doc.coverImage?.asset ? urlFor(doc.coverImage).url() : null,
        gallery: (doc.gallery || []).map((img: any) => img?.asset ? urlFor(img).url() : null).filter(Boolean),
        tags: doc.tags || [],
        featured: doc.featured ?? false,
        brief: { heading: doc.briefHeading || '', body: doc.briefBody || '' },
        approach: { heading: doc.approachHeading || '', body: doc.approachBody || '' },
        result: { heading: doc.resultHeading || '', body: doc.resultBody || '' },
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normaliseSanityPost(doc: any) {
    return {
        id: doc._id,
        slug: doc.slug?.current || doc.slug,
        title: doc.title,
        category: doc.category,
        readTime: doc.readTime,
        publishedAt: doc.publishedAt,
        excerpt: doc.excerpt,
        coverImage: doc.coverImage?.asset ? urlFor(doc.coverImage).url() : null,
        featured: doc.featured,
        tags: doc.tags || [],
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normaliseSanityPostDetail(doc: any) {
    // Convert Sanity portable text body → the simple content array format
    // that PostDetailClient expects
    const content = (doc.body || [])
        .filter((block: any) => block._type === 'block')
        .map((block: any) => {
            const text = (block.children || []).map((c: any) => c.text).join('')
            if (block.style === 'h2' || block.style === 'h3') {
                return { type: 'heading' as const, text }
            }
            return { type: 'paragraph' as const, text }
        })

    return {
        id: doc._id,
        slug: doc.slug?.current || doc.slug,
        title: doc.title,
        category: doc.category,
        readTime: doc.readTime,
        publishedAt: doc.publishedAt,
        excerpt: doc.excerpt,
        coverImage: doc.coverImage?.asset ? urlFor(doc.coverImage).url() : null,
        featured: doc.featured ?? false,
        tags: doc.tags || [],
        content,
    }
}
