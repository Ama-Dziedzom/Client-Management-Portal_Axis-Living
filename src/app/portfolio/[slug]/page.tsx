import { Metadata } from "next";
import ProjectDetailClient from "./ProjectDetailClient";
import { getProjectBySlug, getRelatedProjects } from "../../../data/projects";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) return { title: "Project Not Found" };

    return {
        title: `${project.title} | Axis Living Portfolio`,
        description: project.brief.body,
        openGraph: {
            images: [project.coverImage],
        },
    };
}

export default async function ProjectDetailPage({ params }: Props) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) notFound();

    const relatedProjects = getRelatedProjects(project.slug, 2);

    return <ProjectDetailClient project={project} relatedProjects={relatedProjects} />;
}
