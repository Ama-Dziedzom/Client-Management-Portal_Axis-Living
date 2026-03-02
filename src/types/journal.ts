export interface PostContentBlock {
    type: "paragraph" | "heading" | "cta";
    text: string;
    buttonText?: string;
    buttonLink?: string;
}

export interface Post {
    id: number;
    slug: string;
    title: string;
    category: string;
    readTime: string;
    publishedAt: string;
    excerpt: string;
    coverImage: string | null;
    featured: boolean;
    tags: string[];
    content: PostContentBlock[];
}
