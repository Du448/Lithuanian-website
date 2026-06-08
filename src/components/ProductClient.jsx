"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Shield } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getProductById, getProductsByCategory } from "@/data/products";
import Image from "next/image";

export default function ProductClient({ id }) {
  const product = getProductById(id);
  const productImages = product?.images && product.images.length > 0 ? product.images : ["placeholder"];
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeSize, setActiveSize] = useState(product?.sizes?.[0] || "");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  if (!product) {
    return (
      <main className="container py-10">
        <div className="text-ink">Produkts nav atrasts</div>
      </main>
    );
  }

  const images = productImages;
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
        name: "Sākums",
        item: "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.name,
        item: `/produkts/${product.id}`,
      },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />

      <section className="border-b border-line">
        <div className="container py-6">
          <div className="text-sm text-muted">
            <Link className="text-ink hover:text-ink" href="/">Sākums</Link>
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
              <div className="relative overflow-hidden rounded-sm border border-line">
                {images[activeIdx] === "placeholder" ? (
                  <div className="w-full aspect-[3/4] bg-[--color-soft] flex items-center justify-center text-muted">
                    <span>Attēls</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setLightboxIdx(activeIdx);
                      setLightboxOpen(true);
                    }}
                    className="relative block w-full aspect-[3/4]"
                    aria-label="Atvērt attēlu pilnā izmērā"
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
              <div className="mt-3 grid grid-cols-5 gap-2">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    className={`aspect-square rounded-sm border ${idx === activeIdx ? "border-[--color-accent]" : "border-line"} bg-[--color-soft] text-xs text-muted`}
                    onClick={() => setActiveIdx(idx)}
                    aria-label={`Attēls ${idx + 1}`}
                  >
                    {src === "placeholder" ? (
                      "Attēls"
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
                  <div className="text-sm text-muted mb-2">Krāsa (ārpuse / iekšpuse):</div>
                  <div className="flex flex-wrap items-center gap-2 text-[15px] text-ink">
                    <span className="rounded-sm border border-line px-3 py-1.5">{product.colors[0]}</span>
                    {product.colors[1] ? (
                      <>
                        <span className="text-muted">/</span>
                        <span className="rounded-sm border border-line px-3 py-1.5">{product.colors[1]}</span>
                      </>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {/* Sizes */}
              {product.sizes?.length ? (
                <div className="mt-5">
                  <div className="text-sm text-muted mb-2">Izmērs:</div>
                  <select
                    value={activeSize}
                    onChange={(e) => setActiveSize(e.target.value)}
                    className="rounded-sm border border-line bg-white px-2 py-2 text-[15px] text-ink"
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
                <Link href={`/kontakti?produkts=${encodeURIComponent(product.id)}`} className="bg-accent hover:bg-accent-dark text-white rounded-sm px-5 py-2">
                  Pieprasīt piedāvājumu
                </Link>
                <button type="button" className="rounded-sm border border-line px-5 py-2 text-ink inline-flex items-center gap-2">
                  <Heart size={18} />
                  Pievienot vēlmēm
                </button>
              </div>

              <div className="mt-3 text-[15px] text-muted">Bezmaksas uzmērīšana · Montāža · Piegāde visā Latvijā</div>

              {/* Accordions */}
              <div className="mt-6 divide-y divide-[--color-line] border border-line rounded-sm bg-white">
                <details className="group p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-ink">
                    <span className="font-medium">Specifikācija</span>
                    <span className="text-muted">+</span>
                  </summary>
                  <div className="mt-3 text-[15px] text-ink">
                    <ul className="list-disc pl-5">
                      {Object.entries(product.specs || {}).map(([k, v]) => (
                        <li key={k}><span className="text-muted">{k}:</span> {v}</li>
                      ))}
                    </ul>
                  </div>
                </details>
                <details className="group p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-ink">
                    <span className="font-medium">Komplektācija</span>
                    <span className="text-muted">+</span>
                  </summary>
                  <div className="mt-3 text-[15px] text-ink">Pilns komplekts ar furnitūru. (Aizstāj ar precīzu saturu.)</div>
                </details>
                <details className="group p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-ink">
                    <span className="font-medium">Montāža un piegāde</span>
                    <span className="text-muted">+</span>
                  </summary>
                  <div className="mt-3 text-[15px] text-ink">Piedāvājam profesionālu montāžu un piegādi visā Latvijā.</div>
                </details>
                <details className="group p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-ink">
                    <span className="font-medium">Garantija</span>
                    <span className="text-muted">+</span>
                  </summary>
                  <div className="mt-3 text-[15px] text-ink">Garantija saskaņā ar ražotāja noteikumiem.</div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar products */}
      <section>
        <div className="container">
          <h2 className="mb-4">Līdzīgi modeļi</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
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
              aria-label="Aizvērt"
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
                Iepriekšējais
              </button>
              <div className="text-white text-sm">
                {lightboxIdx + 1} / {images.length}
              </div>
              <button
                type="button"
                className="rounded-sm border border-line bg-white/10 text-white px-3 py-1.5"
                onClick={() => setLightboxIdx((i) => (i + 1) % images.length)}
              >
                Nākamais
              </button>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((src, idx) => (
                <button
                  key={idx}
                  className={`aspect-square rounded-sm border ${idx === lightboxIdx ? 'border-[--color-accent]' : 'border-line'} bg-[--color-soft]`}
                  onClick={() => setLightboxIdx(idx)}
                  aria-label={`Lightbox attēls ${idx + 1}`}
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
