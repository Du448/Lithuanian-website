import Link from "next/link";
import Image from "next/image";
import { categories, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";
import RevealGrid from "@/components/anim/RevealGrid";
import MagneticButton from "@/components/anim/MagneticButton";
import { headers } from "next/headers";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function Home() {
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);

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
                kicker: locale === "lv" ? "IEKŠDURVIS" : locale === "en" ? "INTERIOR DOORS" : "VIDAUS DURYS",
                title: locale === "lv" ? "Iedvesma jūsu interjeram" : locale === "en" ? "Inspiration for your interior" : "Įkvėpimas jūsų interjerui",
                subtitle: locale === "lv" ? "Izvēlies modernus risinājumus un kvalitatīvus materiālus." : locale === "en" ? "Choose modern solutions and high-quality materials." : "Rinkitės modernius sprendimus ir aukštos kokybės medžiagas.",
                cta: [
                  { label: locale === "lv" ? "Uzzināt vairāk" : locale === "en" ? "Read more" : "Sužinoti daugiau", href: withLocaleHref(locale, "/par-mums"), variant: "outline" },
                ],
              },
              {
                image: "https://images.unsplash.com/photo-1771354959667-96360bf59eab?auto=format&fit=crop&w=2400&q=80",
                kicker: locale === "lv" ? "IEEJAS DURVIS" : locale === "en" ? "ENTRANCE DOORS" : "LAUKO DURYS",
                title: locale === "lv" ? "Modernas ārdurvis Jūsu mājai" : locale === "en" ? "Modern exterior doors for your home" : "Modernios lauko durys jūsų namams",
                subtitle: locale === "lv" ? "Termodurvis ar augstu energoefektivitāti un skaņas izolāciju." : locale === "en" ? "Thermal doors with high energy efficiency and sound insulation." : "Termo durys su aukštu energiniu efektyvumu ir garso izoliacija.",
                cta: [
                  { label: locale === "lv" ? "Skatīt kolekciju" : locale === "en" ? "View collection" : "Žiūrėti kolekciją", href: withLocaleHref(locale, "/kategorija/ardurvis-privatmajai") },
                ],
              },
              {
                image: "https://images.unsplash.com/photo-1742319096910-9efbcf6cddee?auto=format&fit=crop&w=2400&q=80",
                kicker: locale === "lv" ? "SALONI" : locale === "en" ? "SHOWROOM" : "SALONAS",
                title: locale === "lv" ? "Apmeklē mūsu salonu" : locale === "en" ? "Visit our showroom" : "Apsilankykite mūsų salone",
                subtitle: locale === "lv" ? "Uzzini par materiāliem un risinājumiem klātienē." : locale === "en" ? "Learn about materials and solutions in person." : "Sužinokite apie medžiagas ir sprendimus gyvai.",
                cta: [
                  { label: locale === "lv" ? "Atrast tuvāko" : locale === "en" ? "Find us" : "Rasti mus", href: withLocaleHref(locale, "/kontakti"), variant: "outline" },
                ],
              },
            ]}
          />
      </section>

      {/* KATEGORIJAS */}
      <section>
        <div className="container">
          <h2 className="mb-4">{t(locale, "home.popularCategories")}</h2>
          <RevealGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((c) => (
              (() => {
                const categoryImage = categoryImages[c.slug] ?? null;
                const categoryName = t(locale, `categories.${c.slug}`) || c.name;

                return (
              <Link
                key={c.slug}
                href={withLocaleHref(locale, `/kategorija/${c.slug}`)}
                className="group block overflow-hidden rounded-sm border border-line bg-white transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.22)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-[--color-soft]">
                  {categoryImage ? (
                    <Image
                      src={categoryImage}
                      alt={categoryName}
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 50vw, 20vw"
                      className="object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.06] motion-reduce:transition-none"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="p-3">
                  <div className="text-ink font-medium group-hover:text-ink">
                    {categoryName}
                  </div>
                </div>
              </Link>
                );
              })()
            ))}
          </RevealGrid>
        </div>
      </section>

      {/* JAUNUMI */}
      <section>
        <div className="container">
          <h2 className="mb-4">{t(locale, "home.newArrivals")}</h2>
          <RevealGrid className="grid grid-flow-col auto-cols-[70%] sm:auto-cols-[45%] md:auto-cols-[30%] lg:auto-cols-[22%] gap-4 overflow-x-auto pb-2">
            {newProducts.map((p) => (
              <div key={p.id} className="min-w-0">
                <ProductCard product={p} />
              </div>
            ))}
          </RevealGrid>
        </div>
      </section>

      {/* POPULĀRĀKĀS ĀRDURVIS */}
      <section>
        <div className="container">
          <h2 className="mb-4">{t(locale, "home.popularExterior")}</h2>
          <RevealGrid className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularExterior.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </RevealGrid>
        </div>
      </section>

      {/* CTA josla */}
      <section>
        <div className="container">
          <div className="rounded-sm border border-line bg-accent text-white px-6 py-6 sm:px-10 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-lg sm:text-xl font-medium">
              {t(locale, "home.ctaTitle")}
            </div>
            <MagneticButton>
              <Link
                href={withLocaleHref(locale, "/kontakti")}
                className="inline-block bg-white text-ink rounded-sm px-6 py-2.5 transition-shadow duration-300 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]"
              >
                {t(locale, "home.ctaButton")}
              </Link>
            </MagneticButton>
          </div>
        </div>
      </section>
    </main>
  );
}
