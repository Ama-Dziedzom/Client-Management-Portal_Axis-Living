import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
    title: "Our Story | Axis Living - Bespoke Interiors",
    description: "Learn about the philosophy, the designer, and the 4-step process behind our studio's bespoke interior transformations in Lusaka, Zambia.",
};

export default function AboutPage() {
    return <AboutClient />;
}
