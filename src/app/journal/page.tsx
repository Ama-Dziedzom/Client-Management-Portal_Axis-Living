import { Metadata } from "next";
import JournalClient from "./JournalClient";

export const metadata: Metadata = {
    title: "Journal | Axis Living - Design Thinking & Stories",
    description: "Explore our collection of design thinking, project stories, and honest advice from the Axis Living studio.",
};

export default function JournalPage() {
    return <JournalClient />;
}
