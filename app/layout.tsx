import type { Metadata } from "next";
import "./globals.css";
import "./refinements.css";
export const metadata: Metadata = {
  title: "Lernzi · Make room for learning",
  description:
    "Your study material. A clearer next step. Flashcards, self-tests and focused 15-minute study sessions.",
  icons: { icon: "/logo-mark.svg" },
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
