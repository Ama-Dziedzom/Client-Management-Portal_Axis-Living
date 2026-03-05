import React from 'react';
import { emailTemplates } from '@/lib/emailTemplates';
import { BookingConfirmationEmail } from '@/components/Emails/BookingConfirmation';

export default function EmailPreviewPage() {
    const name = "Ama";
    const date = "Monday, March 10th";
    const time = "10:00 AM";
    const meetingLink = "https://meet.google.com/abc-defg-hij";
    const portalUrl = "https://axisliving.co.zm/portal";
    const password = "secure-password-123";
    const messagePreview = "We've updated your moodboard with the new tan leather samples we discussed.";

    // Get HTML from templates
    const lookbook = emailTemplates.lookbookDelivery(name);
    const booking = emailTemplates.bookingConfirmation(name, date, time, meetingLink);
    const welcome = emailTemplates.portalWelcome(name, "client@example.com", password, portalUrl);
    const message = emailTemplates.newPortalMessage(name, messagePreview, portalUrl);

    return (
        <div className="p-8 bg-gray-100 min-h-screen font-sans">
            <header className="mb-12 border-b pb-6">
                <h1 className="text-4xl font-serif text-[#2F402C] mb-2 leading-none">Axis Living</h1>
                <p className="text-gray-600">Email Design System & Template Previews</p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">

                {/* 1. Lookbook Delivery */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-medium text-[#2F402C]">1. Lookbook Delivery</h2>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#C6B9AA]">Subject: {lookbook.subject}</span>
                    </div>
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                        <iframe
                            srcDoc={lookbook.html}
                            className="w-full h-[600px] border-none"
                            title="Lookbook Delivery Preview"
                        />
                    </div>
                </section>

                {/* 2. React-based Booking Confirmation */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-medium text-[#2F402C]">2. Booking Confirmation (React Component)</h2>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#C6B9AA]">Live Comp</span>
                    </div>
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                        <div className="w-full h-[600px] overflow-auto">
                            <BookingConfirmationEmail
                                name={name}
                                date={date}
                                time={time}
                                meetingLink={meetingLink}
                            />
                        </div>
                    </div>
                </section>

                {/* 3. Portal Welcome */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-medium text-[#2F402C]">3. Client Portal Welcome</h2>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#C6B9AA]">Subject: {welcome.subject}</span>
                    </div>
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                        <iframe
                            srcDoc={welcome.html}
                            className="w-full h-[600px] border-none"
                            title="Portal Welcome Preview"
                        />
                    </div>
                </section>

                {/* 4. New Message Notification */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-medium text-[#2F402C]">4. New Message Notification</h2>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#C6B9AA]">Subject: {message.subject}</span>
                    </div>
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                        <iframe
                            srcDoc={message.html}
                            className="w-full h-[600px] border-none"
                            title="New Message Preview"
                        />
                    </div>
                </section>

            </div>

            <footer className="mt-20 py-10 text-center border-t text-sm text-gray-500 italic font-serif">
                Axis Living Internal Design Tools &copy; {new Date().getFullYear()}
            </footer>
        </div>
    );
}
