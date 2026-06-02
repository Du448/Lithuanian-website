import ContactsClient from "@/components/ContactsClient";
import { Suspense } from "react";

export const metadata = { title: "Kontakti" };

export default function ContactsPage() {
  return (
    <main>
      <Suspense fallback={<div className="container py-6 text-muted">Ielādē kontaktu lapu…</div>}>
        <ContactsClient />
      </Suspense>
    </main>
  );
}
