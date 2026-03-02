// ───── Portfolio Projects ─────

export const projectsQuery = `
  *[_type == "project"] | order(_createdAt desc) {
    _id, title, slug, location, category,
    style, year, featured, coverImage, tags
  }
`

export const featuredProjectsQuery = `
  *[_type == "project" && featured == true]
  | order(_createdAt desc)[0...3] {
    _id, title, slug, location,
    category, style, coverImage
  }
`

export const projectBySlugQuery = `
  *[_type == "project" && slug.current == $slug][0] {
    _id, title, slug, location, category, style,
    year, coverImage, gallery,
    briefHeading, briefBody,
    approachHeading, approachBody,
    resultHeading, resultBody
  }
`

// ───── Journal Posts ─────

export const postsQuery = `
  *[_type == "post"] | order(publishedAt desc) {
    _id, title, slug, category, readTime,
    publishedAt, excerpt, featured, coverImage, tags
  }
`

export const featuredPostsQuery = `
  *[_type == "post" && featured == true]
  | order(publishedAt desc) {
    _id, title, slug, category, readTime,
    publishedAt, excerpt, featured, coverImage, tags
  }
`

export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    _id, title, slug, category, readTime,
    publishedAt, excerpt, coverImage, tags, body
  }
`

export const relatedPostsQuery = `
  *[_type == "post" && slug.current != $slug]
  | order(publishedAt desc)[0...$limit] {
    _id, title, slug, category, readTime,
    publishedAt, excerpt, coverImage, tags
  }
`

// ───── Pricing ─────

export const pricingQuery = `
  *[_type == "pricing"] | order(order asc) {
    _id, tierName, startingPrice,
    popular, bestFor, inclusions
  }
`

// ───── Testimonials ─────

export const testimonialsQuery = `
  *[_type == "testimonial" && featured == true]
  | order(order asc) {
    _id, quote, clientName, location
  }
`

// ───── About ─────

export const aboutQuery = `
  *[_type == "about"][0] {
    headline, bio, philosophy,
    portrait, processSteps, pressLogos
  }
`

// ───── Site Settings ─────

export const siteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    studioName, tagline, heroSubtitle, heroImage,
    email, instagram, pinterest,
    calendlyUrl, footerTagline
  }
`
