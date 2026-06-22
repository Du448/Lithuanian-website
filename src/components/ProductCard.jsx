"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Heart, ArrowRight, Eye, Layers } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { isWishlisted, toggleWishlistId } from "@/lib/wishlist";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/lib/compare";
import { useRfq } from "@/lib/rfq";

export default function ProductCard({ product }) {
  const locale = getLocaleFromPathname(usePathname());
  const [wishlisted, setWishlisted] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [quickOpen, setQuickOpen] = useState(false);
  const [likeBump, setLikeBump] = useState(false);
  const hoverRef = useRef(false);
  const { has, toggle, max, ids } = useCompare();
  const { add: addRfq } = useRfq();

  useEffect(() => {
    const sync = () => setWishlisted(isWishlisted(product.id));
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("wishlist:change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("wishlist:change", sync);
    };
  }, [product.id]);
  const hasOffer = product.oldPrice != null && product.oldPrice > product.price;
  const discount = hasOffer
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <Link
      href={withLocaleHref(locale, `/produkts/${product.id}`)}
      className="group block rounded-sm bg-white p-3 cursor-pointer transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-premium motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* Image area */}
      <div
        className="relative mb-3 overflow-hidden rounded-sm"
        onMouseEnter={() => {
          hoverRef.current = true;
          if (product.images && product.images.length > 1) {
            setActiveIdx(1);
          }
        }}
        onMouseLeave={() => {
          hoverRef.current = false;
          setActiveIdx(0);
        }}
      >
        {product.images && product.images.length > 0 ? (
          <div className="relative aspect-[4/3] bg-white">
            <Image
              src={product.images[activeIdx]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-contain transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] bg-[--color-soft] flex items-center justify-center text-muted text-sm">
            <span>{t(locale, "product.image")}</span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/5" />
        {/* Quick view button on hover */}
        <div className="absolute right-12 top-2 z-10 flex items-center gap-1">
          <Dialog open={quickOpen} onOpenChange={setQuickOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                aria-label={t(locale, "product.quickView") || "Ātrais skats"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuickOpen(true);
                }}
                className="rounded-sm bg-white/80 p-1.5 shadow-sm transition-colors hover:bg-white text-ink"
              >
                <Eye size={18} />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[720px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>{product.name}</DialogTitle>
                <DialogDescription>{product.collection}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative aspect-square bg-[--color-soft]">
                  {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 1024px) 50vw, 25vw" loading="lazy" className="object-contain" />
                  ) : null}
                </div>
                <div className="space-y-3 min-w-0">
                  <div className="flex items-baseline gap-2">
                    {hasOffer ? (
                      <>
                        <span className="text-accent text-xl font-semibold">€{product.price}</span>
                        <span className="text-muted line-through">€{product.oldPrice}</span>
                        {discount > 0 && <Badge variant="secondary">-{discount}%</Badge>}
                      </>
                    ) : (
                      <span className="text-ink text-xl font-semibold">€{product.price}</span>
                    )}
                  </div>
                  {Array.isArray(product.colors) && product.colors.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="text-muted text-sm">{t(locale, "product.colors") || "Krāsas"}:</div>
                      <div className="flex items-center gap-1.5">
                        {product.colors.slice(0, 6).map((c, i) => (
                          <span key={i} className="h-4 w-4 rounded-full border border-line" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="text-muted text-sm">{t(locale, "product.sizes") || "Izmēri"}:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {product.sizes.slice(0, 6).map((s, i) => (
                          <Badge key={i} variant="outline">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-2 pt-2 max-w-full">
                    <Link
                      href={withLocaleHref(locale, `/kontakti?produkts=${encodeURIComponent(product.id)}`)}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white rounded-sm px-4 py-2 whitespace-nowrap"
                    >
                      {t(locale, "product.requestOffer")}
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); if (!has(product.id) && ids.length >= max) return; toggle(product.id); }}
                      className={`inline-flex items-center gap-2 rounded-sm px-4 py-2 border whitespace-nowrap ${has(product.id) ? "border-[--color-accent] text-accent" : "border-line text-ink hover:border-[--color-muted]"}`}
                    >
                      <Layers size={16} /> {has(product.id) ? (t(locale, "compare.remove") || "Noņemt") : (t(locale, "compare.add") || "Salīdzināt")}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); addRfq({ id: product.id, qty: 1 }); }}
                      className="inline-flex items-center gap-2 rounded-sm px-4 py-2 border border-line text-ink hover:border-[--color-muted] whitespace-nowrap"
                    >
                      {t(locale, "rfq.add") || "Pievienot pieprasījumam"}
                    </button>
                    <Link
                      href={withLocaleHref(locale, `/produkts/${product.id}`)}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 border border-line rounded-sm px-4 py-2 text-ink hover:border-[--color-muted] whitespace-nowrap"
                    >
                      {t(locale, "product.viewMore") || "Skatīt vairāk"}
                    </Link>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <button
            type="button"
            aria-label="Salīdzināt"
            className={`rounded-sm border p-1.5 inline-flex items-center justify-center transition-colors ${has(product.id) ? "border-[--color-accent] text-accent bg-white" : "border-line text-ink bg-white/80 hover:border-[--color-muted]"}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!has(product.id) && ids.length >= max) return;
              toggle(product.id);
            }}
          >
            <Layers size={18} />
          </button>
        </div>
        {/* Thumbnails on hover */}
        {product.images && product.images.length > 1 ? (
          <div className="absolute left-1/2 bottom-2 -translate-x-1/2 flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {product.images.slice(0, 6).map((src, idx) => (
              <button
                key={idx}
                type="button"
                className={`h-8 w-8 rounded-sm border ${idx === activeIdx ? "border-[--color-accent]" : "border-line"} bg-white/80 overflow-hidden`}
                aria-label={`${product.name} thumbnail ${idx + 1}`}
                onMouseEnter={() => setActiveIdx(idx)}
                onFocus={() => setActiveIdx(idx)}
              >
                <span className="relative block h-full w-full">
                  <Image src={src} alt="" fill sizes="48px" loading="lazy" className="object-contain" />
                </span>
              </button>
            ))}
          </div>
        ) : null}
        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {hasOffer && (
            <Badge className="bg-accent text-white border-transparent">{t(locale, "product.offerBadge")}</Badge>
          )}
          {product.isNew && (
            <Badge className="bg-ink text-white border-transparent">{t(locale, "product.newBadge")}</Badge>
          )}
        </div>
        {/* Wishlist icon */}
        <button
          type="button"
          aria-label={t(locale, "a11y.addWishlist")}
          className={`absolute right-2 top-2 rounded-sm bg-white/80 p-1.5 shadow-sm transition-[background-color,transform,color] duration-200 hover:bg-white ${likeBump ? "scale-110" : ""} ${wishlisted ? "text-accent" : "text-ink"}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlistId(product.id);
            setLikeBump(true);
            setTimeout(() => setLikeBump(false), 180);
          }}
        >
          <Heart size={18} />
        </button>
      </div>

      {/* Text area */}
      <div className="text-[12px] font-semibold tracking-wide text-ink">{product.collection}</div>
      <div className="truncate text-[15px] text-muted">{product.name}</div>

      {/* Price */}
      <div className="mt-1 flex items-center gap-2">
        {hasOffer ? (
          <>
            <span className="text-accent font-semibold">€{product.price}</span>
            <span className="text-muted line-through">€{product.oldPrice}</span>
            {discount > 0 && <Badge variant="secondary">-{discount}%</Badge>}
          </>
        ) : (
          <span className="text-ink font-semibold">€{product.price}</span>
        )}
      </div>
    </Link>
  );
}
