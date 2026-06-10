import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { headers } from "next/headers";
import { getLocaleFromPathname } from "@/lib/i18n";

// Using system font stack via Tailwind's font-sans to avoid build-time fetch

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Durų Namai — lauko ir vidaus durys Lietuvoje",
  description:
    "Durų Namai: lauko ir vidaus durys, profesionalus montavimas ir pristatymas visoje Lietuvoje. Platus asortimentas, konsultacijos ir garantija.",
  openGraph: {
    title: "Durų Namai — lauko ir vidaus durys Lietuvoje",
    description:
      "Durų Namai: lauko ir vidaus durys, montavimas ir pristatymas visoje Lietuvoje.",
    siteName: "Durų Namai",
    locale: "lt_LT",
    type: "website",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://tnbaltic.lt",
  },
  icons: {
    icon: "/favicon.ico",
    other: [{ rel: "logo", url: "/logo.svg" }],
  },
};

export default async function RootLayout({ children }) {
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);

  return (
    <html lang={locale}>
      <body className={`antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
