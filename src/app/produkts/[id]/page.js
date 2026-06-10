import { getProductById } from "@/data/products";
import ProductClient from "@/components/ProductClient";
import { headers } from "next/headers";
import { getLocaleFromPathname, t } from "@/lib/i18n";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);

  const product = getProductById(id);
  if (!product) return { title: t(locale, "product.notFound") };
  const title = `${product.name} — ${product.collection} | Durų Namai`;

  const description =
    locale === "en"
      ? `${product.collection} collection doors. Price from €${product.price}. Installation and delivery across Lithuania.`
      : locale === "lv"
        ? `${product.collection} kolekcijas durvis. Cena no €${product.price}. Montāža un piegāde visā Lietuvā.`
        : `${product.collection} kolekcijos durys. Kaina nuo €${product.price}. Montavimas ir pristatymas visoje Lietuvoje.`;

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

export default async function ProductPage({ params }) {
  const { id } = await params;
  return <ProductClient id={id} />;
}
