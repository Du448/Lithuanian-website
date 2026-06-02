import Link from "next/link";
import { categories, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const newProducts = products.filter((p) => p.isNew);
  const popularExterior = products
    .filter((p) => p.category.startsWith("ardurvis-"))
    .slice(0, 4);

  return (
    <main>
      {/* HERO */}
      <section className="relative">
        <div className="container">
          <div className="relative overflow-hidden rounded-sm border border-line">
            <div className="h-[60vh] sm:h-[70vh] bg-[--color-soft] flex items-center">
              <div className="px-6 sm:px-10">
                <h1 className="text-3xl sm:text-5xl font-semibold tracking-wide text-ink leading-tight max-w-2xl">
                  Drošas durvis Tavām mājām
                </h1>
                <p className="mt-3 text-muted max-w-xl">
                  Ārdurvis un iekšdurvis ar piegādi un montāžu visā Latvijā.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/kategorija/ardurvis-dzivoklim" className="bg-accent hover:bg-accent-dark text-white rounded-sm px-5 py-2">
                    Skatīt ārdurvis
                  </Link>
                  <Link href="/kategorija/ieksdurvis" className="border border-line text-ink rounded-sm px-5 py-2">
                    Skatīt iekšdurvis
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KATEGORIJAS */}
      <section>
        <div className="container">
          <h2 className="mb-4">Populārās kategorijas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/kategorija/${c.slug}`}
                className="group block overflow-hidden rounded-sm border border-line bg-white"
              >
                <div className="aspect-[4/3] bg-[--color-soft]"></div>
                <div className="p-3">
                  <div className="text-ink font-medium group-hover:text-ink">
                    {c.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* JAUNUMI */}
      <section>
        <div className="container">
          <h2 className="mb-4">Jaunumi</h2>
          <div className="grid grid-flow-col auto-cols-[70%] sm:auto-cols-[45%] md:auto-cols-[30%] lg:auto-cols-[22%] gap-4 overflow-x-auto pb-2">
            {newProducts.map((p) => (
              <div key={p.id} className="min-w-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULĀRĀKĀS ĀRDURVIS */}
      <section>
        <div className="container">
          <h2 className="mb-4">Populārākās ārdurvis</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularExterior.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA josla */}
      <section>
        <div className="container">
          <div className="rounded-sm border border-line bg-accent text-white px-6 py-6 sm:px-10 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-lg sm:text-xl font-medium">
              Nezini, kuras durvis izvēlēties? Sazinies ar mums bezmaksas konsultācijai.
            </div>
            <Link href="/kontakti" className="bg-white text-ink rounded-sm px-5 py-2">
              Sazināties
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
