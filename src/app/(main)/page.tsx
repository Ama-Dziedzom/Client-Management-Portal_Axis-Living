import HomeClient from "./HomeClient";
import { fetchFeaturedProjects, fetchFeaturedPosts, fetchSiteSettings, fetchTestimonials, fetchHomeData } from "@/lib/data";

export default async function HomePage() {
    const featuredProjects = await fetchFeaturedProjects();
    const featuredPosts = await fetchFeaturedPosts();
    const homeData = await fetchHomeData();
    const siteSettings = await fetchSiteSettings();
    const testimonials = await fetchTestimonials();

    // Combine site settings and home-specific data
    const combinedSettings = { ...(siteSettings || {}), ...(homeData || {}) };

    return (
        <HomeClient
            featuredProjects={featuredProjects}
            featuredPosts={featuredPosts}
            siteSettings={combinedSettings}
            testimonials={testimonials}
        />
    );
}
