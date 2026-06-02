"use client";

import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import Link from "next/link";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") || "").trim();
  const lower = q.toLowerCase();

  const results = lower
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          (p.collection || "").toLowerCase().includes(lower)
      )
    : [];

  return (
    <>
      <section className="border-b border-line">
        <div className="container py-6">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-wide text-ink">Meklēšana</h1>
          <p className="mt-2 text-muted">
            Meklēšanas rezultāti: '{q}' ({results.length} atrasti)
          </p>
        </div>
      </section>

      <section>
        <div className="container py-6">
          {q && results.length === 0 ? (
            <div className="text-ink">
              Nekas netika atrasts. <Link className="text-accent underline" href="/">Atpakaļ uz sākumu</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
