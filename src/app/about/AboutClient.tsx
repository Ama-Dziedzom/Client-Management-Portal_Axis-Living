"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef, useState } from "react";

const fadeInUp: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.2
        }
    }
};

const AboutClient = () => {
    const [heroElement, setHeroElement] = useState<HTMLElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: heroElement ? { current: heroElement } : undefined,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    const processes = [
        {
            step: "01",
            title: "Discovery",
            description: "We start with a conversation. I learn about your life, your taste, your non-negotiables, and your budget. No judgement, just listening.",
        },
        {
            step: "02",
            title: "Concept",
            description: "I develop a full design concept \u2014 mood boards, spatial plans, material palettes \u2014 and we align before anything is ordered or built.",
        },
        {
            step: "03",
            title: "Design & Execution",
            description: "I manage procurement, contractor coordination, and quality control so you don\u2019t have to. You stay informed without being overwhelmed.",
        },
        {
            step: "04",
            title: "The Reveal",
            description: "The moment the space comes together exactly as envisioned. We document everything, walk you through care instructions, and hand over your home.",
        },
    ];

    return (
        <div className="bg-background min-h-screen">
            {/* Hero Header */}
            <section ref={setHeroElement} className="h-[600px] relative overflow-hidden flex items-center justify-center pt-32">
                <motion.div style={{ y }} className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1760072513442-9872656c1b07?fm=jpg&q=80&w=2000&auto=format&fit=crop"
                        alt="Studio Aesthetic Portrait"
                        fill
                        className="object-cover brightness-50 contrast-125"
                        priority
                    />
                </motion.div>
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="relative z-20 text-center text-white px-6">
                    <motion.p
                        initial={{ opacity: 0, letterSpacing: "0.2em" }}
                        animate={{ opacity: 1, letterSpacing: "0.5em" }}
                        className="text-white text-xs font-bold uppercase mb-4 opacity-90"
                    >
                        The Studio
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-9xl font-heading mb-10 font-light leading-[1.2] tracking-wide"
                    >
                        Our Philosophy
                    </motion.h1>
                    <p className="max-w-2xl mx-auto text-white/90 text-sm tracking-[0.5em] uppercase font-bold">
                        Good design isn&apos;t decorating. It&apos;s problem-solving with beauty.
                    </p>
                </div>
            </section>

            {/* Bio Section */}
            <section className="py-24 px-6 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-32">
                        <motion.div
                            variants={fadeInUp}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true, margin: "-100px" }}
                            className="relative aspect-[3/4] shadow-2xl rounded-sm overflow-hidden"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2000&auto=format&fit=crop"
                                alt="Principal Designer"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-12">
                                <p className="text-white font-heading text-4xl italic leading-none border-l-4 border-accent pl-6">
                                    Kas <br />
                                    <span className="text-sm font-body uppercase font-bold tracking-[0.3em] opacity-70">Principal Designer &amp; Founder</span>
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <span className="text-accent text-[10px] uppercase font-bold tracking-[0.4em] mb-4 block underline decoration-accent/30 underline-offset-8">My Story</span>
                            <h2 className="text-3xl md:text-6xl font-heading mb-12 leading-[1.25] tracking-wide">
                                Design is more than <span className="text-accent">aesthetic</span>; it&apos;s problem-solving with beauty.
                            </h2>
                            <div className="space-y-8 text-foreground/70 text-lg leading-relaxed font-body">
                                <p>
                                    I&apos;m the principal designer and founder of Axis Living. For over 5 years, I&apos;ve been transforming residential and commercial spaces across Lusaka and beyond. From intimate apartment refreshes to full-scale builds for clients who refuse to compromise on beauty.
                                </p>
                                <p>
                                    My approach sits at the intersection of function and feeling. Every room I design begins with a deep understanding of the person who will live or work in it, their rhythms, their aesthetics, their aspirations. The result is always spaces that feel inevitable, like they couldn&apos;t have been any other way.
                                </p>
                                <p>
                                    I&apos;ve worked with clients across Lusaka, and I collaborate with a trusted network of craftspeople, suppliers, and architects to deliver work that lasts.
                                </p>
                                <p className="font-heading italic text-foreground text-2xl py-8 border-y border-foreground/5 leading-relaxed">
                                    &ldquo;Good design isn&apos;t decorating. It&apos;s problem-solving with beauty. I believe every space has a best version of itself. My job is to find it, and then build it.&rdquo;
                                </p>
                                <Link
                                    href="/booking"
                                    className="bg-accent text-white px-10 py-5 rounded-full inline-block text-xs font-bold tracking-[0.2em] uppercase hover:bg-foreground transition-all shadow-xl"
                                >
                                    Book a Free Consultation
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="bg-foreground py-32 px-6 lg:px-24 text-white/80">
                <div className="max-w-7xl mx-auto">
                    <motion.header
                        variants={fadeInUp}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                        className="mb-24 text-center"
                    >
                        <span className="text-white/70 text-xs font-bold uppercase tracking-[0.4em] mb-4 block">The Journey</span>
                        <h2 className="text-white text-5xl md:text-8xl font-heading mb-12 font-light leading-[1.2] tracking-wide">My Process</h2>
                    </motion.header>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16"
                    >
                        {processes.map((proc, idx) => (
                            <motion.div
                                key={proc.step}
                                variants={fadeInUp}
                                className="flex flex-col border-t border-white/10 pt-8 group"
                            >
                                <span className="text-white/30 text-4xl font-heading mb-8 italic group-hover:text-white/70 transition-all">{proc.step}</span>
                                <h3 className="text-white text-2xl font-heading mb-6 group-hover:text-white/60 transition-colors">{proc.title}</h3>
                                <p className="text-sm font-body leading-relaxed text-white/70">
                                    {proc.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default AboutClient;
