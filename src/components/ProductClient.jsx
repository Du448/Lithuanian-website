"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Heart, Shield, ChevronUp, ChevronDown, Truck, Ruler, Wrench, ShieldCheck, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import AccordionItem from "@/components/anim/AccordionItem";
import MagneticButton from "@/components/anim/MagneticButton";
import RevealGrid from "@/components/anim/RevealGrid";
import { getProductById, getProductsByCategory } from "@/data/products";
import Image from "next/image";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, translateColorLabel, withLocaleHref, t } from "@/lib/i18n";
import { isWishlisted, toggleWishlistId } from "@/lib/wishlist";
import { useCompare } from "@/lib/compare";
import { useRfq } from "@/lib/rfq";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const Lightbox = dynamic(() => import("./ProductLightbox"), { ssr: false });

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
  const [autoPlay, setAutoPlay] = useState(false);
  const [slideDir, setSlideDir] = useState(1); // 1 => forward, -1 => backward
  const { has, toggle, ids, max } = useCompare();
  const { add: addRfq } = useRfq();

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

  // Lightbox keyboard controls
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") setLightboxIdx((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setLightboxIdx((i) => (i + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, images.length]);

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

  // Hover-activated slideshow for main gallery (ping-pong)
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    const id = setInterval(() => {
      setActiveIdx((i) => {
        const next = i + slideDir;
        if (next >= images.length) {
          setSlideDir(-1);
          return Math.max(0, images.length - 2);
        }
        if (next < 0) {
          setSlideDir(1);
          return Math.min(1, images.length - 1);
        }
        return next;
      });
    }, 1200);
    return () => clearInterval(id);
  }, [autoPlay, images.length, slideDir]);

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
      {product ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              image: Array.isArray(images) && images.length ? images : undefined,
              description: product.short || product.name,
              brand: { "@type": "Brand", name: product.collection },
              offers: {
                "@type": "Offer",
                priceCurrency: "EUR",
                price: String(product.price),
                availability: "https://schema.org/InStock",
                url: withLocaleHref(locale, `/produkts/${product.id}`),
              },
            }),
          }}
        />
      ) : null}

      <section className="-mt-10 lg:-mt-16 relative z-10">
        <div className="container py-0">
          <nav aria-label="Breadcrumbs" className="w-fit px-3 py-1.5 rounded-sm border border-line/80 bg-white/80 backdrop-blur text-xs shadow-premium">
            <ol className="flex items-center gap-1 text-muted">
              <li>
                <Link
                  className="inline-flex items-center gap-1 text-muted hover:text-ink underline-offset-4 hover:underline"
                  href={withLocaleHref(locale, "/")}
                >
                  {t(locale, "common.home")}
                </Link>
              </li>
              <li aria-hidden className="text-muted px-0.5">
                <ChevronRight size={14} />
              </li>
              <li className="text-ink font-medium truncate max-w-[70vw] lg:max-w-none">
                {product.name}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="-mt-16 lg:-mt-28">
        <div className="container pt-0 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Gallery */}
            <div className="lg:-mt-12">
              {/* Shared aspect box to keep thumbnails column height equal to main image */}
              <div className="relative aspect-[3/4]">
                <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-[112px_1fr] gap-3">
                  {/* Vertical thumbnails (desktop) */}
                  <div className="relative hidden lg:block h-full overflow-hidden bg-[--color-soft] rounded-sm">
                    <button
                      type="button"
                      className={`absolute left-1/2 -translate-x-1/2 top-2 z-20 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-white shadow-md text-ink transition-opacity hover:bg-ink/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ink] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${canScrollUp ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                      aria-label={t(locale, "product.previous")}
                      onClick={() => scrollThumbs(-1)}
                    >
                      <ChevronUp size={18} />
                    </button>
                    <div ref={thumbsRef} className="absolute inset-x-0 top-0 bottom-[52px] overflow-y-auto no-scrollbar pr-1 lg:bottom-auto lg:h-[524px]">
                      <div className="flex h-max flex-col gap-2">
                        {images.map((src, idx) => (
                          <button
                            key={`v-${idx}`}
                            className={`relative group aspect-square rounded-sm border ${idx === selectedIdx ? "border-[--color-accent]" : "border-line"} bg-[--color-soft] text-xs text-muted w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ink]`}
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
                                  referrerPolicy="no-referrer"
                                  sizes="120px"
                                  loading="lazy"
                                  className="object-contain object-top"
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
                      className={`absolute left-1/2 -translate-x-1/2 bottom-2 lg:bottom-auto lg:top-[532px] z-20 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-white shadow-md text-ink transition-opacity hover:bg-ink/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ink] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${canScrollDown ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                      aria-label={t(locale, "product.next")}
                      onClick={() => scrollThumbs(1)}
                    >
                      <ChevronDown size={18} />
                    </button>
                  </div>

                  {/* Main image */}
                  <div
                    className="relative overflow-hidden rounded-sm group [--zoom-origin:50%_50%]"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      e.currentTarget.style.setProperty("--zoom-origin", `${x}% ${y}%`);
                    }}
                  >
                    {images.every((src) => src === "placeholder") ? (
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
                        className="relative block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ink] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        onMouseEnter={() => setAutoPlay(true)}
                        onMouseLeave={() => setAutoPlay(false)}
                        aria-label={`${t(locale, "product.openImage")} — ${product.name}`}
                      >
                        <div className="absolute inset-0 overflow-hidden">
                          <div
                            className="h-full w-full flex transition-transform duration-500 ease-out [transform:translateX(var(--slide-x))]"
                            style={{ "--slide-x": `-${activeIdx * 100}%` }}
                          >
                            {images.map((src, idx) => (
                              <div key={`slide-${idx}`} className="relative h-full w-full shrink-0 grow-0 basis-full">
                                {src === "placeholder" ? (
                                  <div className="absolute inset-0 bg-[--color-soft] flex items-center justify-center text-muted">
                                    <span>{t(locale, "product.image")}</span>
                                  </div>
                                ) : (
                                  <Image
                                    src={src}
                                    alt={`${product.name} attēls ${idx + 1}`}
                                    fill
                                    referrerPolicy="no-referrer"
                                    loading="eager"
                                    priority={idx === 0}
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-contain object-top transition-transform duration-300 ease-out [transform-origin:var(--zoom-origin)] group-hover:scale-[1.05]"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
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
                    className={`relative group aspect-square rounded-sm border ${idx === selectedIdx ? "border-[--color-accent]" : "border-line"} bg-[--color-soft] text-xs text-muted overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ink]`}
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
                          referrerPolicy="no-referrer"
                          sizes="120px"
                          loading="lazy"
                          className="object-contain object-top"
                        />
                      </span>
                    )}
                    <span aria-hidden className="pointer-events-none absolute inset-0 rounded-sm ring-2 ring-[var(--color-ink)] opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Info (sticky on desktop) */}
            <div className="lg:sticky lg:top-16 h-fit lg:-mt-12">
              <div className="text-[12px] font-semibold tracking-wide text-ink">{product.collection}</div>
              <h1 className="mt-0 text-2xl sm:text-3xl font-semibold tracking-wide text-ink">{product.name}</h1>

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

              {/* Colors: interactive swatches that try to switch to related image */}
              {product.colors?.length ? (
                <div className="mt-5">
                  <div className="text-sm text-muted mb-2">{t(locale, "product.colorLabel")}</div>
                  <div className="flex flex-wrap items-center gap-2">
                    {product.colors.map((c, idx) => {
                      const label = translateColorLabel(locale, c);
                      const isActive = selectedIdx === idx;
                      return (
                        <button
                          key={c + idx}
                          type="button"
                          className={`rounded-sm border px-3 py-1.5 text-[15px] transition-colors ${isActive ? "border-[--color-accent] text-ink" : "border-line text-ink hover:border-[--color-muted]"}`}
                          onClick={() => {
                            // Heuristic: try to find an image that includes a token of the color label
                            const token = String(c).split(" ")[0].toLowerCase();
                            const matchIdx = images.findIndex((u) => String(u).toLowerCase().includes(token));
                            const nextIdx = matchIdx >= 0 ? matchIdx : 0;
                            setSelectedIdx(nextIdx);
                            setActiveIdx(nextIdx);
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
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
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                <MagneticButton className="block w-full">
                  <Link
                    href={withLocaleHref(locale, `/kontakti?produkts=${encodeURIComponent(product.id)}`)}
                    className="flex h-12 w-full items-center justify-center rounded-sm bg-accent px-4 py-2.5 text-center text-sm font-medium leading-tight text-white transition-colors duration-300 hover:bg-accent-dark"
                  >
                    {t(locale, "product.requestOffer")}
                  </Link>
                </MagneticButton>
                <button
                  type="button"
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-sm border px-4 py-2.5 text-center text-sm font-medium leading-tight transition-[border-color,transform] duration-200 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ink] ${has(product.id) ? "border-[--color-accent] text-accent" : "border-line text-ink hover:border-[--color-muted]"}`}
                  onClick={() => { if (!has(product.id) && ids.length >= max) return; toggle(product.id); }}
                  aria-label={has(product.id) ? (t(locale, "compare.remove") || "Noņemt no salīdzināšanas") : (t(locale, "product.addToCompare") || "Pievienot salīdzināšanai")}
                >
                  <Layers size={18} />
                  {has(product.id) ? (t(locale, "compare.remove") || "Noņemt no salīdzināšanas") : (t(locale, "product.addToCompare") || "Pievienot salīdzināšanai")}
                </button>
                <button
                  type="button"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-sm border border-line px-4 py-2.5 text-center text-sm font-medium leading-tight transition-[border-color,transform] duration-200 hover:border-[--color-muted] active:scale-[0.97] text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ink]"
                  onClick={() => {
                    const color = Array.isArray(product.colors) ? (product.colors[selectedIdx] || product.colors[0]) : undefined;
                    addRfq({ id: product.id, qty: 1, size: activeSize || undefined, color });
                  }}
                  aria-label={t(locale, "rfq.add")}
                >
                  {t(locale, "rfq.add") || "Pievienot pieprasījumam"}
                </button>
                <button
                  type="button"
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-sm border border-line px-4 py-2.5 text-center text-sm font-medium leading-tight transition-[border-color,transform] duration-200 hover:border-[--color-muted] active:scale-[0.97] ${wishlisted ? "text-accent" : "text-ink"} focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ink]`}
                  onClick={() => toggleWishlistId(product.id)}
                  aria-label={t(locale, "product.addWishlist")}
                >
                  <Heart size={18} />
                  {t(locale, "product.addWishlist")}
                </button>
              </div>

              {/* Trust icons row */}
              <div className="mt-4 flex w-full items-center justify-between gap-2 sm:gap-3">
                {[
                  { key: "trust.measurement", label: t(locale, "trust.measurement") || "Uzmērīšana", Icon: Ruler },
                  { key: "trust.installation", label: t(locale, "trust.installation") || "Montāža", Icon: Wrench },
                  { key: "trust.warranty", label: t(locale, "trust.warranty") || "Garantija", Icon: ShieldCheck },
                  { key: "trust.delivery", label: t(locale, "trust.delivery") || "Piegāde", Icon: Truck },
                ].map(({ key, label, Icon }) => (
                  <Tooltip key={key}>
                    <TooltipTrigger asChild>
                      <span
                        tabIndex={0}
                        aria-label={label}
                        className="group inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line/70 bg-white/80 text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-[--color-muted] hover:shadow-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ink] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[--color-soft] transition-colors group-hover:bg-[--color-soft]">
                          <Icon size={16} />
                        </span>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top">{label}</TooltipContent>
                  </Tooltip>
                ))}
              </div>

              {/* Accordions with table-like spec sections */}
              <div className="mt-6 divide-y divide-[--color-line] border border-line rounded-sm bg-white">
                <AccordionItem title={t(locale, "product.specs")}>
                    <div className="grid grid-cols-1 sm:grid-cols-2">
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
                          <div key={k} className="grid grid-cols-[1fr_auto] items-start gap-3 px-3 py-2 border-b border-line last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                            <div className="text-muted text-sm">{label}</div>
                            <div className="text-ink text-sm text-right">{value}</div>
                          </div>
                        );
                      })}
                    </div>
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

      {/* Similar products: horizontal carousel */}
      <section>
        <div className="container">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{t(locale, "product.similar")}</h2>
            <div className="hidden md:flex items-center gap-2">
              <button type="button" className="rounded-sm border border-line p-2 text-ink hover:border-[--color-muted]" onClick={() => {
                const scroller = document.getElementById("similar-scroll");
                if (scroller) scroller.scrollBy({ left: -320, behavior: "smooth" });
              }}><ChevronLeft size={18} /></button>
              <button type="button" className="rounded-sm border border-line p-2 text-ink hover:border-[--color-muted]" onClick={() => {
                const scroller = document.getElementById("similar-scroll");
                if (scroller) scroller.scrollBy({ left: 320, behavior: "smooth" });
              }}><ChevronRight size={18} /></button>
            </div>
          </div>
          <div id="similar-scroll" className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
            {similar.map((p) => (
              <div key={p.id} className="snap-start shrink-0 w-[260px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightboxOpen && (
        <Lightbox
          images={images}
          index={lightboxIdx}
          setIndex={setLightboxIdx}
          onClose={() => setLightboxOpen(false)}
          locale={locale}
          productName={product.name}
        />
      )}
    </main>
  );
}
