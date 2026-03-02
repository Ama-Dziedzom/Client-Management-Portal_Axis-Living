export interface ProjectSection {
    heading: string;
    body: string;
}

export interface Project {
    id: number;
    slug: string;
    title: string;
    location: string;
    style: string;
    category: string;
    year: string;
    coverImage: string | null;
    gallery: (string | null)[];
    tags: string[];
    featured: boolean;
    brief: ProjectSection;
    approach: ProjectSection;
    result: ProjectSection;
}
