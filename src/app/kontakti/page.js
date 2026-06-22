import ContactsClient from "@/components/ContactsClient";
import { Suspense } from "react";
import { headers } from "next/headers";
import { getLocaleFromPathname, t } from "@/lib/i18n";

export async function generateMetadata() {
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);

  const title = `${t(locale, "contacts.title")} | Durų Namai`;
  const description = t(locale, "contacts.contactUs");

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://tnbaltic.lt";
  const pathLt = `/lt/kontakti`;
  const pathLv = `/lv/kontakti`;
  const pathEn = `/en/kontakti`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: locale === "lv" ? "lv_LV" : locale === "en" ? "en_US" : "lt_LT",
      siteName: "Durų Namai",
      type: "website",
    },
    alternates: {
      canonical: `${base}${locale === "lv" ? pathLv : locale === "en" ? pathEn : pathLt}`,
      languages: { lt: `${base}${pathLt}`, lv: `${base}${pathLv}`, en: `${base}${pathEn}` },
    },
  };
}

export default async function ContactsPage() {
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://tnbaltic.lt";

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HomeAndConstructionBusiness",
            name: "Durų Namai",
            address: { "@type": "PostalAddress", streetAddress: "Džūkų g. 17", addressLocality: "Jonavos r.", addressCountry: "LT" },
            telephone: ["+370000000", "+371000000"],
            openingHours: ["Mo-Fr 09:00-18:00", "Sa 10:00-15:00"],
            url: base,
          }),
        }}
      />
      <Suspense fallback={<div className="container py-6 text-muted">{t(locale, "loading.contacts")}</div>}>
        <ContactsClient />
      </Suspense>
    </main>
  );
}
