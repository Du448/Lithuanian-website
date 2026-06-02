"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingCart, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);

  const NavLink = ({ href, children, highlight }) => (
    <Link
      href={href}
      className={`group relative px-2 py-1 text-sm sm:text-[15px] text-ink hover:text-ink ${
        highlight ? "text-accent" : ""
      }`}
    >
      <span className="inline-block">
        {children}
      </span>
      <span className="pointer-events-none absolute inset-x-1 -bottom-0.5 h-[2px] scale-x-0 bg-accent transition-transform duration-200 ease-out group-hover:scale-x-100"></span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/80">
      {/* Top promo bar */}
      <div className="bg-accent text-white text-center text-xs sm:text-sm py-2">
        Nemokama konsultacija ir matavimas · Pristatymas visoje Lietuvoje
      </div>

      {/* Main bar */}
      <div className="border-b border-line bg-bg">
        <div className="container flex items-center gap-4 py-3">
          {/* Left: Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-semibold tracking-wide text-ink">
            DURŲ NAMAI
          </Link>

          {/* Center: Search */}
          <div className="flex-1 hidden md:flex items-center">
            <form
              className="w-full max-w-xl relative"
              onSubmit={(e) => {
                e.preventDefault();
                const q = query.trim();
                if (q.length) router.push(`/meklet?q=${encodeURIComponent(q)}`);
              }}
            >
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <Search size={18} />
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Meklēt durvis..."
                className="w-full rounded-sm border border-line bg-white pl-9 pr-3 py-2 text-[15px] placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[--color-accent]"
                aria-label="Meklēt"
              />
            </form>
          </div>

          {/* Right: Icons */}
          <nav className="ml-auto flex items-center gap-3">
            {/* Mobile search icon */}
            <button
              className="md:hidden p-2 text-ink"
              aria-label="Meklēt"
              onClick={() => setShowSearch(true)}
            >
              <Search size={22} />
            </button>
            <Link href="/velmes" aria-label="Vēlmes" className="p-2 text-ink hover:text-ink">
              <Heart size={22} />
            </Link>
            <Link href="/grozs" aria-label="Grozs" className="p-2 text-ink hover:text-ink">
              <ShoppingCart size={22} />
            </Link>
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-ink"
              aria-label="Atvērt izvēlni"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="block h-0.5 w-5 bg-ink mb-1"></span>
              <span className="block h-0.5 w-5 bg-ink mb-1"></span>
              <span className="block h-0.5 w-5 bg-ink"></span>
            </button>
          </nav>
        </div>

        {/* Mobile search (visible under main row) */}
        <div className="container md:hidden pb-3">
          <form
            className="relative"
            onSubmit={(e) => {
              e.preventDefault();
              const q = query.trim();
              if (q.length) router.push(`/meklet?q=${encodeURIComponent(q)}`);
            }}
          >
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <Search size={18} />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Meklēt durvis..."
              className="w-full rounded-sm border border-line bg-white pl-9 pr-3 py-2 text-[15px] placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[--color-accent]"
              aria-label="Meklēt"
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
                  router.push(`/meklet?q=${encodeURIComponent(q)}`);
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
                placeholder="Meklēt durvis..."
                className="w-full rounded-sm border border-line bg-white pl-9 pr-10 py-2 text-[15px] placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[--color-accent]"
                aria-label="Meklēt"
              />
              <button
                type="button"
                aria-label="Aizvērt"
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
      <div className="border-b border-line bg-bg">
        <div className="container">
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4 py-2">
            <NavLink href="/jaunumi">Jaunumi</NavLink>
            <NavLink href="/kategorija/ardurvis-dzivoklim">Ārdurvis dzīvoklim</NavLink>
            <NavLink href="/kategorija/ardurvis-privatmajai">Ārdurvis privātmājai</NavLink>
            <NavLink href="/kategorija/ieksdurvis">Iekšdurvis</NavLink>
            <NavLink href="/kategorija/bidamas-durvis">Bīdāmās durvis</NavLink>
            <NavLink href="/kategorija/sleptas-durvis">Slēptās durvis</NavLink>
            <NavLink href="/akcijas" highlight>
              Akcijas
            </NavLink>
            <NavLink href="/par-mums">Par mums</NavLink>
            <NavLink href="/kontakti">Kontakti</NavLink>
          </div>

          {/* Mobile nav */}
          {open && (
            <div className="md:hidden border-t border-line">
              <div className="flex flex-col py-2">
                <Link href="/jaunumi" className="px-2 py-2 text-ink">Jaunumi</Link>
                <Link href="/kategorija/ardurvis-dzivoklim" className="px-2 py-2 text-ink">Ārdurvis dzīvoklim</Link>
                <Link href="/kategorija/ardurvis-privatmajai" className="px-2 py-2 text-ink">Ārdurvis privātmājai</Link>
                <Link href="/kategorija/ieksdurvis" className="px-2 py-2 text-ink">Iekšdurvis</Link>
                <Link href="/kategorija/bidamas-durvis" className="px-2 py-2 text-ink">Bīdāmās durvis</Link>
                <Link href="/kategorija/sleptas-durvis" className="px-2 py-2 text-ink">Slēptās durvis</Link>
                <Link href="/akcijas" className="px-2 py-2 text-accent">Akcijas</Link>
                <Link href="/par-mums" className="px-2 py-2 text-ink">Par mums</Link>
                <Link href="/kontakti" className="px-2 py-2 text-ink">Kontakti</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
