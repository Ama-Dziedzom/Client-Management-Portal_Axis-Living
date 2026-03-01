"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const PricingPage = () => {
    const consultationFeatures = [
        "30-minute virtual or in-person meeting",
        "Discussion of your vision, lifestyle & aesthetic preferences",
        "Initial space assessment & recommendations",
        "Overview of our design process & timelines",
        "Custom proposal tailored to your project scope",
        "No obligation, just a conversation about your space",
    ];

    return (
        <div className="bg-background min-h-screen pt-32 pb-24 px-6 lg:px-24">
            <div className="max-w-7xl mx-auto">
                <header className="mb-24 text-center">
                    <motion.p
                        initial={{ opacity: 0, letterSpacing: "0.2em" }}
                        animate={{ opacity: 1, letterSpacing: "0.5em" }}
                        className="text-accent text-xs uppercase font-bold mb-6"
                    >
                        Start Here
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-8xl font-heading mb-10 leading-[1.1]"
                    >
                        Free <span className="italic font-light">Consultation</span>
                    </motion.h1>
                    <p className="text-foreground/80 text-lg uppercase tracking-widest max-w-2xl mx-auto font-bold">
                        Every great space starts with a conversation. Book a complimentary discovery call and let&rsquo;s explore what&rsquo;s possible.
                    </p>
                </header>

                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative bg-white p-12 lg:p-16 border-4 border-accent rounded-sm shadow-2xl overflow-hidden"
                    >
                        <div className="absolute top-10 -right-16 bg-accent text-white py-1.5 w-64 text-[9px] font-bold tracking-widest uppercase rotate-45 flex items-center justify-center shadow-lg">
                            Complimentary
                        </div>

                        <div className="mb-12 text-center">
                            <h3 className="text-4xl md:text-5xl font-heading mb-4 leading-tight">Discovery Call</h3>
                            <p className="text-foreground/60 text-sm italic font-body mb-8 max-w-md mx-auto">
                                A no-obligation conversation to understand your space, your style, and your vision, before any commitment.
                            </p>
                            <div className="flex items-center justify-center gap-3 text-foreground">
                                <span className="text-6xl md:text-7xl font-heading font-light">Free</span>
                            </div>
                            <p className="text-[10px] uppercase tracking-widest font-bold opacity-40 mt-2">30 Minutes &middot; Virtual or In-Person</p>
                        </div>

                        <div className="space-y-6 mb-12">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-accent mb-6 border-b border-accent/10 pb-2">What to expect:</p>
                            {consultationFeatures.map((feature) => (
                                <div key={feature} className="flex items-start gap-4 text-sm font-body text-foreground/80">
                                    <Check size={18} className="text-accent mt-0.5 shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/booking"
                            className="w-full py-5 px-8 rounded-full text-center text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-xl flex items-center justify-center gap-3 bg-accent text-white hover:bg-foreground border border-accent hover:border-foreground"
                        >
                            <span className="hidden md:inline">Book Your Free Consultation</span>
                            <span className="md:hidden">Free Consultation</span>
                            <ArrowRight size={16} className="shrink-0" />
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-24 text-center max-w-3xl mx-auto py-16 border-t border-foreground/10"
                >
                    <p className="text-foreground/80 text-xl md:text-2xl italic font-heading mb-10 leading-relaxed">
                        After your discovery call, we&rsquo;ll prepare a custom proposal with transparent pricing tailored to your project scope, location, and material selections. No surprises.
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-accent">
                        Your bespoke journey starts with a single conversation
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default PricingPage;
