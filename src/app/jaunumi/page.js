import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export const metadata = { title: "Jaunumi" };

export default function JaunumiPage() {
  const news = products.filter((p) => p.isNew === true);

  return (
    <main>
      <section className="border-b border-line">
        <div className="container py-6">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-wide text-ink">Jaunumi</h1>
          <p className="mt-2 max-w-3xl text-muted">
            Jaunākie durvju modeļi mūsu sortimentā — iepazīsti svaigākās kolekcijas un dizainus.
          </p>
        </div>
      </section>

      <section>
        <div className="container py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
