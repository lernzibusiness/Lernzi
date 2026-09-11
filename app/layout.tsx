import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import "./refinements.css";
import "./light.css";
import "./figures.css";
import "./terms.css";
import "./pwa.css";
import PreviewGate from "@/components/preview-gate";
export const metadata: Metadata = {
  title: "Lernzi · Make room for learning",
  description:
    "Your study material. A clearer next step. Flashcards, self-tests and focused 15-minute study sessions.",
  manifest: "/manifest.webmanifest",
  applicationName: "Lernzi",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Lernzi" },
  icons: { icon: "/logo-mark.svg", apple: "/icons/apple-touch-icon.png" },
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#1E3A8A", width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body><PreviewGate>{children}</PreviewGate></body>
    </html>
  );
}
