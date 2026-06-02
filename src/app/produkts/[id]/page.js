import { getProductById } from "@/data/products";
import ProductClient from "@/components/ProductClient";

export function generateMetadata({ params }) {
  const product = getProductById(params.id);
  if (!product) return { title: "Produkts nav atrasts" };
  const title = `${product.name} — ${product.collection} | Durų Namai`;
  const description = `${product.collection} kolekcijos durys. Kaina nuo €${product.price}. Montavimas ir pristatymas visoje Lietuvoje.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: "lt_LT",
      siteName: "Durų Namai",
      type: "product",
    },
  };
}

export default function ProductPage({ params }) {
  return <ProductClient id={params.id} />;
}
