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
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  return <CategoryClient slug={slug} />;
}
