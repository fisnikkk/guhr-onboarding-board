import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/components/LocaleProvider";

// Lato — the firm's website font. Self-hosted by next/font. Lato has no 600
// weight, so the brand's "600" buttons are rendered at 700.
const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Guhr Steuerberatung · Onboarding-Board",
  description:
    "Internes Kanban-Board für das Mandanten-Onboarding der Guhr Steuerberatungsgesellschaft mbH.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${lato.variable} h-full`}>
      <body className="min-h-full antialiased">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
