import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export const metadata = { title: "Akcijas" };

export default function AkcijasPage() {
  const discounted = products.filter((p) => p.oldPrice != null);

  return (
    <main>
      <section className="border-b border-line">
        <div className="container py-6">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-wide text-ink">Akcijas</h1>
          <p className="mt-2 max-w-3xl text-muted">
            Šeit atradīsi durvju modeļus ar īpašām atlaidēm. Piedāvājumi spēkā uz ierobežotu
            laiku vai līdz preču izpirkšanai.
          </p>
        </div>
      </section>

      <section>
        <div className="container py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {discounted.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
