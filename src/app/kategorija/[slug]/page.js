import { getCategoryBySlug } from "@/data/products";
import CategoryClient from "@/components/CategoryClient";
import { headers } from "next/headers";
import { getLocaleFromPathname, t } from "@/lib/i18n";

const LT_CATEGORY_NAMES = {
  "ardurvis-dzivoklim": "Butui lauko durys",
  "ardurvis-privatmajai": "Namo lauko durys",
  "ieksdurvis": "Vidaus durys",
  "bidamas-durvis": "Stumdomos durys",
  "sleptas-durvis": "Paslėptos durys",
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);

  const category = getCategoryBySlug(slug);
  const nameLt = LT_CATEGORY_NAMES[slug] || category?.name || "Kategorija";
  const name =
    locale === "en"
      ? category?.name || nameLt
      : locale === "lv"
        ? category?.name || nameLt
        : nameLt;

  const title = `${name} | Durų Namai`;
  const description =
    locale === "en"
      ? `${name} — exterior and interior doors. Installation and delivery across Lithuania.`
      : locale === "lv"
        ? `${name} — metāla un iekšdurvis. Montāža un piegāde visā Lietuvā.`
        : `${name} — metalinės durys ir vidaus durys. Montavimas ir pristatymas visoje Lietuvoje.`;

  const ogLocale = locale === "lv" ? "lv_LV" : locale === "en" ? "en_US" : "lt_LT";
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://tnbaltic.lt";
  const pathLt = `/lt/kategorija/${slug}`;
  const pathLv = `/lv/kategorija/${slug}`;
  const pathEn = `/en/kategorija/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: ogLocale,
      siteName: "Durų Namai",
      type: "website",
    },
    alternates: {
      canonical: `${base}${locale === "lv" ? pathLv : locale === "en" ? pathEn : pathLt}`,
      languages: {
        lt: `${base}${pathLt}`,
        lv: `${base}${pathLv}`,
        en: `${base}${pathEn}`,
      },
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: slug,
        item: `/${locale}/kategorija/${slug}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
      <CategoryClient slug={slug} />
    </>
  );
}
