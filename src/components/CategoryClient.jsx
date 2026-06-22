"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, ChevronDownCircle, Check, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import MotionReveal from "@/components/motion/MotionReveal";
import RevealGrid from "@/components/anim/RevealGrid";
import { getProductsByCategory, getCategoryBySlug } from "@/data/products";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { categories as allCategoriesData } from "@/data/products";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function CategoryClient({ slug }) {
  const locale = getLocaleFromPathname(usePathname());
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = getCategoryBySlug(slug);
  const allProducts = getProductsByCategory(slug);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [thermoFilter, setThermoFilter] = useState("all"); // all | yes | no
  const [sort, setSort] = useState("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(false);
  const didHydrateFromUrl = useRef(false);
  const collectionOptions = Array.from(new Set(allProducts.map((p) => p.collection).filter(Boolean)));
  const colorOptions = Array.from(new Set(allProducts.flatMap((p) => p.colors || [])));

  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [colorsOpen, setColorsOpen] = useState(false);
  const [collectionSearch, setCollectionSearch] = useState("");
  const [colorSearch, setColorSearch] = useState("");

  const colorTokenMaps = {
    en: {
      antracīts: "anthracite",
      antracits: "anthracite",
      balts: "white",
      melns: "black",
      mats: "matte",
      supermats: "super matte",
      dienvidu: "southern",
      betons: "concrete",
      oksīds: "oxide",
      oksids: "oxide",
      tumšs: "dark",
      tums: "dark",
      koks: "wood",
      ozols: "oak",
      tabakas: "tobacco",
      sudraba: "silver",
      sudrabots: "silver",
      horizontāls: "horizontal",
      horizontal: "horizontal",
      pelēks: "grey",
      peleks: "grey",
      zelta: "gold",
      priede: "pine",
      provanss: "provence",
      tīka: "teak",
      tika: "teak",
      sonomas: "sonoma",
      sagrēns: "textured",
      sagrēns: "textured",
    },
    lt: {
      antracīts: "antracitas",
      antracits: "antracitas",
      balts: "balta",
      melns: "juoda",
      mats: "matinis",
      supermats: "super matinis",
      dienvidu: "pietų",
      betons: "betonas",
      oksīds: "oksidas",
      oksids: "oksidas",
      tumšs: "tamsus",
      tums: "tamsus",
      koks: "mediena",
      ozols: "ąžuolas",
      tabakas: "tabako",
      sudraba: "sidabro",
      sudrabots: "sidabrinis",
      horizontāls: "horizontalus",
      horizontal: "horizontalus",
      pelēks: "pilkas",
      peleks: "pilkas",
      zelta: "auksinis",
      priede: "pušis",
      provanss: "provansas",
      tīka: "tikas",
      tika: "tikas",
      sonomas: "sonomos",
      sagrēns: "faktūrinė",
      sagrēns: "faktūrinė",
    },
  };

  const translateColorLabel = (value) => {
    if (locale === "lv") return value;

    const map = locale === "en" ? colorTokenMaps.en : colorTokenMaps.lt;
    const parts = String(value).split(" ");

    const translated = parts.map((p) => {
      const lower = p.toLowerCase();
      if (lower.startsWith("ral")) return p.toUpperCase();
      const next = map[lower];
      if (!next) return p;
      const isCapitalized = p[0] === p[0]?.toUpperCase();
      return isCapitalized ? `${next[0].toUpperCase()}${next.slice(1)}` : next;
    });

    return translated.join(" ");
  };

  const toggleIn = (arr, setArr, value) => {
    setArr((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const clearFilters = () => {
    setSelectedCollections([]);
    setSelectedColors([]);
    setPriceMin("");
    setPriceMax("");
    setThermoFilter("all");
  };

  // Read filters from URL on mount/change
  useEffect(() => {
    const sp = new URLSearchParams(searchParams?.toString() || "");
    const col = sp.getAll("kolekcija");
    const clr = sp.getAll("krasa");
    const pmin = sp.get("cena_no") || "";
    const pmax = sp.get("cena_lidz") || "";
    const th = sp.get("termo") || "all";
    const srt = sp.get("kartot") || "popular";
    // Only update state if changed to avoid loops
    setSelectedCollections((prev) => (JSON.stringify(prev) !== JSON.stringify(col) ? col : prev));
    setSelectedColors((prev) => (JSON.stringify(prev) !== JSON.stringify(clr) ? clr : prev));
    setPriceMin((prev) => (prev !== pmin ? pmin : prev));
    setPriceMax((prev) => (prev !== pmax ? pmax : prev));
    setThermoFilter((prev) => {
      const next = ["all","yes","no"].includes(th) ? th : "all";
      return prev !== next ? next : prev;
    });
    setSort((prev) => {
      const next = ["popular","cheap","expensive","new"].includes(srt) ? srt : "popular";
      return prev !== next ? next : prev;
    });
    // Do not reset visible counter unless query actually changed
    didHydrateFromUrl.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const buildQSFromState = () => {
    const sp = new URLSearchParams();
    selectedCollections.forEach((c) => sp.append("kolekcija", c));
    selectedColors.forEach((c) => sp.append("krasa", c));
    if (priceMin !== "") sp.set("cena_no", String(priceMin));
    if (priceMax !== "") sp.set("cena_lidz", String(priceMax));
    if (thermoFilter !== "all") sp.set("termo", thermoFilter);
    if (sort !== "popular") sp.set("kartot", sort);
    return sp.toString();
  };

  useEffect(() => {
    if (!category) return;
    const nextQS = buildQSFromState();
    const currentQS = searchParams?.toString() || "";
    if (nextQS === currentQS) {
      // No URL change needed, also avoid flicker
      setLoading(false);
      return;
    }
    // Prevent initial double-push on first hydration
    if (!didHydrateFromUrl.current) return;
    setLoading(true);
    const url = nextQS ? `${pathname}?${nextQS}` : pathname;
    router.replace(url, { scroll: false });
    const id = setTimeout(() => setLoading(false), 180);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCollections, selectedColors, priceMin, priceMax, thermoFilter, sort, pathname, searchParams]);

  let filtered = [...allProducts];
  if (selectedCollections.length) filtered = filtered.filter((p) => selectedCollections.includes(p.collection));
  if (selectedColors.length) filtered = filtered.filter((p) => (p.colors || []).some((c) => selectedColors.includes(c)));
  if (priceMin !== "") {
    const min = Number(priceMin);
    if (!Number.isNaN(min)) filtered = filtered.filter((p) => p.price >= min);
  }
  if (priceMax !== "") {
    const max = Number(priceMax);
    if (!Number.isNaN(max)) filtered = filtered.filter((p) => p.price <= max);
  }
  if (thermoFilter !== "all") {
    const want = thermoFilter === "yes";
    filtered = filtered.filter((p) => (typeof p.thermo === "boolean" ? p.thermo === want : false));
  }

  switch (sort) {
    case "cheap":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "expensive":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "new":
      filtered.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    default:
      break;
  }

  if (!category) {
    return (
      <main className="container py-10">
        <div className="text-ink">{t(locale, "category.notFound")}</div>
      </main>
    );
  }

  const categoryName =
    t(locale, `categories.details.${slug}.name`) !== `categories.details.${slug}.name`
      ? t(locale, `categories.details.${slug}.name`)
      : t(locale, `categories.${slug}`);

  const resolvedDescription =
    t(locale, `categories.details.${slug}.description`) !== `categories.details.${slug}.description`
      ? t(locale, `categories.details.${slug}.description`)
      : category.description;

  const isPrivateHouse = slug === "ardurvis-privatmajai";

  const typeOptions = [
    "ardurvis-dzivoklim",
    "ardurvis-privatmajai",
    "ieksdurvis",
    "bidamas-durvis",
    "sleptas-durvis",
  ];

  const typeTitle = locale === "lt" ? "Durų tipas" : locale === "en" ? "Door type" : "Durvju tips";

  const labelForSlug = (s) => {
    const k1 = t(locale, `categories.details.${s}.name`);
    if (k1 !== `categories.details.${s}.name`) return k1;
    const k2 = t(locale, `categories.${s}`);
    if (k2 !== `categories.${s}`) return k2;
    const fromData = allCategoriesData.find((c) => c.slug === s)?.name;
    return fromData || s;
  };

  const searchPlaceholder = locale === "lt" ? "Ieškoti..." : locale === "en" ? "Search..." : "Meklēt...";
  const collectionQuery = collectionSearch.trim().toLowerCase();
  const colorQuery = colorSearch.trim().toLowerCase();
  const filteredCollections = collectionOptions.filter((c) => c.toLowerCase().includes(collectionQuery));
  const filteredColors = colorOptions.filter((c) => {
    const base = String(c).toLowerCase();
    const translated = String(translateColorLabel(c)).toLowerCase();
    return base.includes(colorQuery) || translated.includes(colorQuery);
  });

  const Filters = (
    <div className="w-full max-w-[260px] shrink-0 md:sticky md:top-20 relative z-0">
      <div className="mb-6">
        <div className="mb-3 border-b border-line pb-2 text-[13px] font-semibold uppercase tracking-wider text-ink">{typeTitle}</div>
        <div className="space-y-0.5">
          {typeOptions.map((s) => (
            <label key={s} className="-mx-2 flex min-h-10 cursor-pointer items-center gap-2.5 rounded-sm px-2 text-[15px] text-ink transition-colors duration-200 hover:bg-[--color-soft]">
              <input
                type="radio"
                name="door-type"
                className="h-4 w-4 accent-[--color-accent]"
                checked={slug === s}
                onChange={() => router.push(withLocaleHref(locale, `/kategorija/${s}`))}
              />
              <span>{labelForSlug(s)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <button
          type="button"
          onClick={() => setCollectionsOpen((v) => { const next = !v; if (next) setColorsOpen(false); return next; })}
          aria-expanded={collectionsOpen}
          className="mb-3 flex w-full items-center justify-between border-b border-line pb-2 text-[13px] font-semibold uppercase tracking-wider text-ink hover:text-ink"
        >
          <span>{t(locale, "category.collection")}</span>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-muted group-hover:text-ink">
            {collectionsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>
        {collectionsOpen ? (
          <>
            <div className="mb-2">
              <input
                type="text"
                value={collectionSearch}
                onChange={(e) => setCollectionSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="min-h-9 w-full rounded-sm border border-line bg-white px-2 py-1 text-[14px] text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-[--color-accent]"
              />
            </div>
            <div className="max-h-80 overflow-y-auto pr-1"><div className="space-y-0.5">
              {filteredCollections.map((c) => (
                <label key={c} className="-mx-2 flex min-h-10 cursor-pointer items-center gap-2.5 rounded-sm px-2 text-[15px] text-ink transition-colors duration-200 hover:bg-[--color-soft]">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[--color-accent]"
                    checked={selectedCollections.includes(c)}
                    onChange={() => toggleIn(selectedCollections, setSelectedCollections, c)}
                  />
                  <span>{c}</span>
                </label>
              ))}
              {!filteredCollections.length ? (
                <div className="px-2 py-2 text-sm text-muted">—</div>
              ) : null}
            </div></div>
          </>
        ) : null}
      </div>

      <div className="mb-6">
        <button
          type="button"
          onClick={() => setColorsOpen((v) => { const next = !v; if (next) setCollectionsOpen(false); return next; })}
          aria-expanded={colorsOpen}
          className="mb-3 flex w-full items-center justify-between border-b border-line pb-2 text-[13px] font-semibold uppercase tracking-wider text-ink hover:text-ink"
        >
          <span>{t(locale, "category.color")}</span>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-muted group-hover:text-ink">
            {colorsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>
        {colorsOpen ? (
          <>
            <div className="mb-2">
              <input
                type="text"
                value={colorSearch}
                onChange={(e) => setColorSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="min-h-9 w-full rounded-sm border border-line bg-white px-2 py-1 text-[14px] text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-[--color-accent]"
              />
            </div>
            <div className="max-h-80 overflow-y-auto pr-1"><div className="space-y-0.5">
              {filteredColors.map((c) => (
                <label key={c} className="-mx-2 flex min-h-10 cursor-pointer items-center gap-2.5 rounded-sm px-2 text-[15px] text-ink transition-colors duration-200 hover:bg-[--color-soft]">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[--color-accent]"
                    checked={selectedColors.includes(c)}
                    onChange={() => toggleIn(selectedColors, setSelectedColors, c)}
                  />
                  <span>{translateColorLabel(c)}</span>
                </label>
              ))}
              {!filteredColors.length ? (
                <div className="px-2 py-2 text-sm text-muted">—</div>
              ) : null}
            </div></div>
          </>
        ) : null}
      </div>

      <div className="mb-6">
        <div className="mb-3 border-b border-line pb-2 text-[13px] font-semibold uppercase tracking-wider text-ink">{t(locale, "category.price")}</div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder={t(locale, "category.from")}
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="min-h-10 w-24 rounded-sm border border-line bg-white px-2 py-1 text-[15px] transition-colors focus:outline-none focus:ring-2 focus:ring-[--color-accent]"
          />
          <span className="text-muted">—</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder={t(locale, "category.to")}
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="min-h-10 w-24 rounded-sm border border-line bg-white px-2 py-1 text-[15px] transition-colors focus:outline-none focus:ring-2 focus:ring-[--color-accent]"
          />
        </div>
      </div>

      {isPrivateHouse && (
        <div className="mb-6">
          <div className="mb-3 border-b border-line pb-2 text-[13px] font-semibold uppercase tracking-wider text-ink">{t(locale, "category.thermo")}</div>
          <div className="space-y-0.5">
            <label className="-mx-2 flex min-h-10 cursor-pointer items-center gap-2.5 rounded-sm px-2 text-[15px] text-ink transition-colors duration-200 hover:bg-[--color-soft]">
              <input
                type="radio"
                name="thermo"
                className="h-4 w-4 accent-[--color-accent]"
                checked={thermoFilter === "all"}
                onChange={() => setThermoFilter("all")}
              />
              <span>{t(locale, "category.all")}</span>
            </label>
            <label className="-mx-2 flex min-h-10 cursor-pointer items-center gap-2.5 rounded-sm px-2 text-[15px] text-ink transition-colors duration-200 hover:bg-[--color-soft]">
              <input
                type="radio"
                name="thermo"
                className="h-4 w-4 accent-[--color-accent]"
                checked={thermoFilter === "yes"}
                onChange={() => setThermoFilter("yes")}
              />
              <span>{t(locale, "category.yes")}</span>
            </label>
            <label className="-mx-2 flex min-h-10 cursor-pointer items-center gap-2.5 rounded-sm px-2 text-[15px] text-ink transition-colors duration-200 hover:bg-[--color-soft]">
              <input
                type="radio"
                name="thermo"
                className="h-4 w-4 accent-[--color-accent]"
                checked={thermoFilter === "no"}
                onChange={() => setThermoFilter("no")}
              />
              <span>{t(locale, "category.no")}</span>
            </label>
          </div>
        </div>
      )}

      <button
        onClick={clearFilters}
        className="min-h-11 rounded-sm border border-line px-4 py-1.5 text-[15px] text-ink transition-[border-color,transform] duration-200 hover:border-[--color-muted] active:scale-[0.97]"
      >
        {t(locale, "category.clearFilters")}
      </button>
    </div>
  );

  return (
    <main>
      <section className="border-b border-line">
        <div className="container pt-6 pb-0">
          <div className="text-sm text-muted">
            <Link className="text-ink hover:text-ink" href={withLocaleHref(locale, "/")}>{t(locale, "common.home")}</Link> <span className="text-muted">/</span> <span className="text-ink">{categoryName}</span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-wide text-ink">{categoryName}</h1>
          {resolvedDescription ? (
            <p className="mt-2 max-w-3xl text-muted">{resolvedDescription}</p>
          ) : null}
        </div>
      </section>

      <section className="-mt-1">
        <div className="container pt-0 pb-6">
          <div className="mb-0 flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm text-muted">{filtered.length} {t(locale, "category.models")}</div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ChevronDownCircle size={16} /> {t(locale, "category.sort")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t(locale, "category.sort")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSort("popular")} className="justify-between">
                      {t(locale, "category.sortPopular")} {sort === "popular" && <Check className="ml-2" size={14} />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort("cheap")} className="justify-between">
                      {t(locale, "category.sortCheap")} {sort === "cheap" && <Check className="ml-2" size={14} />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort("expensive")} className="justify-between">
                      {t(locale, "category.sortExpensive")} {sort === "expensive" && <Check className="ml-2" size={14} />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort("new")} className="justify-between">
                      {t(locale, "category.sortNew")} {sort === "new" && <Check className="ml-2" size={14} />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="md:hidden gap-2">
                      <SlidersHorizontal size={16} /> {t(locale, "category.filters")}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[85%] max-w-[360px]">
                    <SheetHeader>
                      <SheetTitle>{t(locale, "category.filters")}</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 space-y-4">{Filters}</div>
                    <div className="mt-6">
                      <Button className="w-full" onClick={() => setMobileFiltersOpen(false)}>
                        {t(locale, "category.showResults")} ({filtered.length})
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {selectedCollections.map((c) => (
                <Badge key={`col-${c}`} variant="secondary" className="gap-2">
                  {c}
                  <button aria-label={t(locale, "a11y.removeFilter") || "Noņemt filtru"} className="ml-1 text-muted-foreground" onClick={() => toggleIn(selectedCollections, setSelectedCollections, c)}>×</button>
                </Badge>
              ))}
              {selectedColors.map((c) => (
                <Badge key={`clr-${c}`} variant="secondary" className="gap-2">
                  {translateColorLabel(c)}
                  <button aria-label={t(locale, "a11y.removeFilter") || "Noņemt filtru"} className="ml-1 text-muted-foreground" onClick={() => toggleIn(selectedColors, setSelectedColors, c)}>×</button>
                </Badge>
              ))}
              {priceMin !== "" && (
                <Badge variant="secondary" className="gap-2">
                  {t(locale, "category.from")} €{priceMin}
                  <button aria-label={t(locale, "a11y.removeFilter") || "Noņemt filtru"} className="ml-1 text-muted-foreground" onClick={() => setPriceMin("")}>×</button>
                </Badge>
              )}
              {priceMax !== "" && (
                <Badge variant="secondary" className="gap-2">
                  {t(locale, "category.to")} €{priceMax}
                  <button aria-label={t(locale, "a11y.removeFilter") || "Noņemt filtru"} className="ml-1 text-muted-foreground" onClick={() => setPriceMax("")}>×</button>
                </Badge>
              )}
              {thermoFilter !== "all" && (
                <Badge variant="secondary" className="gap-2">
                  {t(locale, "category.thermo")}: {thermoFilter === "yes" ? t(locale, "category.yes") : t(locale, "category.no")}
                  <button aria-label={t(locale, "a11y.removeFilter") || "Noņemt filtru"} className="ml-1 text-muted-foreground" onClick={() => setThermoFilter("all")}>×</button>
                </Badge>
              )}
              {(selectedCollections.length || selectedColors.length || priceMin !== "" || priceMax !== "" || thermoFilter !== "all") ? (
                <Button variant="ghost" className="h-8" onClick={clearFilters}>{t(locale, "category.clearFilters")}</Button>
              ) : null}
            </div>
          </div>

          <div className="flex gap-6">
            <div className="hidden md:block">{Filters}</div>
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-sm border border-line p-3">
                      <Skeleton className="h-60 w-full rounded-sm" />
                      <div className="mt-3 space-y-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <RevealGrid
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    revealKey={`${slug}|${sort}|${filtered.map((p) => p.id).join(",")}`}
                  >
                    {filtered.slice(0, visibleCount).map((p, i) => (
                      <MotionReveal key={p.id} index={i}>
                        <ProductCard product={p} />
                      </MotionReveal>
                    ))}
                  </RevealGrid>
                  {visibleCount < filtered.length ? (
                    <div className="mt-6 flex justify-center">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setVisibleCount((c) => c + 12);
                        }}
                      >
                        VAIRĀK
                      </Button>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
