import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#FAF9F6",
                foreground: "#1C1C1C",
                accent: "#2F402C", // Dark Green
                tan: "#C6B9AA",    // Tan/Beige
                primary: "#1C1C1C",
                secondary: "#FAF9F6",
                gold: "#C9A84C",
            },
            fontFamily: {
                heading: ["Quinsi", "serif"],
                body: ["var(--font-manrope)", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
