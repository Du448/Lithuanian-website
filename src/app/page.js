import Link from "next/link";
import Image from "next/image";
import { categories, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";
import HomeBenefitsShowcase from "@/components/HomeBenefitsShowcase";
import RevealGrid from "@/components/anim/RevealGrid";
import MagneticButton from "@/components/anim/MagneticButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Ruler, Truck, Wrench, BadgeCheck, Phone } from "lucide-react";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import { headers } from "next/headers";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function Home() {
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);

  const categoryImages = {
    // Apartment entrance doors (interior corridor)
    "ardurvis-dzivoklim": "https://images.unsplash.com/photo-1774578342058-e2becb500e15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
    // House entrance doors (modern exterior)
    "ardurvis-privatmajai": "https://images.unsplash.com/photo-1758448756207-54505680d130?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
    // Interior doors (bright room with open door)
    "ieksdurvis": "https://images.unsplash.com/photo-1763412050485-d7e1688f8858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
    // Sliding doors (interior)
    "bidamas-durvis": "https://images.unsplash.com/photo-1525570665650-76bb26af503d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
    // Hidden/flush doors (minimal white door)
    "sleptas-durvis": "https://images.unsplash.com/photo-1721739227647-e6936b28c30f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
  };

  const newProducts = products.filter((p) => p.isNew);
  const popularExterior = products
    .filter((p) => p.category.startsWith("ardurvis-"))
    .slice(0, 4);

  return (
    <main>
      {/* LocalBusiness JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HomeAndConstructionBusiness",
            name: "Durų Namai",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Džūkų g. 17",
              addressLocality: "Jonavos r.",
              addressCountry: "LT",
            },
            telephone: ["+370000000", "+371000000"],
            openingHours: ["Mo-Fr 09:00-18:00", "Sa 10:00-15:00"],
            url: process.env.NEXT_PUBLIC_SITE_URL || "https://tnbaltic.lt",
          }),
        }}
      />
      {/* HERO SLIDER */}
      <section className="relative">
        <HeroSlider
            slides={[
              {
                image: "https://images.unsplash.com/photo-1776632001065-ad9efe3ee60e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=2400",
                kicker: locale === "lv" ? "IEKŠDURVIS" : locale === "en" ? "INTERIOR DOORS" : "VIDAUS DURYS",
                title: locale === "lv" ? "Iedvesma jūsu interjeram" : locale === "en" ? "Inspiration for your interior" : "Įkvėpimas jūsų interjerui",
                subtitle: locale === "lv" ? "Izvēlies modernus risinājumus un kvalitatīvus materiālus." : locale === "en" ? "Choose modern solutions and high-quality materials." : "Rinkitės modernius sprendimus ir aukštos kokybės medžiagas.",
                cta: [
                  { label: locale === "lv" ? "Uzzināt vairāk" : locale === "en" ? "Read more" : "Sužinoti daugiau", href: withLocaleHref(locale, "/par-mums"), variant: "outline" },
                ],
              },
              {
                image: "https://images.unsplash.com/photo-1758448756207-54505680d130?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=2400",
                kicker: locale === "lv" ? "IEEJAS DURVIS" : locale === "en" ? "ENTRANCE DOORS" : "LAUKO DURYS",
                title: locale === "lv" ? "Modernas ārdurvis Jūsu mājai" : locale === "en" ? "Modern exterior doors for your home" : "Modernios lauko durys jūsų namams",
                subtitle: locale === "lv" ? "Termodurvis ar augstu energoefektivitāti un skaņas izolāciju." : locale === "en" ? "Thermal doors with high energy efficiency and sound insulation." : "Termo durys su aukštu energiniu efektyvumu ir garso izoliacija.",
                cta: [
                  { label: locale === "lv" ? "Skatīt kolekciju" : locale === "en" ? "View collection" : "Žiūrėti kolekciją", href: withLocaleHref(locale, "/kategorija/ardurvis-privatmajai") },
                ],
              },
              {
                image: "https://images.unsplash.com/photo-1696986324639-caa0590be25f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=2400",
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
      <HomeBenefitsShowcase locale={locale} />

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

      {/* How we work */}
      <section>
        <div className="container">
          <h2 className="mb-4">{t(locale, "home.howWeWork.title")}</h2>
          <div className="relative mb-4 aspect-[16/7] rounded-sm overflow-hidden border border-line bg-[--color-soft]">
            <Image
              src="https://images.unsplash.com/photo-1674649207083-281c2517ab49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600"
              alt={locale === "lv" ? "Durvju uzmērīšana un montāža objektā" : locale === "en" ? "On-site door measurement and installation" : "Durų matavimas ir montavimas objekte"}
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-sm border border-line bg-white p-4">
              <div className="mb-2 text-ink font-medium inline-flex items-center gap-2"><BadgeCheck size={16} className="text-ink/80" /> 1. {t(locale, "home.howWeWork.consultation")}</div>
              <div className="text-[13px] text-muted">{t(locale, "home.howWeWork.consultationDesc")}</div>
            </div>
            <div className="rounded-sm border border-line bg-white p-4">
              <div className="mb-2 text-ink font-medium inline-flex items-center gap-2"><Ruler size={16} className="text-ink/80" /> 2. {t(locale, "home.howWeWork.measurement")}</div>
              <div className="text-[13px] text-muted">{t(locale, "home.howWeWork.measurementDesc")}</div>
            </div>
            <div className="rounded-sm border border-line bg-white p-4">
              <div className="mb-2 text-ink font-medium inline-flex items-center gap-2"><Truck size={16} className="text-ink/80" /> 3. {t(locale, "home.howWeWork.delivery")}</div>
              <div className="text-[13px] text-muted">{t(locale, "home.howWeWork.deliveryDesc")}</div>
            </div>
            <div className="rounded-sm border border-line bg-white p-4">
              <div className="mb-2 text-ink font-medium inline-flex items-center gap-2"><Wrench size={16} className="text-ink/80" /> 4. {t(locale, "home.howWeWork.installation")}</div>
              <div className="text-[13px] text-muted">{t(locale, "home.howWeWork.installationDesc")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="container">
          <h2 className="mb-4">{t(locale, "home.faq.title")}</h2>
          <Accordion type="single" collapsible className="rounded-sm border border-line bg-white">
            {["warranty","installTime","delivery","customSizes","colorChange","payment","measurement","materials"].map((key) => (
              <AccordionItem key={key} value={key} className="border-b border-line last:border-b-0">
                <AccordionTrigger className="px-4 py-3">{t(locale, `home.faq.q.${key}`)}</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-[14px] text-muted">{t(locale, `home.faq.a.${key}`)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="container">
          <h2 className="mb-4">{t(locale, "home.testimonials.title")}</h2>
          <div className="relative mb-4 aspect-[16/7] rounded-sm overflow-hidden border border-line bg-[--color-soft]">
            <Image
              src="https://images.unsplash.com/photo-1768488314310-3742b3c75579?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600"
              alt={locale === "lv" ? "Laimīgi māju īpašnieki dzīvojamā zonā" : locale === "en" ? "Happy homeowners in a living space" : "Laimingi namų savininkai svetainėje"}
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
          <Carousel className="pb-2">
            {[1,2,3,4].map((i) => (
              <CarouselItem key={i} className="w-[320px]">
                <div className="rounded-sm border border-line bg-white p-4">
                  <div className="text-[14px] text-muted">[PARAUGS] {t(locale, "home.testimonials.sample")}</div>
                  <div className="mt-3 text-[13px] text-ink font-medium">{t(locale, "home.testimonials.name")} {i}</div>
                </div>
              </CarouselItem>
            ))}
          </Carousel>
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
      {/* Floating CTA (mobile) */}
      <a
        href={withLocaleHref(locale, "/kontakti")}
        className="fixed right-3 bottom-3 z-40 md:hidden inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] text-white px-4 py-3 shadow-premium hover:bg-[var(--color-accent-dark)]"
        aria-label={t(locale, "home.floatingCta")}
      >
        <Phone size={18} /> {t(locale, "home.floatingCta")}
      </a>
    </main>
  );
}
