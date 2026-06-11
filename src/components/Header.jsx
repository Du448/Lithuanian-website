"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Heart, ShoppingCart, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { getLocaleFromPathname, withLocaleHref, locales, t } from "@/lib/i18n";
import { readWishlistIds } from "@/lib/wishlist";

function NavLink({ href, children, highlight, overlay = false }) {
  return (
    <Link
      href={href}
      className={`group relative ${overlay ? "px-3 py-2 text-[13px] uppercase tracking-wide" : "px-2 py-1 text-sm sm:text-[15px]"} text-ink hover:text-ink ${highlight ? "text-accent" : ""}`}
    >
      <span className="inline-block">
        {children}
      </span>
      <span className="pointer-events-none absolute inset-x-1 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  const hiddenRef = useRef(false);
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  useEffect(() => {
    const sync = () => setWishlistCount(readWishlistIds().length);
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("wishlist:change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("wishlist:change", sync);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el || isHome) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastY = window.scrollY;

    const reveal = () => {
      hiddenRef.current = false;
      gsap.to(el, {
        yPercent: 0,
        duration: 0.45,
        ease: "power3.out",
        overwrite: true,
        onComplete: () => gsap.set(el, { clearProps: "transform" }),
      });
    };

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (!reduce) {
        const goingDown = y > lastY;
        if (goingDown && y > 180 && !hiddenRef.current) {
          hiddenRef.current = true;
          gsap.to(el, { yPercent: -100, duration: 0.45, ease: "power3.out", overwrite: true });
        } else if (!goingDown && hiddenRef.current) {
          reveal();
        }
      }
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: "transform" });
      hiddenRef.current = false;
    };
  }, [isHome, pathname]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    if (open || showSearch) {
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: "transform" });
      hiddenRef.current = false;
    }
  }, [open, showSearch]);

  const pathnameWithoutLocale = (() => {
    const parts = pathname.split("/").filter(Boolean);
    if (locales.includes(parts[0])) {
      const rest = parts.slice(1).join("/");
      return rest ? `/${rest}` : "/";
    }
    return pathname || "/";
  })();

  const buildLangHref = (nextLocale) => {
    if (pathnameWithoutLocale === "/") return `/${nextLocale}`;
    return `/${nextLocale}${pathnameWithoutLocale}`;
  };

  return (
    <header
      ref={headerRef}
      className={`${isHome ? "absolute" : "sticky"} top-0 z-50 w-full will-change-transform ${isHome ? "bg-transparent" : "bg-bg/95 backdrop-blur supports-backdrop-filter:bg-bg/80"} ${!isHome && scrolled ? "shadow-[0_2px_16px_rgba(0,0,0,0.07)]" : ""} transition-shadow duration-300`}
    >
      {/* Top promo bar */}
      <div className={`text-white text-center text-xs sm:text-sm py-2 ${isHome ? "bg-accent/90" : "bg-accent"}`}>
        {t(locale, "header.promo")}
      </div>

      {/* Main bar */}
      <div className={`${isHome ? "border-b border-white/20 bg-transparent" : "border-b border-line bg-bg"}`}>
        <div className="container flex items-center gap-4 py-3">
          {/* Left: Logo */}
          <Link href={withLocaleHref(locale, "/")} className={`text-xl sm:text-2xl font-semibold tracking-wide ${isHome ? "text-white" : "text-ink"}`}>
            DURŲ NAMAI
          </Link>

          {/* Center: Search */}
          <div className={`flex-1 hidden md:flex items-center ${isHome ? "mt-2 md:mt-3" : ""}`}>
            <form
              className="w-full max-w-xl relative"
              onSubmit={(e) => {
                e.preventDefault();
                const q = query.trim();
                if (q.length) router.push(withLocaleHref(locale, `/meklet?q=${encodeURIComponent(q)}`));
              }}
            >
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                <Search size={18} />
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(locale, "nav.searchPlaceholder")}
                className="w-full rounded-full border border-black/10 bg-white/95 shadow-sm pl-10 pr-4 h-11 text-[15px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[--color-accent] focus:border-transparent"
                aria-label={t(locale, "a11y.search")}
              />
            </form>
          </div>

          {/* Right: Icons */}
          <nav className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 rounded-sm border border-line bg-white/70 px-1 py-1">
              {locales.map((l) => (
                <Link
                  key={l}
                  href={buildLangHref(l)}
                  onClick={() => {
                    if (l !== locale) router.refresh();
                  }}
                  className={`px-2 py-1 text-xs font-semibold tracking-wide ${l === locale ? "text-accent" : "text-ink"}`}
                  aria-label={t(locale, "a11y.language").replace("{code}", l.toUpperCase())}
                >
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>
            {/* Mobile search icon */}
            <button
              className="md:hidden p-2 text-ink"
              aria-label={t(locale, "search.title")}
              onClick={() => setShowSearch(true)}
            >
              <Search size={22} />
            </button>
            <Link href={withLocaleHref(locale, "/velmes")} aria-label={t(locale, "wishlist.title")} className="relative p-2 text-ink hover:text-ink">
              <Heart size={22} />
              {wishlistCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[11px] leading-[18px] text-center">
                  {wishlistCount}
                </span>
              ) : null}
            </Link>
            <Link href={withLocaleHref(locale, "/grozs")} aria-label={t(locale, "cart.title")} className="p-2 text-ink hover:text-ink">
              <ShoppingCart size={22} />
            </Link>
            {/* Mobile menu button */}
            <button
              className={`md:hidden p-2 ${isHome ? "text-white" : "text-ink"}`}
              aria-label={t(locale, "category.filters")}
              onClick={() => setOpen((v) => !v)}
            >
              <span className={`block h-0.5 w-5 ${isHome ? "bg-white" : "bg-ink"} mb-1`}></span>
              <span className={`block h-0.5 w-5 ${isHome ? "bg-white" : "bg-ink"} mb-1`}></span>
              <span className={`block h-0.5 w-5 ${isHome ? "bg-white" : "bg-ink"}`}></span>
            </button>
          </nav>
        </div>

        {/* Mobile search (visible under main row) */}
        <div className="container md:hidden pb-3 px-2">
          <form
            className="relative"
            onSubmit={(e) => {
              e.preventDefault();
              const q = query.trim();
              if (q.length) router.push(withLocaleHref(locale, `/meklet?q=${encodeURIComponent(q)}`));
            }}
          >
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
              <Search size={18} />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(locale, "nav.searchPlaceholder")}
              className="w-full rounded-full border border-black/10 bg-white/95 shadow-sm pl-10 pr-4 h-11 text-[15px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[--color-accent] focus:border-transparent"
              aria-label={t(locale, "a11y.search")}
            />
          </form>
        </div>
      </div>

      {/* Mobile search overlay */}
      {showSearch && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setShowSearch(false)}
        >
          <div
            className="absolute inset-x-0 top-0 bg-bg border-b border-line p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              className="relative"
              onSubmit={(e) => {
                e.preventDefault();
                const q = query.trim();
                if (q.length) {
                  router.push(withLocaleHref(locale, `/meklet?q=${encodeURIComponent(q)}`));
                  setShowSearch(false);
                }
              }}
            >
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <Search size={18} />
              </span>
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(locale, "nav.searchPlaceholder")}
                className="w-full rounded-sm border border-line bg-white pl-9 pr-10 py-2 text-[15px] placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[--color-accent]"
                aria-label={t(locale, "a11y.search")}
              />
              <button
                type="button"
                aria-label={t(locale, "a11y.close")}
                onClick={() => setShowSearch(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted px-2"
              >
                ✕
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Categories bar */}
      <div className={`${isHome ? "border-b border-white/20 bg-transparent" : "border-b border-line bg-bg"}`}>
        <div className="container">
          {/* Desktop nav */}
          {!isHome ? (
            <div className="hidden md:flex items-center gap-4 py-2">
              <NavLink href={withLocaleHref(locale, "/jaunumi")}>{t(locale, "nav.news")}</NavLink>
              <NavLink href={withLocaleHref(locale, "/kategorija/ardurvis-dzivoklim")}>{t(locale, "nav.exteriorApartment")}</NavLink>
              <NavLink href={withLocaleHref(locale, "/kategorija/ardurvis-privatmajai")}>{t(locale, "nav.exteriorHouse")}</NavLink>
              <NavLink href={withLocaleHref(locale, "/kategorija/ieksdurvis")}>{t(locale, "nav.interior")}</NavLink>
              <NavLink href={withLocaleHref(locale, "/kategorija/bidamas-durvis")}>{t(locale, "nav.sliding")}</NavLink>
              <NavLink href={withLocaleHref(locale, "/kategorija/sleptas-durvis")}>{t(locale, "nav.hidden")}</NavLink>
              <NavLink href={withLocaleHref(locale, "/akcijas")} highlight>
                {t(locale, "nav.deals")}
              </NavLink>
              <NavLink href={withLocaleHref(locale, "/par-mums")}>{t(locale, "nav.about")}</NavLink>
              <NavLink href={withLocaleHref(locale, "/kontakti")}>{t(locale, "nav.contacts")}</NavLink>
            </div>
          ) : (
            <div className="hidden md:flex items-center justify-center py-3 mt-4 md:mt-6 lg:mt-8">
              <div className="mx-4 md:mx-6 lg:mx-10 max-w-6xl w-full rounded-sm border border-black/10 bg-white/95 shadow-sm">
                <div className="flex items-center gap-1 px-2">
                  <NavLink overlay href={withLocaleHref(locale, "/jaunumi")}>{t(locale, "nav.news")}</NavLink>
                  <NavLink overlay href={withLocaleHref(locale, "/kategorija/ardurvis-dzivoklim")}>{t(locale, "nav.exteriorApartment")}</NavLink>
                  <NavLink overlay href={withLocaleHref(locale, "/kategorija/ardurvis-privatmajai")}>{t(locale, "nav.exteriorHouse")}</NavLink>
                  <NavLink overlay href={withLocaleHref(locale, "/kategorija/ieksdurvis")}>{t(locale, "nav.interior")}</NavLink>
                  <NavLink overlay href={withLocaleHref(locale, "/kategorija/bidamas-durvis")}>{t(locale, "nav.sliding")}</NavLink>
                  <NavLink overlay href={withLocaleHref(locale, "/kategorija/sleptas-durvis")}>{t(locale, "nav.hidden")}</NavLink>
                  <NavLink overlay href={withLocaleHref(locale, "/akcijas")} highlight>
                    {t(locale, "nav.deals")}
                  </NavLink>
                  <NavLink overlay href={withLocaleHref(locale, "/par-mums")}>{t(locale, "nav.about")}</NavLink>
                  <NavLink overlay href={withLocaleHref(locale, "/kontakti")}>{t(locale, "nav.contacts")}</NavLink>
                </div>
              </div>
            </div>
          )}

          {/* Mobile nav */}
          {open && (
            <div
              className="fixed inset-0 z-50 md:hidden"
              onClick={() => setOpen(false)}
            >
              <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
              <div
                className="absolute inset-x-0 top-0 max-h-[85vh] overflow-auto border-b border-line bg-bg shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-3 py-3 border-b border-line">
                  <div className="text-sm font-semibold tracking-wide text-ink">{t(locale, "category.filters")}</div>
                  <button
                    type="button"
                    aria-label={t(locale, "a11y.close")}
                    className="rounded-sm border border-line px-3 py-1.5 text-sm text-ink"
                    onClick={() => setOpen(false)}
                  >
                    {t(locale, "a11y.close")}
                  </button>
                </div>

                <div className="flex flex-col py-2">
                  <div className="flex items-center gap-2 px-3 pt-2 pb-3">
                    {locales.map((l) => (
                      <Link
                        key={l}
                        href={buildLangHref(l)}
                        onClick={() => {
                          if (l !== locale) router.refresh();
                          setOpen(false);
                        }}
                        className={`rounded-sm border border-line px-2 py-1 text-xs font-semibold tracking-wide ${l === locale ? "text-accent" : "text-ink"}`}
                      >
                        {l.toUpperCase()}
                      </Link>
                    ))}
                  </div>

                  <Link href={withLocaleHref(locale, "/jaunumi")} onClick={() => setOpen(false)} className="px-3 py-2 text-ink">{t(locale, "nav.news")}</Link>
                  <Link href={withLocaleHref(locale, "/kategorija/ardurvis-dzivoklim")} onClick={() => setOpen(false)} className="px-3 py-2 text-ink">{t(locale, "nav.exteriorApartment")}</Link>
                  <Link href={withLocaleHref(locale, "/kategorija/ardurvis-privatmajai")} onClick={() => setOpen(false)} className="px-3 py-2 text-ink">{t(locale, "nav.exteriorHouse")}</Link>
                  <Link href={withLocaleHref(locale, "/kategorija/ieksdurvis")} onClick={() => setOpen(false)} className="px-3 py-2 text-ink">{t(locale, "nav.interior")}</Link>
                  <Link href={withLocaleHref(locale, "/kategorija/bidamas-durvis")} onClick={() => setOpen(false)} className="px-3 py-2 text-ink">{t(locale, "nav.sliding")}</Link>
                  <Link href={withLocaleHref(locale, "/kategorija/sleptas-durvis")} onClick={() => setOpen(false)} className="px-3 py-2 text-ink">{t(locale, "nav.hidden")}</Link>
                  <Link href={withLocaleHref(locale, "/akcijas")} onClick={() => setOpen(false)} className="px-3 py-2 text-accent">{t(locale, "nav.deals")}</Link>
                  <Link href={withLocaleHref(locale, "/par-mums")} onClick={() => setOpen(false)} className="px-3 py-2 text-ink">{t(locale, "nav.about")}</Link>
                  <Link href={withLocaleHref(locale, "/kontakti")} onClick={() => setOpen(false)} className="px-3 py-2 text-ink">{t(locale, "nav.contacts")}</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
