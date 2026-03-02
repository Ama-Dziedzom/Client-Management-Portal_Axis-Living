import { fetchSiteSettings, fetchPricing } from "../../lib/data";
import PricingClient from "./PricingClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing & Investment | Bespoke Interiors",
    description: "Honest, transparent pricing for bespoke interior design services.",
};

export default async function PricingPage() {
    const [siteSettings, pricingData] = await Promise.all([
        fetchSiteSettings(),
        fetchPricing()
    ]);
    return <PricingClient siteSettings={siteSettings} pricingData={pricingData} />;
}
