'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, AlertTriangle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface BookingDetails {
    id: string;
    name: string;
    email: string;
    date: string;
    time: string;
    status: string;
}

type PageState =
    | { kind: 'loading' }
    | { kind: 'ready'; booking: BookingDetails }
    | { kind: 'confirming'; booking: BookingDetails }
    | { kind: 'cancelling'; booking: BookingDetails }
    | { kind: 'cancelled'; booking: BookingDetails }
    | { kind: 'already_cancelled' }
    | { kind: 'not_found' }
    | { kind: 'error'; message: string };

function CancelPageInner() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [state, setState] = useState<PageState>({ kind: 'loading' });

    useEffect(() => {
        if (!id) {
            setState({ kind: 'not_found' });
            return;
        }

        fetch(`/api/booking/cancel?id=${encodeURIComponent(id)}`)
            .then(res => res.json())
            .then(data => {
                if (data.error === 'Booking not found') {
                    setState({ kind: 'not_found' });
                } else if (data.booking?.status === 'cancelled') {
                    setState({ kind: 'already_cancelled' });
                } else if (data.booking) {
                    setState({ kind: 'ready', booking: data.booking });
                } else {
                    setState({ kind: 'error', message: 'Unable to load booking.' });
                }
            })
            .catch(() => setState({ kind: 'error', message: 'Connection error. Please try again.' }));
    }, [id]);

    async function handleCancel() {
        if (state.kind !== 'confirming') return;
        const { booking } = state;
        setState({ kind: 'cancelling', booking });

        try {
            const res = await fetch('/api/booking/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: booking.id }),
            });
            const data = await res.json();

            if (data.success) {
                setState({ kind: 'cancelled', booking });
            } else if (data.error === 'already_cancelled') {
                setState({ kind: 'already_cancelled' });
            } else {
                setState({ kind: 'error', message: 'Something went wrong. Please try again or email us.' });
            }
        } catch {
            setState({ kind: 'error', message: 'Connection error. Please try again.' });
        }
    }

    return (
        <div className="min-h-screen bg-[#F2EBE3] flex items-center justify-center px-4 py-16">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[480px]"
            >
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block">
                        <span className="font-heading text-2xl font-semibold text-[#2F402C] tracking-tight">
                            Axis Living
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-[0_4px_32px_rgba(47,64,44,0.08)] overflow-hidden">

                    {/* Loading */}
                    {state.kind === 'loading' && (
                        <div className="flex flex-col items-center justify-center py-20 px-8">
                            <Loader2 className="w-8 h-8 text-[#C6B9AA] animate-spin mb-4" />
                            <p className="text-[#6B7280] text-sm">Loading your booking...</p>
                        </div>
                    )}

                    {/* Ready — show booking + confirm prompt */}
                    {(state.kind === 'ready' || state.kind === 'confirming' || state.kind === 'cancelling') && (
                        <div className="p-10">
                            <h1 className="font-heading text-2xl font-semibold text-[#1C1C1C] mb-2">
                                Cancel booking
                            </h1>
                            <p className="text-[#6B7280] text-sm leading-relaxed mb-8">
                                You're about to cancel the following consultation.
                            </p>

                            {/* Booking details */}
                            <div className="bg-[#F2EBE3] rounded-xl p-6 mb-8 space-y-4">
                                <div>
                                    <span className="text-[10px] uppercase tracking-[2px] font-bold text-[#C6B9AA] block mb-1">
                                        Client
                                    </span>
                                    <span className="text-[#2F402C] font-medium text-[15px]">
                                        {state.booking.name}
                                    </span>
                                </div>
                                <div className="flex gap-6">
                                    <div>
                                        <span className="text-[10px] uppercase tracking-[2px] font-bold text-[#C6B9AA] flex items-center gap-1.5 mb-1">
                                            <Calendar className="w-3 h-3" /> Date
                                        </span>
                                        <span className="text-[#2F402C] font-medium text-[15px]">
                                            {state.booking.date}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] uppercase tracking-[2px] font-bold text-[#C6B9AA] flex items-center gap-1.5 mb-1">
                                            <Clock className="w-3 h-3" /> Time
                                        </span>
                                        <span className="text-[#2F402C] font-medium text-[15px]">
                                            {state.booking.time} CAT
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Warning */}
                            {state.kind === 'confirming' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6"
                                >
                                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-amber-700 text-sm leading-relaxed">
                                        This cannot be undone. You will receive a confirmation email and can rebook at any time.
                                    </p>
                                </motion.div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col gap-3">
                                {state.kind === 'ready' && (
                                    <button
                                        onClick={() => setState({ kind: 'confirming', booking: state.booking })}
                                        className="w-full py-4 rounded-full border-2 border-red-300 text-red-600 text-sm font-bold uppercase tracking-[2px] hover:bg-red-50 transition-colors"
                                    >
                                        Cancel my booking
                                    </button>
                                )}

                                {state.kind === 'confirming' && (
                                    <>
                                        <button
                                            onClick={handleCancel}
                                            className="w-full py-4 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-[2px] hover:bg-red-700 transition-colors"
                                        >
                                            Yes, cancel it
                                        </button>
                                        <button
                                            onClick={() => setState({ kind: 'ready', booking: state.booking })}
                                            className="w-full py-4 rounded-full border border-[#E5E7EB] text-[#6B7280] text-sm font-bold uppercase tracking-[2px] hover:bg-[#F2EBE3] transition-colors"
                                        >
                                            Keep my booking
                                        </button>
                                    </>
                                )}

                                {state.kind === 'cancelling' && (
                                    <button
                                        disabled
                                        className="w-full py-4 rounded-full bg-red-100 text-red-400 text-sm font-bold uppercase tracking-[2px] flex items-center justify-center gap-2"
                                    >
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Cancelling...
                                    </button>
                                )}
                            </div>

                            <p className="text-center text-xs text-[#C6B9AA] mt-6">
                                Want to reschedule instead?{' '}
                                <a href="mailto:hello@axisliving.co.zm" className="underline">
                                    Email us
                                </a>
                            </p>
                        </div>
                    )}

                    {/* Success */}
                    {state.kind === 'cancelled' && (
                        <div className="flex flex-col items-center text-center py-14 px-10">
                            <CheckCircle2 className="w-12 h-12 text-[#2F402C] mb-5" />
                            <h2 className="font-heading text-2xl font-semibold text-[#1C1C1C] mb-3">
                                Booking cancelled.
                            </h2>
                            <p className="text-[#6B7280] text-sm leading-relaxed mb-2">
                                Your consultation on <span className="font-medium text-[#2F402C]">{state.booking.date}</span> has been released.
                            </p>
                            <p className="text-[#6B7280] text-sm leading-relaxed mb-8">
                                A confirmation has been sent to <span className="font-medium text-[#2F402C]">{state.booking.email}</span>.
                            </p>
                            <Link
                                href="/booking"
                                className="inline-block bg-[#2F402C] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[2px] hover:bg-[#1e2d1c] transition-colors"
                            >
                                Book a new time
                            </Link>
                        </div>
                    )}

                    {/* Already cancelled */}
                    {state.kind === 'already_cancelled' && (
                        <div className="flex flex-col items-center text-center py-14 px-10">
                            <XCircle className="w-12 h-12 text-[#C6B9AA] mb-5" />
                            <h2 className="font-heading text-2xl font-semibold text-[#1C1C1C] mb-3">
                                Already cancelled.
                            </h2>
                            <p className="text-[#6B7280] text-sm leading-relaxed mb-8">
                                This booking has already been cancelled. If you'd like to schedule a new consultation, we'd love to hear from you.
                            </p>
                            <Link
                                href="/booking"
                                className="inline-block bg-[#2F402C] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[2px] hover:bg-[#1e2d1c] transition-colors"
                            >
                                Book a new time
                            </Link>
                        </div>
                    )}

                    {/* Not found */}
                    {state.kind === 'not_found' && (
                        <div className="flex flex-col items-center text-center py-14 px-10">
                            <XCircle className="w-12 h-12 text-[#C6B9AA] mb-5" />
                            <h2 className="font-heading text-2xl font-semibold text-[#1C1C1C] mb-3">
                                Booking not found.
                            </h2>
                            <p className="text-[#6B7280] text-sm leading-relaxed mb-8">
                                This link may be invalid or expired. Please check your confirmation email or contact us directly.
                            </p>
                            <a
                                href="mailto:hello@axisliving.co.zm"
                                className="inline-block bg-[#2F402C] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[2px] hover:bg-[#1e2d1c] transition-colors"
                            >
                                Contact us
                            </a>
                        </div>
                    )}

                    {/* Error */}
                    {state.kind === 'error' && (
                        <div className="flex flex-col items-center text-center py-14 px-10">
                            <AlertTriangle className="w-12 h-12 text-amber-400 mb-5" />
                            <h2 className="font-heading text-2xl font-semibold text-[#1C1C1C] mb-3">
                                Something went wrong.
                            </h2>
                            <p className="text-[#6B7280] text-sm leading-relaxed mb-8">
                                {state.message}
                            </p>
                            <a
                                href="mailto:hello@axisliving.co.zm"
                                className="inline-block bg-[#2F402C] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[2px] hover:bg-[#1e2d1c] transition-colors"
                            >
                                Email us
                            </a>
                        </div>
                    )}
                </div>

                <p className="text-center text-xs text-[#C6B9AA] mt-8">
                    © {new Date().getFullYear()} Axis Living · Lusaka, Zambia
                </p>
            </motion.div>
        </div>
    );
}

export default function CancelPage() {
    return (
        <Suspense>
            <CancelPageInner />
        </Suspense>
    );
}
