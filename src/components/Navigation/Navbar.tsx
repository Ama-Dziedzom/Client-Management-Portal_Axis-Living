"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Portfolio", href: "/portfolio" },
        { name: "Pricing", href: "/pricing" },
        { name: "About", href: "/about" },
    ];

    const isProjectDetail = pathname.startsWith("/portfolio/") && pathname !== "/portfolio";
    const isDarkHero = pathname === "/" || pathname === "/about" || isProjectDetail;
    const navTextColor = scrolled ? "text-foreground" : (isDarkHero ? "text-white" : "text-foreground");

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 lg:px-12 py-6 flex items-center justify-between",
                scrolled
                    ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-foreground/5 py-4"
                    : "bg-transparent",
                navTextColor
            )}
        >
            <Link href="/" className="relative block">
                <Image
                    src="/logo.jpg"
                    alt="Axis Living - Bespoke Interiors"
                    width={180}
                    height={80}
                    className="h-16 w-auto object-contain"
                    priority
                />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-10 text-sm font-medium tracking-wide uppercase">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "hover:text-accent transition-colors",
                            pathname === link.href ? "text-accent" : navTextColor
                        )}
                    >
                        {link.name}
                    </Link>
                ))}
                <Link
                    href="/booking"
                    className="bg-accent text-white px-6 py-2 rounded-full hover:bg-accent/90 transition-all shadow-md hover:scale-105 active:scale-95"
                >
                    Book a Free Consultation
                </Link>
            </div>

            {/* Mobile Toggle */}
            <button
                className={cn("md:hidden", navTextColor)}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 bg-background z-40 flex flex-col items-center justify-center space-y-8 md:hidden p-6"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-4xl font-heading hover:text-accent transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/booking"
                            className="mt-4 px-10 py-5 bg-accent text-white text-xl rounded-full font-heading"
                            onClick={() => setIsOpen(false)}
                        >
                            Book a Free Consultation
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
