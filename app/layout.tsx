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

// Ganti dengan domain kamu yang sebenarnya (tanpa trailing slash)
const siteUrl = "https://bottingamirwardah.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "The Wedding Of Amir & Wardah",
  description:
    "Tanpa Mengurangi Rasa Hormat. Kami Bermaksud Mengundang Bapak/Ibu/Saudara/i, Pada Acara Pernikahan Kami",
  openGraph: {
    title: "The Wedding Of Amir & Wardah",
    description:
      "Tanpa Mengurangi Rasa Hormat. Kami Bermaksud Mengundang Bapak/Ibu/Saudara/i, Pada Acara Pernikahan Kami",
    url: siteUrl,
    siteName: "The Wedding Of Amir & Wardah",
    images: [
      {
        url: "/images/og-cover.jpg", // taruh gambar 1200x630 di public/images/og-cover.jpg
        width: 1200,
        height: 630,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Wedding Of Amir & Wardah",
    description:
      "Tanpa Mengurangi Rasa Hormat. Kami Bermaksud Mengundang Bapak/Ibu/Saudara/i, Pada Acara Pernikahan Kami",
    images: ["/images/og-cover.jpg"],
  },
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
