"use client";

import { useState } from "react";
import { emailTemplates } from "@/lib/emailTemplates";

const SAMPLE = {
    name: "Ama Dziedzom",
    date: "June 20, 2026",
    time: "10:00 AM",
    meetingLink: "https://meet.google.com/owu-zhiz-bns",
    email: "hello@axisliving.co.zm",
    password: "Ax!s2026",
    portalUrl: "https://portal.axisliving.co.zm",
    messagePreview: "Your moodboard for the living room is ready — I've included two directions for you to review before our next check-in.",
};

const templates = [
    {
        id: "lookbook",
        label: "Lookbook Delivery",
        timing: "On lookbook sign-up",
        generate: () => emailTemplates.lookbookDelivery(SAMPLE.name.split(" ")[0]),
    },
    {
        id: "booking",
        label: "Booking Confirmation",
        timing: "On consultation booked",
        generate: () => emailTemplates.bookingConfirmation(SAMPLE.name, SAMPLE.date, SAMPLE.time, SAMPLE.meetingLink),
    },
    {
        id: "portal",
        label: "Portal Welcome",
        timing: "On client portal created",
        generate: () => emailTemplates.portalWelcome(SAMPLE.name, SAMPLE.email, SAMPLE.password, SAMPLE.portalUrl),
    },
    {
        id: "message",
        label: "New Message",
        timing: "On designer message sent",
        generate: () => emailTemplates.newPortalMessage(SAMPLE.name, SAMPLE.messagePreview, SAMPLE.portalUrl),
    },
];

export default function EmailPreviewPage() {
    const [active, setActive] = useState(templates[0].id);

    const current = templates.find((t) => t.id === active)!;
    const { subject } = current.generate();

    return (
        <div className="min-h-screen bg-neutral-100 pt-32 pb-16 px-6 lg:px-24">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <p className="text-xs uppercase tracking-[0.4em] text-neutral-400 font-bold mb-2">Admin</p>
                    <h1 className="text-3xl font-heading text-neutral-800">Email Template Preview</h1>
                </header>

                {/* Tab bar */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {templates.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setActive(t.id)}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                                active === t.id
                                    ? "bg-[#2F402C] text-white border-[#2F402C]"
                                    : "bg-white text-neutral-500 border-neutral-200 hover:border-[#2F402C] hover:text-[#2F402C]"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Meta row */}
                <div className="bg-white rounded-sm border border-neutral-200 px-6 py-4 mb-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">Trigger</span>
                        <span className="text-neutral-700">{current.timing}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">Subject</span>
                        <span className="text-neutral-700">{subject}</span>
                    </div>
                </div>

                {/* Preview iframe */}
                <div className="rounded-sm overflow-hidden border border-neutral-200 shadow-lg">
                    <div className="bg-neutral-200 px-4 py-2 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-400" />
                        <span className="w-3 h-3 rounded-full bg-yellow-400" />
                        <span className="w-3 h-3 rounded-full bg-green-400" />
                        <span className="ml-4 text-xs text-neutral-500 font-mono truncate">Email preview — {subject}</span>
                    </div>
                    <iframe
                        key={active}
                        src={`/api/email-preview/${active}`}
                        title={`Preview: ${current.label}`}
                        className="w-full bg-white"
                        style={{ height: "800px", border: "none" }}
                    />
                </div>
            </div>
        </div>
    );
}
