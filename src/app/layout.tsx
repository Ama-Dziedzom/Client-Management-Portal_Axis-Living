import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "../styles/globals.css";
import Navbar from "../components/Navigation/Navbar";
import Footer from "../components/Navigation/Footer";
import LookbookPopup from "../components/EmailCapture/LookbookPopup";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL('https://axisliving.co.zm'),
    title: {
        default: "Axis Living | Bespoke Interiors, Lusaka, Zambia",
        template: "%s | Axis Living"
    },
    description: "Spaces designed for the way you live. We create interiors that are as intentional as they are beautiful, tailored to your life, not a trend. Lusaka-based interior design studio.",
    keywords: ["interior design", "Lusaka", "Zambia", "bespoke design", "residential design", "commercial interiors", "Axis Living"],
    alternates: {
        canonical: '/',
    },
    icons: {
        icon: "/favicon.jpeg",
        apple: "/apple-touch-icon.png",
    },
    openGraph: {
        title: "Axis Living | Bespoke Interiors, Lusaka",
        description: "Spaces designed for the way you live. We create interiors that are as intentional as they are beautiful.",
        type: "website",
        url: "https://axisliving.co.zm",
        siteName: "Axis Living",
        locale: "en_ZM",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Axis Living Interiors",
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Axis Living | Bespoke Interiors, Lusaka",
        description: "Spaces designed for the way you live. We create interiors that are as intentional as they are beautiful.",
        images: ["/og-image.jpg"],
    },
};

import { fetchSiteSettings } from "../lib/data";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const siteSettings = await fetchSiteSettings();

    return (
        <html lang="en" className={`${manrope.variable} scroll-smooth`}>
            <body className="bg-background text-foreground antialiased min-h-screen overflow-x-hidden">
                <Navbar siteSettings={siteSettings} />
                <main>
                    {children}
                </main>
                <Footer siteSettings={siteSettings} />
                <LookbookPopup />
            </body>
        </html>
    );
}
