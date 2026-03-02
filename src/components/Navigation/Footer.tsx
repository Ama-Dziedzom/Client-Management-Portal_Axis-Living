import Link from "next/link";
import Image from "next/image";
import { Instagram, PinIcon as Pinterest, Mail, Phone, MapPin } from "lucide-react";

interface FooterProps {
    siteSettings?: any;
}

const Footer = ({ siteSettings }: FooterProps) => {
    return (
        <footer className="relative z-10 bg-foreground text-white/80 min-h-[70vh] flex flex-col px-6 lg:px-24 pb-12">
            {/* Brand Statement */}
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                <span className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block">
                    {siteSettings?.footerTagline || "DELIBERATE INTERIORS FOR MODERN LIVING"}
                </span>
                <h3 className="text-4xl md:text-9xl font-heading text-white/[0.15] tracking-wide leading-tight select-none">
                    {siteSettings?.studioName || "Axis Living"}
                </h3>
            </div>

            {/* Footer Content */}
            <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-16 border-b border-white/10 pb-16 text-center">
                <div className="flex flex-col items-center">
                    <Link href="/" className="relative block">
                        {siteSettings?.footerLogo ? (
                            <Image
                                src={siteSettings.footerLogo}
                                alt={siteSettings?.studioName || "Bespoke Interiors"}
                                width={160}
                                height={70}
                                className="h-14 w-auto object-contain"
                            />
                        ) : (
                            <div className="text-2xl font-heading tracking-widest text-white/40 uppercase">Axis Living</div>
                        )}
                    </Link>
                    <p className="mt-6 text-sm leading-relaxed max-w-xs">
                        {siteSettings?.footerDescription || "Bespoke interior design studio specializing in deliberate, elevated residential and commercial spaces."}
                    </p>
                    <div className="flex space-x-5 mt-8">
                        {siteSettings?.instagram && (
                            <Link href={siteSettings.instagram} target="_blank" className="hover:text-accent transition-colors">
                                <Instagram size={24} />
                            </Link>
                        )}
                        {siteSettings?.pinterest && (
                            <Link href={siteSettings.pinterest} target="_blank" className="hover:text-accent transition-colors">
                                <Pinterest size={24} />
                            </Link>
                        )}
                        {siteSettings?.email && (
                            <Link href={`mailto:${siteSettings.email}`} className="hover:text-accent transition-colors">
                                <Mail size={24} />
                            </Link>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <h4 className="text-white font-heading text-xl mb-6 tracking-wide">Explore</h4>
                    <ul className="space-y-4 text-sm font-medium tracking-wide font-body">
                        <li><Link href="/portfolio" className="hover:text-accent transition-colors uppercase">Portfolio</Link></li>
                        <li><Link href="/pricing" className="hover:text-accent transition-colors uppercase">Services &amp; Pricing</Link></li>
                        <li><Link href="/about" className="hover:text-accent transition-colors uppercase">About the Studio</Link></li>
                        <li><Link href="/booking" className="hover:text-accent transition-colors uppercase">Book Consultation</Link></li>
                    </ul>
                </div>

                <div className="flex flex-col items-center">
                    <h4 className="text-white font-heading text-xl mb-6 tracking-wide">Connect</h4>
                    <ul className="space-y-4 text-sm font-body">
                        <li><a href={`mailto:${siteSettings?.email || "hello@axisliving.co.zm"}`} className="hover:text-accent transition-colors">{siteSettings?.email || "hello@axisliving.co.zm"}</a></li>
                        <li><Link href={siteSettings?.instagram || "https://instagram.com/axisliving.zm"} target="_blank" className="hover:text-accent transition-colors">Instagram</Link></li>
                        <li><Link href={siteSettings?.pinterest || "https://pinterest.com/axisliving"} target="_blank" className="hover:text-accent transition-colors">Pinterest</Link></li>
                        <li>Lusaka, Zambia</li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto w-full pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-widest uppercase font-medium opacity-50">
                <p>{siteSettings?.copyrightText || `© ${new Date().getFullYear()} Axis Living Studio. All rights reserved.`}</p>
                <div className="mt-4 md:mt-0 flex gap-4">
                    {siteSettings?.email && <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>}
                    {siteSettings?.instagram && <Link href={siteSettings.instagram}>Instagram</Link>}
                    {siteSettings?.pinterest && <Link href={siteSettings.pinterest}>Pinterest</Link>}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
