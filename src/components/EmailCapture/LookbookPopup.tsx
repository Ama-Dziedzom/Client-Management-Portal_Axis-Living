"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import EmailForm from "./EmailForm";

interface LookbookPopupProps {
    data?: {
        subtitle?: string;
        title?: string;
        body?: string;
        buttonText?: string;
    };
}

export default function LookbookPopup({ data }: LookbookPopupProps) {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);

    useEffect(() => {
        // Don't show on booking page
        if (pathname === "/booking") return;

        // Check if already shown in this session
        const hasBeenShown = sessionStorage.getItem("lookbook_popup_shown");
        if (hasBeenShown) return;

        // Trigger logic
        const timer = setTimeout(() => {
            triggerPopup();
        }, 45000); // 45 seconds

        const handleScroll = () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > 60) {
                triggerPopup();
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [pathname]);

    const triggerPopup = () => {
        if (!hasTriggered) {
            setIsVisible(true);
            setHasTriggered(true);
            sessionStorage.setItem("lookbook_popup_shown", "true");
        }
    };

    const handleSuccess = () => {
        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            setIsVisible(false);
        }, 4000);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="fixed bottom-6 right-6 z-[9999] w-full max-w-[380px]"
                >
                    <div className="bg-[#2F402C] text-white p-8 rounded-sm shadow-2xl relative border border-[#C6B9AA]/20">
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <span className="text-[#C6B9AA] text-[10px] uppercase font-bold tracking-[0.3em] mb-2 block">
                                {data?.subtitle || "Limited Edition"}
                            </span>
                            <h3 className="text-2xl font-heading mb-3 leading-tight tracking-wide">
                                {data?.title || "2024 Design Trends"}
                            </h3>
                            <p className="text-white/60 text-sm leading-relaxed font-body">
                                {data?.body || "Receive our curated lookbook on this years most influential interior movements."}
                            </p>
                        </div>

                        <EmailForm
                            variant="popup"
                            buttonText={data?.buttonText}
                            onSuccess={handleSuccess}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
