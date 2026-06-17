"use client";

import Link from "next/link";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import RevealGrid from "@/components/anim/RevealGrid";
import { getProductsByCategory, getCategoryBySlug } from "@/data/products";
import { usePathname, useRouter } from "next/navigation";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { categories as allCategoriesData } from "@/data/products";

export default function CategoryClient({ slug }) {
  const locale = getLocaleFromPathname(usePathname());
  const router = useRouter();
  const category = getCategoryBySlug(slug);
  const allProducts = getProductsByCategory(slug);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [thermoFilter, setThermoFilter] = useState("all"); // all | yes | no
  const [sort, setSort] = useState("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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
    <div className="w-full max-w-[260px] shrink-0">
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
        <div className="mb-3 flex items-center justify-between border-b border-line pb-2 text-[13px] font-semibold uppercase tracking-wider text-ink">
          <span>{t(locale, "category.collection")}</span>
          <button
            className="text-xs text-muted hover:text-ink"
            onClick={() => setCollectionsOpen((v) => !v)}
          >
            {collectionsOpen ? t(locale, "category.close") : t(locale, "category.filters")}
          </button>
        </div>
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
            <div className="space-y-0.5 max-h-80 overflow-auto pr-1">
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
            </div>
          </>
        ) : null}
      </div>

      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between border-b border-line pb-2 text-[13px] font-semibold uppercase tracking-wider text-ink">
          <span>{t(locale, "category.color")}</span>
          <button
            className="text-xs text-muted hover:text-ink"
            onClick={() => setColorsOpen((v) => !v)}
          >
            {colorsOpen ? t(locale, "category.close") : t(locale, "category.filters")}
          </button>
        </div>
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
            <div className="space-y-0.5 max-h-80 overflow-auto pr-1">
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
            </div>
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
        <div className="container py-6">
          <div className="text-sm text-muted">
            <Link className="text-ink hover:text-ink" href={withLocaleHref(locale, "/")}>{t(locale, "common.home")}</Link> <span className="text-muted">/</span> <span className="text-ink">{categoryName}</span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-wide text-ink">{categoryName}</h1>
          {resolvedDescription ? (
            <p className="mt-2 max-w-3xl text-muted">{resolvedDescription}</p>
          ) : null}
        </div>
      </section>

      <section>
        <div className="container py-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-muted">{filtered.length} {t(locale, "category.models")}</div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted">{t(locale, "category.sort")}</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="min-h-10 rounded-sm border border-line bg-white px-2 py-1 text-[15px] text-ink transition-colors hover:border-[--color-muted] focus:outline-none focus:ring-2 focus:ring-[--color-accent]"
              >
                <option value="popular">{t(locale, "category.sortPopular")}</option>
                <option value="cheap">{t(locale, "category.sortCheap")}</option>
                <option value="expensive">{t(locale, "category.sortExpensive")}</option>
                <option value="new">{t(locale, "category.sortNew")}</option>
              </select>
              <button
                className="md:hidden min-h-10 rounded-sm border border-line px-4 py-1.5 text-[15px] text-ink transition-colors active:bg-[--color-soft]"
                onClick={() => setMobileFiltersOpen(true)}
              >
                {t(locale, "category.filters")}
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="hidden md:block">{Filters}</div>
            <div className="flex-1">
              <RevealGrid
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                revealKey={`${slug}|${sort}|${filtered.map((p) => p.id).join(",")}`}
              >
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </RevealGrid>
            </div>
          </div>
        </div>
      </section>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden animate-fade-in" onClick={() => setMobileFiltersOpen(false)}>
          <div
            className="absolute inset-y-0 right-0 w-[85%] max-w-[320px] overflow-y-auto bg-white p-4 animate-drawer-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-ink">{t(locale, "category.filters")}</div>
              <button
                className="min-h-10 rounded-sm border border-line px-3 py-1 text-[15px] transition-colors active:bg-[--color-soft]"
                onClick={() => setMobileFiltersOpen(false)}
              >
                {t(locale, "category.close")}
              </button>
            </div>
            {Filters}
          </div>
        </div>
      )}
    </main>
  );
}
