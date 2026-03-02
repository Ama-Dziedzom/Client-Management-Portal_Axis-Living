"use client";

import { motion } from "framer-motion";
import EmailForm from "./EmailForm";

interface LookbookSectionProps {
    data?: {
        subtitle?: string;
        title?: string;
        body?: string;
        buttonText?: string;
    };
}

export default function LookbookSection({ data }: LookbookSectionProps) {
    return (
        <section className="w-full bg-[#FAF9F6] border-l-8 border-[#C9A84C] py-20 px-6 lg:px-24">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-3/5"
                    >
                        <span className="text-accent text-[10px] uppercase font-bold tracking-[0.4em] mb-4 block">
                            {data?.subtitle || "Free Resource"}
                        </span>
                        <h2 className="text-4xl md:text-6xl font-heading mb-8 text-foreground tracking-wide">
                            {data?.title || "Get the Lookbook"}
                        </h2>
                        <p className="text-foreground/70 text-lg leading-relaxed max-w-2xl font-body">
                            {data?.body || "Behind the Design is our curated 12-page guide featuring material palettes, spatial planning tips, and an inside look at how we approach every project. It's free."}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full lg:w-2/5"
                    >
                        <div className="bg-white p-8 md:p-10 shadow-sm border border-foreground/5">
                            <EmailForm
                                variant="inline"
                                buttonText={data?.buttonText || "Get Free Access"}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
