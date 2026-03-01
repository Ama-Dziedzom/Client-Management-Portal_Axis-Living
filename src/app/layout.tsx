import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "../styles/globals.css";
import Navbar from "../components/Navigation/Navbar";
import Footer from "../components/Navigation/Footer";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
    display: 'swap',
});

export const metadata: Metadata = {
    title: "Axis Living | Bespoke Interiors, Lusaka, Zambia",
    description: "Spaces designed for the way you live. We create interiors that are as intentional as they are beautiful, tailored to your life, not a trend. Lusaka-based interior design studio.",
    keywords: ["interior design", "Lusaka", "Zambia", "bespoke design", "residential design", "commercial interiors", "Axis Living"],
    openGraph: {
        title: "Axis Living | Bespoke Interiors, Lusaka",
        description: "Spaces designed for the way you live. We create interiors that are as intentional as they are beautiful.",
        type: "website",
        url: "https://axisliving.co.zm",
        images: ["/og-image.jpg"],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${manrope.variable} scroll-smooth`}>
            <body className="bg-background text-foreground antialiased min-h-screen overflow-x-hidden">
                <Navbar />
                <main>
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
