import Link from "next/link";
import Image from "next/image";
import { categories, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";

export default function Home() {
  const categoryImages = {
    "ardurvis-dzivoklim": "https://images.unsplash.com/photo-1771354959667-96360bf59eab?auto=format&fit=crop&w=1600&q=80",
    "ardurvis-privatmajai": "https://images.unsplash.com/photo-1613544723301-176686aa9f09?auto=format&fit=crop&w=1600&q=80",
    "ieksdurvis": "https://images.unsplash.com/photo-1603673298820-40d77252226d?auto=format&fit=crop&w=1600&q=80",
    "bidamas-durvis": "https://images.unsplash.com/photo-1525570665650-76bb26af503d?auto=format&fit=crop&w=1600&q=80",
    "sleptas-durvis": "https://images.unsplash.com/photo-1721739227647-e6936b28c30f?auto=format&fit=crop&w=1600&q=80",
  };

  const newProducts = products.filter((p) => p.isNew);
  const popularExterior = products
    .filter((p) => p.category.startsWith("ardurvis-"))
    .slice(0, 4);

  return (
    <main>
      {/* HERO SLIDER */}
      <section className="relative">
        <HeroSlider
            slides={[
              {
                image: "https://images.unsplash.com/photo-1603673298820-40d77252226d?auto=format&fit=crop&w=2400&q=80",
                kicker: "IEKŠDURVIS",
                title: "APARTMENT IN WILANÓW, WARSAW",
                subtitle: "The designers were very careful to select the best quality materials.",
                cta: [
                  { label: "Read more", href: "/inspiracija/wilanow", variant: "outline" },
                ],
              },
              {
                image: "https://images.unsplash.com/photo-1771354959667-96360bf59eab?auto=format&fit=crop&w=2400&q=80",
                kicker: "IEEJAS DURVIS",
                title: "Modernas ārdurvis Jūsu mājai",
                subtitle: "Termodurvis ar augstu energoefektivitāti un skaņas izolāciju.",
                cta: [
                  { label: "Skatīt kolekciju", href: "/kategorija/ardurvis-privatmajai" },
                ],
              },
              {
                image: "https://images.unsplash.com/photo-1742319096910-9efbcf6cddee?auto=format&fit=crop&w=2400&q=80",
                kicker: "SALONI",
                title: "Apmeklē mūsu salonus",
                subtitle: "Uzzini par materiāliem un risinājumiem klātienē.",
                cta: [
                  { label: "Atrast tuvāko", href: "/kontakti", variant: "outline" },
                ],
              },
            ]}
          />
      </section>

      {/* KATEGORIJAS */}
      <section>
        <div className="container">
          <h2 className="mb-4">Populārās kategorijas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((c) => (
              (() => {
                const categoryImage = categoryImages[c.slug] ?? null;

                return (
              <Link
                key={c.slug}
                href={`/kategorija/${c.slug}`}
                className="group block overflow-hidden rounded-sm border border-line bg-white"
              >
                <div className="relative aspect-4/3 bg-[--color-soft]">
                  {categoryImage ? (
                    <Image
                      src={categoryImage}
                      alt={c.name}
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 50vw, 20vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-3">
                  <div className="text-ink font-medium group-hover:text-ink">
                    {c.name}
                  </div>
                </div>
              </Link>
                );
              })()
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
