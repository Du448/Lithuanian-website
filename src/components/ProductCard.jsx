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
      className="group block rounded-sm border border-line bg-white p-3 cursor-pointer transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-transparent hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.22)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
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
              className="object-contain transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
        ) : (
          <div className="aspect-3/4 bg-[--color-soft] flex items-center justify-center text-muted text-sm">
            <span>{t(locale, "product.image")}</span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/5" />
        <div className="pointer-events-none absolute right-2 bottom-2 translate-y-2 opacity-0 transition-[transform,opacity] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none motion-reduce:translate-y-0">
          <span className="inline-flex items-center justify-center rounded-full bg-white/90 p-1.5 shadow-sm">
            <ArrowRight size={16} className="text-ink" />
          </span>
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
          className={`absolute right-2 top-2 rounded-sm bg-white/80 p-1.5 shadow-sm transition-[background-color,transform] duration-200 hover:bg-white hover:scale-110 active:scale-90 ${wishlisted ? "text-accent" : "text-ink"}`}
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
