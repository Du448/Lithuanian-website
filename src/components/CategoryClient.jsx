"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory, getCategoryBySlug } from "@/data/products";

const COLLECTION_ORDER = ["STANDART", "TREND", "TRIUMPH", "ELITE", "STATUS"];

export default function CategoryClient({ slug }) {
  const category = getCategoryBySlug(slug);
  const allProducts = getProductsByCategory(slug);

  if (!category) {
    return (
      <main className="container py-10">
        <div className="text-ink">Kategorija nav atrasta</div>
      </main>
    );
  }

  const collectionOptions = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.collection));
    const list = Array.from(set);
    return list.sort((a, b) => COLLECTION_ORDER.indexOf(a) - COLLECTION_ORDER.indexOf(b));
  }, [allProducts]);

  const colorOptions = useMemo(() => {
    const set = new Set();
    allProducts.forEach((p) => (p.colors || []).forEach((c) => set.add(c)));
    return Array.from(set);
  }, [allProducts]);

  const securityOptions = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.security).filter(Boolean));
    return Array.from(set);
  }, [allProducts]);

  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedSecurity, setSelectedSecurity] = useState([]);
  const [sort, setSort] = useState("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleIn = (arr, setArr, value) => {
    setArr((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const clearFilters = () => {
    setSelectedCollections([]);
    setSelectedColors([]);
    setPriceMin("");
    setPriceMax("");
    setSelectedSecurity([]);
  };

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (selectedCollections.length) list = list.filter((p) => selectedCollections.includes(p.collection));
    if (selectedColors.length) list = list.filter((p) => (p.colors || []).some((c) => selectedColors.includes(c)));
    if (priceMin !== "") {
      const min = Number(priceMin);
      if (!Number.isNaN(min)) list = list.filter((p) => p.price >= min);
    }
    if (priceMax !== "") {
      const max = Number(priceMax);
      if (!Number.isNaN(max)) list = list.filter((p) => p.price <= max);
    }
    if (selectedSecurity.length) list = list.filter((p) => (p.security ? selectedSecurity.includes(p.security) : false));

    switch (sort) {
      case "cheap":
        list.sort((a, b) => a.price - b.price);
        break;
      case "expensive":
        list.sort((a, b) => b.price - a.price);
        break;
      case "new":
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      default:
        break;
    }
    return list;
  }, [allProducts, selectedCollections, selectedColors, priceMin, priceMax, selectedSecurity, sort]);

  const isExterior = slug.startsWith("ardurvis-");

  const Filters = (
    <div className="w-full max-w-[260px] shrink-0">
      <div className="mb-6">
        <div className="mb-2 text-sm font-semibold tracking-wide text-ink">Kolekcija</div>
        <div className="space-y-1">
          {collectionOptions.map((c) => (
            <label key={c} className="flex items-center gap-2 text-[15px] text-ink">
              <input
                type="checkbox"
                className="accent-[--color-accent]"
                checked={selectedCollections.includes(c)}
                onChange={() => toggleIn(selectedCollections, setSelectedCollections, c)}
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 text-sm font-semibold tracking-wide text-ink">Krāsa</div>
        <div className="space-y-1">
          {colorOptions.map((c) => (
            <label key={c} className="flex items-center gap-2 text-[15px] text-ink">
              <input
                type="checkbox"
                className="accent-[--color-accent]"
                checked={selectedColors.includes(c)}
                onChange={() => toggleIn(selectedColors, setSelectedColors, c)}
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 text-sm font-semibold tracking-wide text-ink">Cena</div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="No"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-24 rounded-sm border border-line bg-white px-2 py-1 text-[15px]"
          />
          <span className="text-muted">—</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Līdz"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-24 rounded-sm border border-line bg-white px-2 py-1 text-[15px]"
          />
        </div>
      </div>

      {isExterior && securityOptions.length > 0 && (
        <div className="mb-6">
          <div className="mb-2 text-sm font-semibold tracking-wide text-ink">Drošības klase</div>
          <div className="space-y-1">
            {securityOptions.map((s) => (
              <label key={s} className="flex items-center gap-2 text-[15px] text-ink">
                <input
                  type="checkbox"
                  className="accent-[--color-accent]"
                  checked={selectedSecurity.includes(s)}
                  onChange={() => toggleIn(selectedSecurity, setSelectedSecurity, s)}
                />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button onClick={clearFilters} className="rounded-sm border border-line px-3 py-1.5 text-[15px] text-ink">
        Notīrīt filtrus
      </button>
    </div>
  );

  return (
    <main>
      <section className="border-b border-line">
        <div className="container py-6">
          <div className="text-sm text-muted">
            <Link className="text-ink hover:text-ink" href="/">Sākums</Link> <span className="text-muted">/</span> <span className="text-ink">{category.name}</span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-wide text-ink">{category.name}</h1>
          {category.description && (
            <p className="mt-2 max-w-3xl text-muted">{category.description}</p>
          )}
        </div>
      </section>

      <section>
        <div className="container py-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-muted">{filtered.length} modeļi</div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted">Kārtot:</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-sm border border-line bg-white px-2 py-1 text-[15px] text-ink"
              >
                <option value="popular">Populārākie</option>
                <option value="cheap">Lētākie vispirms</option>
                <option value="expensive">Dārgākie vispirms</option>
                <option value="new">Jaunumi</option>
              </select>
              <button
                className="md:hidden rounded-sm border border-line px-3 py-1.5 text-[15px] text-ink"
                onClick={() => setMobileFiltersOpen(true)}
              >
                Filtri
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="hidden md:block">{Filters}</div>
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setMobileFiltersOpen(false)}>
          <div className="absolute inset-y-0 right-0 w-[85%] max-w-[320px] bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-ink">Filtri</div>
              <button className="rounded-sm border border-line px-2 py-1 text-[15px]" onClick={() => setMobileFiltersOpen(false)}>
                Aizvērt
              </button>
            </div>
            {Filters}
          </div>
        </div>
      )}
    </main>
  );
}
