import HomeClient from "./HomeClient";
import { fetchFeaturedProjects, fetchFeaturedPosts } from "../lib/data";

export default async function HomePage() {
    const featuredProjects = await fetchFeaturedProjects();
    const featuredPosts = await fetchFeaturedPosts();

    return <HomeClient featuredProjects={featuredProjects} featuredPosts={featuredPosts} />;
}
