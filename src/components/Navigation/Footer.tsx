import Link from "next/link";
import Image from "next/image";
import { Instagram, PinIcon as Pinterest, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-foreground text-white/80 py-20 px-6 lg:px-24">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-16">
                <div className="col-span-1 md:col-span-1">
                    <Link href="/" className="relative block">
                        <Image
                            src="/logo.jpg"
                            alt="Axis Living - Bespoke Interiors"
                            width={160}
                            height={70}
                            className="h-12 w-auto object-contain"
                        />
                    </Link>
                    <p className="mt-6 text-sm leading-relaxed max-w-sm">
                        Designing spaces that feel inevitable. We create interiors that are as intentional as they are beautiful &mdash; tailored to your life, not a trend.
                    </p>
                    <div className="flex space-x-5 mt-8">
                        <Link href="https://instagram.com" target="_blank" className="hover:text-accent transition-colors">
                            <Instagram size={24} />
                        </Link>
                        <Link href="https://pinterest.com" target="_blank" className="hover:text-accent transition-colors">
                            <Pinterest size={24} />
                        </Link>
                    </div>
                </div>

                <div className="col-span-1">
                    <h4 className="text-white font-heading text-xl mb-6 tracking-wide">Explore</h4>
                    <ul className="space-y-4 text-sm font-medium tracking-wide font-body">
                        <li><Link href="/portfolio" className="hover:text-accent transition-colors uppercase">Portfolio</Link></li>
                        <li><Link href="/pricing" className="hover:text-accent transition-colors uppercase">Services &amp; Pricing</Link></li>
                        <li><Link href="/about" className="hover:text-accent transition-colors uppercase">About the Studio</Link></li>
                        <li><Link href="/booking" className="hover:text-accent transition-colors uppercase">Book Consultation</Link></li>
                    </ul>
                </div>

                <div className="col-span-1">
                    <h4 className="text-white font-heading text-xl mb-6 tracking-wide">Connect</h4>
                    <ul className="space-y-4 text-sm font-body">
                        <li className="flex items-center space-x-3"><Mail size={18} className="text-accent" /> <span>hello@axisliving.co.zm</span></li>
                        <li className="flex items-center space-x-3"><Instagram size={18} className="text-accent" /> <span>Instagram</span></li>
                        <li className="flex items-center space-x-3"><Pinterest size={18} className="text-accent" /> <span>Pinterest</span></li>
                        <li className="flex items-center space-x-3 items-start"><MapPin size={18} className="text-accent mt-0.5" /> <span>Lusaka, Zambia</span></li>
                    </ul>
                </div>

                <div className="col-span-1 flex flex-col items-center md:items-end justify-center bg-white/10 p-8 rounded-lg border border-white/20">
                    <p className="text-white text-center md:text-right font-heading text-xl mb-6 leading-relaxed italic">
                        Ready to transform your space into something inevitable?
                    </p>
                    <Link
                        href="/booking"
                        className="w-full text-center bg-accent text-white px-8 py-4 rounded-full hover:bg-white hover:text-accent transition-all font-bold tracking-widest uppercase text-xs"
                    >
                        Book a Free Consultation
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-widest uppercase font-medium opacity-50">
                <p>Axis Living &middot; Bespoke Interiors &middot; Est. 2026</p>
                <p className="mt-4 md:mt-0">Lusaka, Zambia &middot; hello@axisliving.co.zm &middot; Instagram &middot; Pinterest</p>
            </div>
        </footer>
    );
};

export default Footer;
