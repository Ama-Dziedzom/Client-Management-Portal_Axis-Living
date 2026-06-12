'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { emailTemplates } from '@/lib/emailTemplates'
import { Copy, Check, Clock } from 'lucide-react'

// ───── Email Preview ─────

const SAMPLE = {
    name: 'Ama Dziedzom',
    date: 'June 20, 2026',
    time: '10:00 AM',
    meetingLink: 'https://meet.google.com/owu-zhiz-bns',
    email: 'hello@axisliving.co.zm',
    password: 'Ax!s2026',
    portalUrl: 'https://portal.axisliving.co.zm',
    messagePreview: "Your moodboard for the living room is ready — I've included two directions for you to review before our next check-in.",
}

const templates = [
    {
        id: 'lookbook',
        label: 'Lookbook Delivery',
        timing: 'On lookbook sign-up',
        generate: () => emailTemplates.lookbookDelivery(SAMPLE.name.split(' ')[0]),
    },
    {
        id: 'booking',
        label: 'Booking Confirmation',
        timing: 'On consultation booked',
        generate: () => emailTemplates.bookingConfirmation(SAMPLE.name, SAMPLE.date, SAMPLE.time, SAMPLE.meetingLink),
    },
    {
        id: 'cancelled',
        label: 'Booking Cancelled',
        timing: 'On client self-cancellation',
        generate: () => emailTemplates.bookingCancelled(SAMPLE.name, SAMPLE.date, SAMPLE.time),
    },
    {
        id: 'portal',
        label: 'Portal Welcome',
        timing: 'On client portal created',
        generate: () => emailTemplates.portalWelcome(SAMPLE.name, SAMPLE.email, SAMPLE.password, SAMPLE.portalUrl),
    },
    {
        id: 'message',
        label: 'New Message',
        timing: 'On designer message sent',
        generate: () => emailTemplates.newPortalMessage(SAMPLE.name, SAMPLE.messagePreview, SAMPLE.portalUrl),
    },
]

function EmailPreviewTab() {
    const [active, setActive] = useState(templates[0].id)
    const current = templates.find(t => t.id === active)!
    const { subject, html } = current.generate()

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-6">
                {templates.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActive(t.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                            active === t.id
                                ? 'bg-accent/20 text-primary border-accent/30'
                                : 'bg-surface text-text-secondary border-border hover:text-text-primary'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="card-flat mb-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-8">
                <div className="flex items-center gap-3 text-sm">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Trigger</span>
                    <span className="text-text-primary">{current.timing}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Subject</span>
                    <span className="text-text-primary">{subject}</span>
                </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border shadow-card">
                <div className="bg-surface border-b border-border px-4 py-2.5 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="ml-3 text-xs text-text-secondary font-mono truncate">{subject}</span>
                </div>
                <iframe
                    key={active}
                    srcDoc={html}
                    title={`Preview: ${current.label}`}
                    className="w-full bg-white"
                    style={{ height: '780px', border: 'none' }}
                    sandbox="allow-same-origin"
                />
            </div>
        </div>
    )
}

// ───── Nurture Sequence ─────

const nurture = [
    {
        number: 1,
        timing: 'Immediate',
        subject: 'Your Behind the Design Lookbook is here ✦',
        body: `Hi [First Name],

Thank you for downloading Behind the Design — I put a lot of care into this one and I hope it gives you a real sense of how we think about spaces.

Inside you'll find material palettes from our recent projects, a few spatial planning principles we return to again and again, and some thoughts on what makes a room feel genuinely finished versus just furnished.

[BUTTON: Download Your Lookbook]

If anything in there resonates — or if you're already thinking about a space you want to transform — I'd love to hear about it. Hit reply anytime.

Warmly,
Kas
Axis Living

P.S. Next week I'll share something we rarely talk about publicly — the mistakes we made on one of our most ambitious projects, and what we learned from them.`,
    },
    {
        number: 2,
        timing: 'Day 4',
        subject: 'The mistake that almost ruined our best project',
        body: `Hi [First Name],

A few years ago we were deep into what should have been our most beautiful project — a penthouse with an incredible art collection, a generous budget, and a client who trusted us completely.

Three weeks before completion, we realised we'd made a significant error in the spatial flow between the living and dining areas. The furniture had been ordered. The walls were finished. And the room felt... stuck.

We fixed it. It cost us two weeks and some uncomfortable conversations. But the result became one of our most celebrated projects — and the lesson became part of how we work today.

Every project now includes a spatial flow review at concept stage before a single item is ordered. It sounds simple. Most studios skip it.

I share this because working with a designer isn't just about taste. It's about having someone in your corner who has already made the expensive mistakes so you don't have to.

[BUTTON: Book a Discovery Call]

Kas`,
    },
    {
        number: 3,
        timing: 'Day 9',
        subject: '"What\'s your budget?" (and why we ask differently)',
        body: `Hi [First Name],

Most designers ask for your budget upfront and then design to fill it. We don't.

We ask a different question first: what do you want this space to *do* for you?

A bedroom that helps you wind down properly. A living room that makes you want to host again. A home office that makes remote work feel intentional rather than accidental.

When we understand that, the budget conversation becomes much more straightforward — because we're scoping toward an outcome, not a number.

The best way to understand what's right for your project is a 30-minute call where we can ask the right questions and give you a realistic picture.

[BUTTON: Book a Discovery Call]

No obligation, no sales pitch. Just a conversation.

Kas`,
    },
    {
        number: 4,
        timing: 'Day 14',
        subject: 'Last thing — then I\'ll leave you alone',
        body: `Hi [First Name],

This is my last email in this little series — I don't believe in filling inboxes.

I just wanted to leave you with one thought:

The spaces we live and work in shape how we feel every single day. Not in a grand, philosophical way — in the small, practical way that a room that works makes mornings easier, makes evenings more restorative, makes the people inside it feel more like themselves.

That's what we build.

If you ever want to explore what that could look like for your space — whether that's next month or next year — my calendar is always open for a first conversation.

[BUTTON: Book a Free Consultation]

And if the timing isn't right, no worries at all. I hope the lookbook was useful.

Kas
Axis Living`,
    },
]

const RESEND_STEPS = [
    {
        step: 1,
        title: 'Create an Audience',
        detail: 'Resend → Audiences → Create audience. Name it "Axis Living Website". Copy the Audience ID into your RESEND_AUDIENCE_ID env var — this is what makes the website add subscribers automatically.',
    },
    {
        step: 2,
        title: 'Create an Automation',
        detail: 'Resend → Automations → Create automation. Set the trigger to "Contact event". Create a new event called lookbook_downloaded with a single Date property named subscribed_at.',
    },
    {
        step: 3,
        title: 'Add the 4 email steps',
        detail: 'Inside the automation, add 4 "Send email" nodes. Set delays: Email 1 → immediately, Email 2 → wait 4 days, Email 3 → wait 5 more days, Email 4 → wait 5 more days. Copy each subject and body from the templates below.',
    },
    {
        step: 4,
        title: 'Fire the event from code',
        detail: 'The subscribe route already adds contacts to the audience. You also need to fire the lookbook_downloaded event so the automation triggers. Add the event call to the subscribe API route — see note below.',
    },
]

function NurtureSequenceTab() {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
    const [copiedSnippet, setCopiedSnippet] = useState(false)

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    const eventSnippet = `// Add this after the contact.create() call in /api/subscribe/route.ts
await resend.contacts.createEvent({
    audienceId: AUDIENCE_ID,
    email: email,
    eventName: 'lookbook_downloaded',
    properties: {
        subscribed_at: new Date().toISOString(),
    },
})`

    return (
        <div className="space-y-8">
            {/* Resend setup guide */}
            <div className="card-flat">
                <h2 className="text-text-primary font-semibold text-base mb-1">Resend Setup Guide</h2>
                <p className="text-text-secondary text-sm mb-6">Follow these steps once to wire up the 4-email nurture sequence in Resend.</p>
                <div className="space-y-4">
                    {RESEND_STEPS.map(({ step, title, detail }) => (
                        <div key={step} className="flex gap-4">
                            <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                                {step}
                            </span>
                            <div>
                                <p className="text-text-primary font-semibold text-sm mb-1">{title}</p>
                                <p className="text-text-secondary text-sm leading-relaxed">{detail}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Code snippet for step 4 */}
                <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Code change needed — subscribe route</p>
                        <button
                            onClick={() => { navigator.clipboard.writeText(eventSnippet); setCopiedSnippet(true); setTimeout(() => setCopiedSnippet(false), 2000) }}
                            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors"
                        >
                            {copiedSnippet ? <><Check className="w-3.5 h-3.5 text-emerald-600" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                        </button>
                    </div>
                    <pre className="bg-background border border-border rounded-xl p-4 text-xs text-text-secondary overflow-x-auto leading-relaxed font-mono">
                        {eventSnippet}
                    </pre>
                </div>
            </div>

            <div>
                <h2 className="text-text-primary font-semibold text-base mb-1">Email Templates</h2>
                <p className="text-text-secondary text-sm mb-6">Copy each subject and body into the corresponding step in Resend.</p>
            </div>

            {nurture.map((email, idx) => (
                <div key={idx} className="card-flat">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                {email.number}
                            </span>
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                <Clock className="w-3 h-3" />
                                {email.timing}
                            </div>
                        </div>
                        <button
                            onClick={() => handleCopy(`${email.subject}\n\n${email.body}`, idx)}
                            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors"
                        >
                            {copiedIndex === idx ? (
                                <><Check className="w-3.5 h-3.5 text-emerald-600" /> Copied</>
                            ) : (
                                <><Copy className="w-3.5 h-3.5" /> Copy</>
                            )}
                        </button>
                    </div>

                    <div className="mb-4">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-text-secondary mb-1.5">Subject</p>
                        <p className="text-text-primary font-medium text-sm">{email.subject}</p>
                    </div>

                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-text-secondary mb-1.5">Body</p>
                        <div className="bg-background rounded-xl p-4 whitespace-pre-wrap text-text-secondary text-sm leading-relaxed border border-border">
                            {email.body}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ───── Page ─────

type Tab = 'preview' | 'sequence'

export default function EmailsPage() {
    const [tab, setTab] = useState<Tab>('preview')

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-text-primary mb-2">Emails</h1>
                <p className="text-text-secondary font-body text-lg">Preview templates and manage your nurture sequence</p>
            </div>

            <div className="flex gap-1 bg-surface border border-border rounded-xl p-1 w-fit mb-8">
                {([['preview', 'Template Preview'], ['sequence', 'Nurture Sequence']] as [Tab, string][]).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            tab === key
                                ? 'bg-accent/20 text-primary border border-accent/30'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {tab === 'preview' ? <EmailPreviewTab /> : <NurtureSequenceTab />}
        </motion.div>
    )
}
