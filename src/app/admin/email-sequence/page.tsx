"use client";

import { useState } from "react";
import { Copy, Check, Clock } from "lucide-react";
import { motion } from "framer-motion";

const emails = [
    {
        number: 1,
        timing: "Immediate",
        subject: "Your Behind the Design Lookbook is here ✦",
        body: `Hi [First Name],

Thank you for downloading Behind the Design — I put a lot of care into this one and I hope it gives you a real sense of how we think about spaces.

Inside you'll find material palettes from our recent projects, a few spatial planning principles we return to again and again, and some thoughts on what makes a room feel genuinely finished versus just furnished.

[BUTTON: Download Your Lookbook]

If anything in there resonates — or if you're already thinking about a space you want to transform — I'd love to hear about it. Hit reply anytime.

Warmly,
[Your Name]
Studio [Name]

P.S. Next week I'll share something we rarely talk about publicly — the mistakes we made on one of our most ambitious projects, and what we learned from them.`
    },
    {
        number: 2,
        timing: "Day 4",
        subject: "The mistake that almost ruined our best project",
        body: `Hi [First Name],

A few years ago we were deep into what should have been our most beautiful project — a penthouse in Abuja with an incredible art collection, a generous budget, and a client who trusted us completely.

Three weeks before completion, we realised we'd made a significant error in the spatial flow between the living and dining areas. The furniture had been ordered. The walls were finished. And the room felt... stuck.

We fixed it. It cost us two weeks and some uncomfortable conversations. But the result became one of our most celebrated projects — and the lesson became part of how we work today.

Every project now includes a spatial flow review at concept stage before a single item is ordered. It sounds simple. Most studios skip it.

I share this because working with a designer isn't just about taste. It's about having someone in your corner who has already made the expensive mistakes so you don't have to.

If you're considering a project and want to talk it through, I'm always happy to start with a no-pressure conversation.

[BUTTON: Book a Free Discovery Call]

[Your Name]`
    },
    {
        number: 3,
        timing: "Day 9",
        subject: "\"What's your budget?\" (and why we ask differently)",
        body: `Hi [First Name],

Most designers ask for your budget upfront and then design to fill it. We don't.

We ask a different question first: what do you want this space to *do* for you?

A bedroom that helps you wind down properly. A living room that makes you want to host again. A home office that makes remote work feel intentional rather than accidental.

When we understand that, the budget conversation becomes much more straightforward — because we're scoping toward an outcome, not a number.

Our project tiers start from \u20A6850,000 for a room refresh and scale depending on scope. But the best way to understand what's right for your project is a 30-minute call where we can ask the right questions and give you a realistic picture.

[BUTTON: See Our Pricing]
[BUTTON: Book a Discovery Call]

No obligation, no sales pitch. Just a conversation.

[Your Name]`
    },
    {
        number: 4,
        timing: "Day 14",
        subject: "Last thing — then I'll leave you alone",
        body: `Hi [First Name],

This is my last email in this little series — I don't believe in filling inboxes.

I just wanted to leave you with one thought:

The spaces we live and work in shape how we feel every single day. Not in a grand, philosophical way — in the small, practical way that a room that works makes mornings easier, makes evenings more restorative, makes the people inside it feel more like themselves.

That's what we build.

If you ever want to explore what that could look like for your space — whether that's next month or next year — my calendar is always open for a first conversation.

[BUTTON: Book a Free Consultation]

And if the timing isn't right, no worries at all. I hope the lookbook was useful.

[Your Name]
Studio [Name]`
    }
];

export default function EmailSequencePage() {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-3xl font-heading mb-4 text-[#1C1C1C]">Nurture Email Sequence</h1>
                    <p className="text-gray-600 max-w-2xl">
                        Copy these emails into your marketing automation tool (Mailchimp, ConvertKit, etc.).
                        The timing and subject lines are optimized for engagement.
                    </p>
                </header>

                <div className="space-y-12">
                    {emails.map((email, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1C1C1C] text-white text-xs font-bold">
                                        {email.number}
                                    </span>
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] text-[10px] font-bold uppercase tracking-wider">
                                        <Clock size={12} />
                                        {email.timing}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleCopy(`${email.subject}\n\n${email.body}`, idx)}
                                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C9A84C] hover:text-[#1C1C1C] transition-colors"
                                >
                                    {copiedIndex === idx ? (
                                        <>
                                            <Check size={14} />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            Copy Email
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="p-8">
                                <div className="mb-6">
                                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-2">Subject Line</label>
                                    <p className="text-lg font-medium text-[#C9A84C] border-l-2 border-[#C9A84C] pl-4">
                                        {email.subject}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-2">Email Body</label>
                                    <div className="bg-gray-50 p-6 rounded-md whitespace-pre-wrap font-body text-gray-700 leading-relaxed text-sm">
                                        {email.body}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
