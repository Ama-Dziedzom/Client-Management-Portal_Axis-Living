"use client";

import Image from "next/image";
import { ArrowLeft, MapPin, Tag, ChevronDown, Quote } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import LinkNext from "next/link";
import { Project } from "../../../types/project";
import { useRef, useState } from "react";

interface ProjectDetailClientProps {
    project: Project;
    relatedProjects: Project[];
}

const fadeInUpSettings = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" as const }
};

const ProjectDetailClient = ({ project, relatedProjects }: ProjectDetailClientProps) => {
    const [heroElement, setHeroElement] = useState<HTMLElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: heroElement ? { current: heroElement } : undefined,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    return (
        <div className="bg-background min-h-screen">
            {/* Hero Section */}
            <section ref={setHeroElement} className="relative h-screen w-full overflow-hidden">
                <motion.div style={{ y }} className="absolute inset-0">
                    <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        className="object-cover brightness-75 scale-105"
                        priority
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10 flex flex-col justify-end p-8 md:p-24">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="max-w-4xl"
                    >
                        <LinkNext href="/portfolio" className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-6 py-2 rounded-full text-xs uppercase tracking-widest inline-flex items-center mb-8 gap-3 border border-white/20 group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Portfolio
                        </LinkNext>
                        <h1 className="text-6xl md:text-9xl font-heading text-white leading-[1.15] mb-10 tracking-wide">{project.title}</h1>
                        <div className="flex flex-wrap items-center gap-12 text-white/70 uppercase tracking-[0.2em] text-[10px] md:text-xs">
                            <div className="flex items-center gap-3"><MapPin size={18} className="text-accent" /> {project.location}</div>
                            <div className="flex items-center gap-3"><Tag size={18} className="text-accent" /> {project.style} · {project.category}</div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white z-20"
                >
                    <ChevronDown size={32} />
                </motion.div>
            </section>

            {/* Editorial Content */}
            <section className="py-24 px-6 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-24">
                        {/* Left Column: Brief & Result */}
                        <div className="md:col-span-8 flex flex-col gap-20">
                            <motion.div
                                {...fadeInUpSettings}
                            >
                                <span className="text-accent text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-4 block">{project.brief.heading}</span>
                                <h2 className="text-3xl md:text-5xl font-heading mb-8 font-light leading-[1.25] tracking-wide">The Story Behind the Space</h2>
                                <p className="text-foreground/70 text-lg md:text-xl leading-relaxed max-w-2xl font-body">
                                    {project.brief.body}
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <motion.div
                                    {...fadeInUpSettings}
                                    className="bg-accent/5 p-12 lg:p-16 border border-accent/10 rounded-sm"
                                >
                                    <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block underline decoration-accent/30 underline-offset-8">{project.approach.heading}</span>
                                    <p className="text-foreground/80 leading-relaxed font-body">
                                        {project.approach.body}
                                    </p>
                                </motion.div>
                                <motion.div
                                    {...fadeInUpSettings}
                                    className="relative aspect-square grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
                                >
                                    <Image
                                        src={project.gallery[1]}
                                        alt="Process and Texture"
                                        fill
                                        className="object-cover"
                                    />
                                </motion.div>
                            </div>

                            <motion.div
                                {...fadeInUpSettings}
                            >
                                <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">{project.result.heading}</span>
                                <h3 className="text-3xl md:text-4xl font-heading mb-6 tracking-wide leading-[1.2]">The Final Outcome</h3>
                                <p className="text-foreground/70 text-lg md:text-xl leading-relaxed max-w-2xl font-body mb-10">
                                    {project.result.body}
                                </p>
                                <div className="h-[700px] relative mt-16 group overflow-hidden">
                                    <Image
                                        src={project.gallery[2]}
                                        alt="Final Result Preview"
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column: Sidebar CTA */}
                        <div className="md:col-span-4 sticky top-32 h-fit bg-foreground p-12 text-white rounded-sm shadow-2xl hidden md:block border-t-8 border-accent">
                            <Quote className="text-accent mb-8 opacity-40" size={40} />
                            <h4 className="text-2xl font-heading mb-8 leading-[1.3] tracking-wide">
                                "A project that redefined our expectations. A pure labor of artistic vision and functional design."
                            </h4>
                            <div className="space-y-6 pt-6 border-t border-white/10">
                                <p className="text-sm opacity-60 uppercase tracking-widest font-bold">Inspired by this project?</p>
                                <LinkNext
                                    href="/booking"
                                    className="w-full bg-accent text-white py-5 rounded-full text-center flex items-center justify-center font-bold tracking-[0.2em] uppercase text-xs hover:bg-white hover:text-accent transition-all"
                                >
                                    Request Consultation
                                </LinkNext>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Large Spread Gallery */}
            <section className="bg-foreground py-32 overflow-hidden">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-24">
                    <span className="text-accent/50 text-xs font-bold uppercase tracking-widest mb-16 block text-center">Gallery Spread</span>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        <div className="md:col-span-7 h-[600px] relative shadow-2xl">
                            <Image src={project.gallery[0] || ""} alt="Gallery Item 1" fill className="object-cover" />
                        </div>
                        <div className="md:col-span-5 flex flex-col gap-8 h-full justify-center">
                            <div className="h-[280px] relative grayscale shadow-xl">
                                <Image src={project.gallery[1] || ""} alt="Gallery Item 2" fill className="object-cover" />
                            </div>
                            <div className="h-[280px] relative shadow-xl">
                                <Image src={project.gallery[2] || ""} alt="Gallery Item 3" fill className="object-cover" />
                            </div>
                        </div>
                    </div>
                    {project.gallery.length > 3 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                            {project.gallery.slice(3).map((img, idx) => (
                                <div key={idx} className={`h-[350px] relative shadow-xl ${idx === 1 ? 'grayscale hover:grayscale-0 transition-all duration-700' : ''}`}>
                                    <Image src={img} alt={`Gallery Item ${idx + 4}`} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Suggested Projects */}
            <section className="py-24 px-6 lg:px-24 bg-background border-t border-foreground/5">
                <div className="max-w-7xl mx-auto">
                    <h5 className="text-xl md:text-2xl font-heading mb-16 uppercase tracking-[0.4em] text-foreground/40 text-center">You May Also Like</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {relatedProjects.map((p: Project) => (
                            <LinkNext key={p.id} href={`/portfolio/${p.slug}`} className="group flex flex-col items-center">
                                <div className="w-full aspect-[16/6] relative overflow-hidden mb-6 rounded-sm">
                                    <Image src={p.coverImage} alt={p.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-accent/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-center p-4">
                                        <h6 className="text-white text-xl md:text-2xl font-heading mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">{p.title}</h6>
                                        <span className="text-white border-b border-white text-[10px] font-bold tracking-widest uppercase pb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">View Project</span>
                                    </div>
                                </div>
                                <span className="text-foreground/40 text-[10px] tracking-widest uppercase mt-3">{p.location}</span>
                            </LinkNext>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA for Mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-6 z-40 bg-background/80 backdrop-blur-lg border-t border-foreground/5">
                <LinkNext
                    href="/booking"
                    className="w-full bg-accent text-white py-5 rounded-full text-center flex items-center justify-center font-bold tracking-[0.2em] uppercase text-xs"
                >
                    Book a Consultation
                </LinkNext>
            </div>
        </div>
    );
};

export default ProjectDetailClient;
