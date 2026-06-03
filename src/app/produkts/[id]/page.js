import { getProductById } from "@/data/products";
import ProductClient from "@/components/ProductClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProductById(id);
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
      type: "website",
    },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  return <ProductClient id={id} />;
}
