"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Heart, Shield } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getProductById, getProductsByCategory } from "@/data/products";
import Image from "next/image";

export default function ProductClient({ id }) {
  const product = getProductById(id);

  if (!product) {
    return (
      <main className="container py-10">
        <div className="text-ink">Produkts nav atrasts</div>
      </main>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ["placeholder"];
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeColor, setActiveColor] = useState(product.colors?.[0] || null);
  const [activeSize, setActiveSize] = useState(product.sizes?.[0] || "");

  const hasOffer = product.oldPrice != null && product.oldPrice > product.price;
  const discount = hasOffer ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  const similar = useMemo(() => {
    return getProductsByCategory(product.category).filter((p) => p.id !== product.id).slice(0, 4);
  }, [product]);

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
                  <div className="aspect-3/4 bg-[--color-soft] flex items-center justify-center text-muted">
                    <span>Attēls</span>
                  </div>
                ) : (
                  <div className="relative aspect-3/4">
                    <Image
                      src={images[activeIdx]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
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
                    {src === "placeholder" ? "Attēls" : <span className="block w-full h-full" />}
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

              {/* Colors */}
              {product.colors?.length ? (
                <div className="mt-5">
                  <div className="text-sm text-muted mb-2">Krāsa:</div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setActiveColor(c)}
                        className={`rounded-sm border px-3 py-1.5 text-[15px] ${activeColor === c ? "border-[--color-accent] text-ink" : "border-line text-ink"}`}
                      >
                        {c}
                      </button>
                    ))}
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
    </main>
  );
}
