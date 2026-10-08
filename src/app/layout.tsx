import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const display = Outfit({
  subsets: ["latin"],
  weight: ["500", "800", "900"],
  variable: "--font-outfit",
});

const body = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: { default: "Leihbar", template: "%s – Leihbar" },
  description: "Leihen statt kaufen – Dinge am Campus anbieten, finden, anfragen.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
