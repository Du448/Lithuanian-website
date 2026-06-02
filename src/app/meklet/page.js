import { Suspense } from "react";
import SearchClient from "@/components/SearchClient";

export const metadata = { title: "Meklēšana" };

export default function SearchPage() {
  return (
    <main>
      <Suspense fallback={<div className="container py-6 text-muted">Ielādē meklēšanas rezultātus…</div>}>
        <SearchClient />
      </Suspense>
    </main>
  );
}
