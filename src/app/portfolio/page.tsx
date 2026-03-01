import { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
    title: "Portfolio Catalog | Axis Living - Bespoke Interiors",
    description: "Explore our collection of bespoke residential and commercial interior design projects. From minimalist retreats to luxury estates.",
};

export default function PortfolioPage() {
    return <PortfolioClient />;
}
