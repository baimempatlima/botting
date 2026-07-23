import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bugis: {
          maroon: "#6B1D1D",
          gold: "#C9A227",
          deepgreen: "#1F4B3F",
          cream: "#F5EEDC",
        }
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "serif"],
        playfair: ["var(--font-playfair)", "serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
