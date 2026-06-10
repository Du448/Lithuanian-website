"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, ArrowRight } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { isWishlisted, toggleWishlistId } from "@/lib/wishlist";

export default function ProductCard({ product }) {
  const locale = getLocaleFromPathname(usePathname());
  const [wishlisted, setWishlisted] = useState(false);

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
      className="group block rounded-sm border border-line bg-white p-3 cursor-pointer"
    >
      {/* Image area */}
      <div className="relative mb-3 overflow-hidden rounded-sm">
        {product.images && product.images.length > 0 ? (
          <div className="relative aspect-3/4 bg-white">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-contain transition-opacity duration-200 group-hover:opacity-95"
            />
          </div>
        ) : (
          <div className="aspect-3/4 bg-[--color-soft] flex items-center justify-center text-muted text-sm">
            <span>{t(locale, "product.image")}</span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-200 group-hover:bg-ink/5" />
        <div className="pointer-events-none absolute right-2 bottom-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <ArrowRight size={18} className="text-ink" />
        </div>
        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {hasOffer && (
            <span className="rounded-sm bg-accent px-2 py-0.5 text-xs font-medium text-white">
              {t(locale, "product.offerBadge")}
            </span>
          )}
          {product.isNew && (
            <span className="rounded-sm bg-ink px-2 py-0.5 text-xs font-medium text-white">
              {t(locale, "product.newBadge")}
            </span>
          )}
        </div>
        {/* Wishlist icon */}
        <button
          type="button"
          aria-label={t(locale, "a11y.addWishlist")}
          className={`absolute right-2 top-2 rounded-sm bg-white/80 p-1 shadow-sm transition-colors hover:bg-white ${wishlisted ? "text-accent" : "text-ink"}`}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlistId(product.id);
          }}
        >
          <Heart size={18} />
        </button>
      </div>

      {/* Text area */}
      <div className="text-[12px] font-semibold tracking-wide text-ink">{product.collection}</div>
      <div className="truncate text-[15px] text-muted">{product.name}</div>

      {/* Price */}
      <div className="mt-1 flex items-baseline gap-2">
        {hasOffer ? (
          <>
            <span className="text-accent font-semibold">€{product.price}</span>
            <span className="text-muted line-through">€{product.oldPrice}</span>
            <span className="text-accent font-semibold">-{discount}%</span>
          </>
        ) : (
          <span className="text-ink font-semibold">€{product.price}</span>
        )}
      </div>
    </Link>
  );
}
