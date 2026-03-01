"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import { getFeaturedProjects } from "../data/projects";
import { Project } from "../types/project";
import { useRef, useState, useEffect } from "react";

const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        }
    }
};

const fadeInUp: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

const pulse: Variants = {
    initial: { scale: 1 },
    animate: {
        scale: [1, 1.05, 1],
        boxShadow: ["0 0 0 0 rgba(201, 168, 76, 0.4)", "0 0 0 15px rgba(201, 168, 76, 0)", "0 0 0 0 rgba(201, 168, 76, 0)"],
        transition: {
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
        }
    }
};

export default function Home() {
    const featuredProjects = getFeaturedProjects();
    const [heroElement, setHeroElement] = useState<HTMLElement | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { scrollYProgress } = useScroll({
        target: heroElement ? { current: heroElement } : undefined,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    if (!mounted) {
        return <div className="min-h-screen bg-background" />;
    }

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section ref={setHeroElement} className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
                <motion.div style={{ y }} className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
                        alt="Luxury Interior Design"
                        fill
                        className="object-cover brightness-50"
                        priority
                    />
                </motion.div>

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <motion.p
                        initial={{ opacity: 0, letterSpacing: "0.2em" }}
                        animate={{ opacity: 1, letterSpacing: "0.5em" }}
                        transition={{ duration: 1 }}
                        className="text-white uppercase text-xs md:text-sm font-bold tracking-[0.5em] mb-6 drop-shadow-md"
                    >
                        Axis Living
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="text-white text-5xl md:text-8xl font-heading mb-10 leading-[1.25] tracking-wide"
                    >
                        Spaces Designed for <br />
                        <span className="italic font-light text-white/90">the Way You Live</span>
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-6"
                    >
                        <motion.div
                            variants={pulse}
                            initial="initial"
                            animate="animate"
                        >
                            <Link
                                href="/booking"
                                className="bg-accent hover:bg-white text-white hover:text-accent px-12 py-5 rounded-full text-sm font-bold tracking-[0.2em] uppercase transition-all shadow-xl block"
                            >
                                Book a Free Consultation
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50"
                >
                    <span className="text-[10px] uppercase tracking-[0.3em] mb-4">Discover More</span>
                    <div className="w-[1px] h-16 bg-white/20 relative">
                        <motion.div
                            animate={{ top: ["0%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute left-0 w-full h-4 bg-accent"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Intro Section */}
            <section className="py-24 px-6 lg:px-24 bg-background overflow-hidden text-foreground">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                        className="md:w-1/2"
                    >
                        <span className="text-accent font-bold tracking-widest uppercase text-xs mb-4 block">About Us</span>
                        <h2 className="text-4xl md:text-6xl font-heading mb-8 leading-[1.2] tracking-wide">
                            A Lusaka-based studio for <span className="italic">deliberate living</span>.
                        </h2>
                        <p className="text-foreground/70 text-lg leading-relaxed mb-8 max-w-xl">
                            Axis Living is a Lusaka-based interior design practice working with clients who believe their space should feel like a deliberate choice. We don&apos;t do generic. We do yours.
                        </p>
                        <Link href="/about" className="inline-flex items-center text-accent font-bold tracking-widest uppercase text-xs group">
                            Learn Our Story <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="md:w-1/2 relative aspect-[4/5] w-full"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop"
                            alt="Axis Living Aesthetic"
                            fill
                            className="object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Featured Projects Grid */}
            <section className="py-24 px-6 lg:px-24 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                        className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4"
                    >
                        <div>
                            <span className="text-accent font-bold tracking-widest uppercase text-xs mb-4 block">Selected Works</span>
                            <h2 className="text-4xl md:text-6xl font-heading tracking-wide leading-[1.2]">The Portfolio</h2>
                        </div>
                        <Link href="/portfolio" className="bg-foreground text-white px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-accent transition-colors">
                            Explore All Projects
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {featuredProjects.map((project: Project) => (
                            <motion.div
                                key={project.id}
                                variants={fadeInUp}
                                className="group cursor-pointer overflow-hidden"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    <Image
                                        src={project.coverImage}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-accent/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center text-center p-6">
                                        <h4 className="text-white text-2xl font-heading mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{project.title}</h4>
                                        <Link
                                            href={`/portfolio/${project.slug}`}
                                            className="text-white border border-white px-8 py-3 text-[10px] tracking-widest uppercase hover:bg-white hover:text-accent transition-all opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                        >
                                            View Project
                                        </Link>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-between items-end">
                                    <div>
                                        <p className="text-accent text-[10px] font-bold uppercase tracking-widest mb-1">{project.category} · {project.style}</p>
                                        <p className="text-foreground/50 text-[10px] uppercase tracking-widest">{project.location}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-6 lg:px-24 bg-background text-foreground">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        <Quote className="mx-auto text-accent mb-8 opacity-20" size={60} />
                        <h2 className="text-3xl md:text-5xl font-heading mb-16 font-light">
                            &ldquo;Working with Axis Living was the best decision we made for our new home.&rdquo;
                        </h2>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left"
                    >
                        {[
                            { name: "Thandiwe M.", role: "Kabulonga", content: "Working with Axis Living was the best decision we made for our new home. She understood our brief immediately and delivered something beyond what we imagined." },
                            { name: "Mulenga C.", role: "Woodlands", content: "The professionalism, the communication, the final result — everything was five stars. Our office has never felt more like us." },
                            { name: "Chilufya B.", role: "Roma", content: "I've worked with designers before but never one who truly listened. The space feels like me, not a showroom." }
                        ].map((t, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                className="p-8 border-l border-foreground/10"
                            >
                                <p className="text-foreground/70 text-sm leading-relaxed mb-6 italic">"{t.content}"</p>
                                <p className="font-bold text-xs uppercase tracking-widest">{t.name}</p>
                                <p className="text-accent text-[10px] uppercase font-medium">{t.role}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-12 border-t border-foreground/5 text-foreground">
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="max-w-7xl mx-auto flex flex-col items-center py-24 text-center"
                >
                    <h2 className="text-4xl md:text-7xl font-heading mb-12 leading-[1.2] tracking-wide">Let&apos;s Talk About <br /> <span className="italic">Your Space</span>.</h2>
                    <Link
                        href="/booking"
                        className="bg-accent text-white px-16 py-6 rounded-full text-base font-bold tracking-[0.3em] uppercase hover:bg-foreground transition-all shadow-2xl hover:scale-105 active:scale-95"
                    >
                        Book a Free Consultation
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}
