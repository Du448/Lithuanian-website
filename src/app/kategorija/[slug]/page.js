import { getCategoryBySlug } from "@/data/products";
import CategoryClient from "@/components/CategoryClient";

const LT_CATEGORY_NAMES = {
  "ardurvis-dzivoklim": "Butui lauko durys",
  "ardurvis-privatmajai": "Namo lauko durys",
  "ieksdurvis": "Vidaus durys",
  "bidamas-durvis": "Stumdomos durys",
  "sleptas-durvis": "Paslėptos durys",
};

export function generateMetadata({ params }) {
  const slug = params?.slug;
  const category = getCategoryBySlug(slug);
  const nameLt = LT_CATEGORY_NAMES[slug] || category?.name || "Kategorija";
  const title = `${nameLt} | Durų Namai`;
  const description = `${nameLt} — metalinės durys ir vidaus durys. Montavimas ir pristatymas visoje Lietuvoje.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: "lt_LT",
      siteName: "Durų Namai",
      type: "website",
    },
  };
}

export default function CategoryPage({ params }) {
  return <CategoryClient slug={params.slug} />;
}
