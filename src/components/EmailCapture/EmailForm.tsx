"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EmailFormProps {
    variant: "popup" | "inline";
    buttonText: string;
    onSuccess?: (email: string) => void;
}

export default function EmailForm({ variant, buttonText, onSuccess }: EmailFormProps) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Store in localStorage
            const subscriptionData = {
                email,
                subscribedAt: new Date().toISOString(),
            };
            localStorage.setItem("lookbook_subscription", JSON.stringify(subscriptionData));

            // Fire custom event
            window.dispatchEvent(new CustomEvent('lookbook_signup', { detail: { email } }));

            setIsSuccess(true);
            if (onSuccess) onSuccess(email);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${variant === 'popup' ? 'text-white' : 'text-foreground'}`}
            >
                <p className="text-sm font-medium">
                    It&apos;s on its way! Check your inbox in the next few minutes.
                </p>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className={`flex flex-col gap-3 ${variant === 'inline' ? 'md:flex-row md:items-start' : ''}`}>
                <div className="flex-grow">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        className={`w-full px-4 py-3 rounded-none border outline-none transition-colors ${variant === 'popup'
                                ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40'
                                : 'bg-transparent border-foreground/20 text-foreground placeholder:text-foreground/40 focus:border-accent'
                            }`}
                        disabled={isSubmitting}
                    />
                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-red-400 text-[11px] mt-1 font-medium"
                            >
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 font-bold uppercase tracking-widest text-[10px] transition-all whitespace-nowrap ${variant === 'popup'
                            ? 'bg-[#C9A84C] text-white hover:bg-[#B89740] shadow-lg'
                            : 'bg-accent text-white hover:bg-foreground shadow-sm'
                        } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? "Sending..." : buttonText}
                </button>
            </div>
            {variant === 'popup' && (
                <p className="text-[10px] text-white/40 mt-3 italic">
                    No spam. Unsubscribe anytime.
                </p>
            )}
        </form>
    );
}
