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
  };
}

export default async function ContactsPage() {
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);

  return (
    <main>
      <Suspense fallback={<div className="container py-6 text-muted">{t(locale, "loading.contacts")}</div>}>
        <ContactsClient />
      </Suspense>
    </main>
  );
}
