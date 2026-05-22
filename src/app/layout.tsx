import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://orioncomputers.in"),
  title: "Orion Computers, Nanded | Laptop Store, Repairs & Accessories",
  description:
    "Trusted computer showroom in Nanded since 1999 for laptops, repairs, accessories, printers, and business technology solutions.",
  keywords: [
    "Laptop Store in Nanded",
    "Computer Shop in Nanded",
    "Laptop Repair in Nanded",
    "Orion Computers Nanded",
  ],
  openGraph: {
    title: "Orion Computers, Nanded",
    description:
      "Trusted local computer store in Nanded since 1999 for laptops, repairs, accessories, and office technology solutions.",
    url: "https://orioncomputers.in",
    siteName: "Orion Computers",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
