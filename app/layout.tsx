import type { Metadata } from "next";
import { Cormorant_Garamond, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "The Wedding Of",
  description: "Online Wedding Invitation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${cormorant.variable} ${playfair.variable} ${poppins.variable} font-poppins text-bugis-maroon bg-bugis-cream antialiased`}>
        {children}
      </body>
    </html>
  );
}
