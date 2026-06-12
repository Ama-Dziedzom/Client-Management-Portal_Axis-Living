import type { Metadata } from "next";
import "@/styles/globals.css";
import Navbar from "@/components/Navigation/Navbar";
import Footer from "@/components/Navigation/Footer";
import LookbookPopup from "@/components/EmailCapture/LookbookPopup";
import { fetchSiteSettings, fetchHomeData } from "@/lib/data";

export const metadata: Metadata = {
    metadataBase: new URL('https://axisliving.co.zm'),
    title: {
        default: "Axis Living | Bespoke Interiors - Custom Design, Lusaka",
        template: "%s | Axis Living"
    },
    description: "Spaces designed for the way you live. We create interiors that are as intentional as they are beautiful, tailored to your life, not a trend. Lusaka-based interior design studio.",
    keywords: ["interior design", "Lusaka", "Zambia", "bespoke design", "residential design", "commercial interiors", "Axis Living", "Bespoke Interiors"],
    alternates: {
        canonical: '/',
    },
    icons: {
        icon: "/favicon.jpeg",
        apple: "/apple-touch-icon.png",
    },
    openGraph: {
        title: "Axis Living | Bespoke Interiors - Custom Design, Lusaka",
        description: "Spaces designed for the way you live. We create interiors that are as intentional as they are beautiful.",
        type: "website",
        url: "https://axisliving.co.zm",
        siteName: "Axis Living",
        locale: "en_ZM",
        images: [
            {
                url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
                width: 1200,
                height: 630,
                alt: "Axis Living - Bespoke Interiors",
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Axis Living | Bespoke Interiors - Custom Design, Lusaka",
        description: "Spaces designed for the way you live. We create interiors that are as intentional as they are beautiful.",
        images: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80"],
    },
};

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [siteSettings, homeData] = await Promise.all([
        fetchSiteSettings(),
        fetchHomeData()
    ]);

    return (
        <html lang="en" className="scroll-smooth">
            <body className="bg-background text-foreground antialiased min-h-screen overflow-x-hidden">
                <Navbar siteSettings={siteSettings} />
                <main>
                    {children}
                </main>
                <Footer siteSettings={siteSettings} />
                <LookbookPopup data={homeData?.lookbookSection} />
            </body>
        </html>
    );
}
