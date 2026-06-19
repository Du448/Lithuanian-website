"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Heart, Shield, ChevronUp, ChevronDown } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import AccordionItem from "@/components/anim/AccordionItem";
import MagneticButton from "@/components/anim/MagneticButton";
import RevealGrid from "@/components/anim/RevealGrid";
import { getProductById, getProductsByCategory } from "@/data/products";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, translateColorLabel, withLocaleHref, t } from "@/lib/i18n";
import { isWishlisted, toggleWishlistId } from "@/lib/wishlist";

export default function ProductClient({ id }) {
  const locale = getLocaleFromPathname(usePathname());
  const product = getProductById(id);
  const productImages = product?.images && product.images.length > 0 ? product.images : ["placeholder"];
  const images = productImages;
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeSize, setActiveSize] = useState(product?.sizes?.[0] || "");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const thumbsRef = useRef(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const scrollThumbs = (dir) => {
    const el = thumbsRef.current;
    if (!el) return;
    const firstBtn = el.querySelector("button");
    const step = firstBtn ? firstBtn.getBoundingClientRect().height + 8 : 80; // 8 = gap-2
    el.scrollBy({ top: dir * step, behavior: "smooth" });
  };

  const updateScrollButtons = () => {
    const el = thumbsRef.current;
    if (!el) return;
    const max = Math.max(0, el.scrollHeight - el.clientHeight);
    const top = el.scrollTop;
    setCanScrollUp(top > 0);
    setCanScrollDown(top < max);
  };

  useEffect(() => {
    if (!product?.id) return;
    const sync = () => setWishlisted(isWishlisted(product.id));
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("wishlist:change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("wishlist:change", sync);
    };
  }, [product?.id]);

  useEffect(() => {
    updateScrollButtons();
    const el = thumbsRef.current;
    if (!el) return;
    const onScroll = () => updateScrollButtons();
    el.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => updateScrollButtons();
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [images.length]);

  if (!product) {
    return (
      <main className="container py-10">
        <div className="text-ink">{t(locale, "product.notFound")}</div>
      </main>
    );
  }

  const hasOffer = product.oldPrice != null && product.oldPrice > product.price;
  const discount = hasOffer ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  const similar = getProductsByCategory(product.category).filter((p) => p.id !== product.id).slice(0, 4);

  // JSON-LD breadcrumbs
  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t(locale, "common.home"),
        item: withLocaleHref(locale, "/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.name,
        item: withLocaleHref(locale, `/produkts/${product.id}`),
      },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />

      <section className="border-b border-line">
        <div className="container py-6">
          <div className="text-sm text-muted">
            <Link className="text-ink hover:text-ink" href={withLocaleHref(locale, "/")}>{t(locale, "common.home")}</Link>
            <span className="mx-1 text-muted">/</span>
            <span className="text-ink">{product.name}</span>
          </div>
        </div>
      </section>

      <section>
        <div className="container py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Gallery */}
            <div>
              {/* Shared aspect box to keep thumbnails column height equal to main image */}
              <div className="relative aspect-[3/4]">
                <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-[112px_1fr] gap-3">
                  {/* Vertical thumbnails (desktop) */}
                  <div className="relative hidden lg:block h-full overflow-hidden bg-[--color-soft] rounded-sm">
                    <button
                      type="button"
                      className={`absolute left-1/2 -translate-x-1/2 top-2 z-20 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-white shadow-md text-ink transition-opacity hover:bg-ink/10 ${canScrollUp ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                      aria-label={t(locale, "product.previous")}
                      onClick={() => scrollThumbs(-1)}
                    >
                      <ChevronUp size={18} />
                    </button>
                    <div ref={thumbsRef} className="absolute inset-x-0 top-[52px] bottom-[52px] overflow-y-auto no-scrollbar pr-1">
                      <div className="flex h-max flex-col gap-2">
                        {images.map((src, idx) => (
                          <button
                            key={`v-${idx}`}
                            className={`relative group aspect-square rounded-sm border ${idx === selectedIdx ? "border-[--color-accent]" : "border-line"} bg-[--color-soft] text-xs text-muted w-full overflow-hidden`}
                            onClick={() => { setSelectedIdx(idx); setActiveIdx(idx); }}
                            onMouseEnter={() => setActiveIdx(idx)}
                            onMouseLeave={() => setActiveIdx(selectedIdx)}
                            onFocus={() => setActiveIdx(idx)}
                            onBlur={() => setActiveIdx(selectedIdx)}
                            aria-label={t(locale, "product.imageN").replace("{n}", String(idx + 1))}
                          >
                            {src === "placeholder" ? (
                              t(locale, "product.image")
                            ) : (
                              <span className="relative block h-full w-full overflow-hidden">
                                <Image
                                  src={src}
                                  alt={`${product.name} attēls ${idx + 1}`}
                                  fill
                                  unoptimized
                                  referrerPolicy="no-referrer"
                                  sizes="120px"
                                  className="object-contain"
                                />
                              </span>
                            )}
                            <span aria-hidden className="pointer-events-none absolute inset-0 rounded-sm ring-2 ring-[var(--color-ink)] opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`absolute left-1/2 -translate-x-1/2 bottom-2 z-20 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-white shadow-md text-ink transition-opacity hover:bg-ink/10 ${canScrollDown ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                      aria-label={t(locale, "product.next")}
                      onClick={() => scrollThumbs(1)}
                    >
                      <ChevronDown size={18} />
                    </button>
                  </div>

                  {/* Main image */}
                  <div className="relative overflow-hidden rounded-sm">
                    {images[activeIdx] === "placeholder" ? (
                      <div className="w-full h-full bg-[--color-soft] flex items-center justify-center text-muted">
                        <span>{t(locale, "product.image")}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setLightboxIdx(activeIdx);
                          setLightboxOpen(true);
                        }}
                        className="relative block w-full h-full"
                        aria-label={t(locale, "product.openImage")}
                      >
                        <Image
                          src={images[activeIdx]}
                          alt={product.name}
                          fill
                          unoptimized
                          referrerPolicy="no-referrer"
                          loading="eager"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-contain"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Thumbnails grid (mobile only) */}
              <div className="mt-3 grid grid-cols-5 gap-2 lg:hidden">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    className={`relative group aspect-square rounded-sm border ${idx === selectedIdx ? "border-[--color-accent]" : "border-line"} bg-[--color-soft] text-xs text-muted overflow-hidden`}
                    onClick={() => { setSelectedIdx(idx); setActiveIdx(idx); }}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onMouseLeave={() => setActiveIdx(selectedIdx)}
                    onFocus={() => setActiveIdx(idx)}
                    onBlur={() => setActiveIdx(selectedIdx)}
                    aria-label={t(locale, "product.imageN").replace("{n}", String(idx + 1))}
                  >
                    {src === "placeholder" ? (
                      t(locale, "product.image")
                    ) : (
                      <span className="relative block h-full w-full overflow-hidden">
                        <Image
                          src={src}
                          alt={`${product.name} attēls ${idx + 1}`}
                          fill
                          unoptimized
                          referrerPolicy="no-referrer"
                          sizes="120px"
                          className="object-contain"
                        />
                      </span>
                    )}
                    <span aria-hidden className="pointer-events-none absolute inset-0 rounded-sm ring-2 ring-[var(--color-ink)] opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Info */}
            <div>
              <div className="text-[12px] font-semibold tracking-wide text-ink">{product.collection}</div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-wide text-ink">{product.name}</h1>

              <div className="mt-2 flex items-baseline gap-2">
                {hasOffer ? (
                  <>
                    <span className="text-accent text-2xl font-semibold">€{product.price}</span>
                    <span className="text-muted line-through">€{product.oldPrice}</span>
                    <span className="text-accent font-semibold">-{discount}%</span>
                  </>
                ) : (
                  <span className="text-ink text-2xl font-semibold">€{product.price}</span>
                )}
              </div>

              {/* Colors (display only: exterior / interior) */}
              {product.colors?.length ? (
                <div className="mt-5">
                  <div className="text-sm text-muted mb-2">{t(locale, "product.colorLabel")}</div>
                  <div className="flex flex-wrap items-center gap-2 text-[15px] text-ink">
                    <span className="rounded-sm border border-line px-3 py-1.5">{translateColorLabel(locale, product.colors[0])}</span>
                    {product.colors[1] ? (
                      <>
                        <span className="text-muted">/</span>
                        <span className="rounded-sm border border-line px-3 py-1.5">{translateColorLabel(locale, product.colors[1])}</span>
                      </>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {/* Sizes */}
              {product.sizes?.length ? (
                <div className="mt-5">
                  <div className="text-sm text-muted mb-2">{t(locale, "product.size")}</div>
                  <select
                    value={activeSize}
                    onChange={(e) => setActiveSize(e.target.value)}
                    className="min-h-11 rounded-sm border border-line bg-white px-3 py-2 text-[15px] text-ink transition-colors hover:border-[--color-muted] focus:outline-none focus:ring-2 focus:ring-[--color-accent]"
                  >
                    {product.sizes.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ) : null}

              {/* Security class */}
              {product.security ? (
                <div className="mt-3 flex items-center gap-2 text-[15px] text-muted">
                  <Shield size={16} />
                  <span>{product.security}</span>
                </div>
              ) : null}

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <MagneticButton>
                  <Link
                    href={withLocaleHref(locale, `/kontakti?produkts=${encodeURIComponent(product.id)}`)}
                    className="inline-block bg-accent hover:bg-accent-dark text-white rounded-sm px-6 py-2.5 transition-colors duration-300"
                  >
                    {t(locale, "product.requestOffer")}
                  </Link>
                </MagneticButton>
                <button
                  type="button"
                  className={`rounded-sm border border-line px-5 py-2.5 inline-flex items-center gap-2 transition-[border-color,transform] duration-200 hover:border-[--color-muted] active:scale-[0.97] ${wishlisted ? "text-accent" : "text-ink"}`}
                  onClick={() => toggleWishlistId(product.id)}
                >
                  <Heart size={18} />
                  {t(locale, "product.addWishlist")}
                </button>
              </div>

              <div className="mt-3 text-[15px] text-muted">{t(locale, "product.freeServices")}</div>

              {/* Accordions */}
              <div className="mt-6 divide-y divide-[--color-line] border border-line rounded-sm bg-white">
                <AccordionItem title={t(locale, "product.specs")} defaultOpen>
                    <ul className="list-disc pl-5">
                      {Object.entries(product.specs || {}).map(([k, v]) => {
                        const labelKey =
                          k === "Vērtnes biezums"
                            ? "specs.leafThickness"
                            : k === "Kārbas biezums"
                              ? "specs.frameThickness"
                              : k === "Svars"
                                ? "specs.weight"
                                : k === "Slēdzenes"
                                  ? "specs.locks"
                                  : k === "Pildījums"
                                    ? "specs.filling"
                                    : k === "Ārējā apdare"
                                      ? "specs.outsideFinish"
                                      : k === "Iekšējā apdare"
                                        ? "specs.insideFinish"
                                        : k === "Apdare"
                                          ? "specs.finish"
                                          : k === "Actiņa"
                                            ? "specs.peephole"
                                            : k === "Furnitūra"
                                              ? "specs.hardware"
                                              : null;

                        const label = labelKey ? t(locale, labelKey) : k;
                        const rawValue = typeof v === "string" ? v : String(v);
                        const value =
                          rawValue === "Ir"
                            ? t(locale, "values.yes")
                            : rawValue === "Nav"
                              ? t(locale, "values.no")
                              : rawValue;

                        return (
                          <li key={k}>
                            <span className="text-muted">{label}:</span> {value}
                          </li>
                        );
                      })}
                    </ul>
                </AccordionItem>
                <AccordionItem title={t(locale, "product.set")}>
                  {t(locale, "pages.services.description")}
                </AccordionItem>
                <AccordionItem title={t(locale, "product.installDelivery")}>
                  {t(locale, "product.freeServices")}
                </AccordionItem>
                <AccordionItem title={t(locale, "product.warranty")}>
                  {t(locale, "pages.about.featuresDesc3")}
                </AccordionItem>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar products */}
      <section>
        <div className="container">
          <h2 className="mb-4">{t(locale, "product.similar")}</h2>
          <RevealGrid className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </RevealGrid>
        </div>
      </section>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="absolute right-2 top-2 text-white text-xl"
              aria-label={t(locale, "product.close")}
              onClick={() => setLightboxOpen(false)}
            >
              ✕
            </button>
            <div className="relative w-full aspect-video bg-black">
              <Image
                src={images[lightboxIdx]}
                alt={`${product.name} – palielināts attēls`}
                fill
                unoptimized
                referrerPolicy="no-referrer"
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                className="rounded-sm border border-line bg-white/10 text-white px-3 py-1.5"
                onClick={() => setLightboxIdx((i) => (i - 1 + images.length) % images.length)}
              >
                {t(locale, "product.previous")}
              </button>
              <div className="text-white text-sm">
                {lightboxIdx + 1} / {images.length}
              </div>
              <button
                type="button"
                className="rounded-sm border border-line bg-white/10 text-white px-3 py-1.5"
                onClick={() => setLightboxIdx((i) => (i + 1) % images.length)}
              >
                {t(locale, "product.next")}
              </button>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((src, idx) => (
                <button
                  key={idx}
                  className={`aspect-square rounded-sm border ${idx === lightboxIdx ? 'border-[--color-accent]' : 'border-line'} bg-[--color-soft]`}
                  onClick={() => setLightboxIdx(idx)}
                  aria-label={t(locale, "product.imageN").replace("{n}", String(idx + 1))}
                >
                  <span className="relative block h-full w-full overflow-hidden">
                    <Image src={src} alt={`${product.name} thumbnails`} fill unoptimized referrerPolicy="no-referrer" sizes="100px" className="object-contain" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
