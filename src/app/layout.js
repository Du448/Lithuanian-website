import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Using system font stack via Tailwind's font-sans to avoid build-time fetch

export const metadata = {
  title: "Durvju Nams — ārdurvis un iekšdurvis Latvijā",
  description:
    "Durvju Nams: metāla ārdurvis un iekšdurvis, profesionāla montāža un piegāde visā Latvijā. Plašs sortiments, konsultācijas un garantija.",
  openGraph: {
    title: "Durvju Nams — ārdurvis un iekšdurvis Latvijā",
    description:
      "Durvju Nams: metāla ārdurvis un iekšdurvis, montāža un piegāde visā Latvijā.",
    siteName: "Durvju Nams",
    locale: "lv_LV",
    type: "website",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },
  icons: {
    icon: "/favicon.ico",
    other: [{ rel: "logo", url: "/logo.svg" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="lv">
      <body className={`antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
