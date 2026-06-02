"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/data/products";

export default function ContactsClient() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("produkts");

  const product = useMemo(() => (productId ? getProductById(productId) : null), [productId]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (product && !message) {
      setMessage(`Vēlos piedāvājumu par modeli: ${product.name}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  function onSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main>
      <section className="border-b border-line">
        <div className="container py-6">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-wide text-ink">Kontakti</h1>
          {product && (
            <div className="mt-2 text-sm text-muted">
              Pieteikums saistīts ar produktu: <Link className="text-ink underline" href={`/produkts/${product.id}`}>{product.name}</Link>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="container py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: contact info + map */}
            <div className="space-y-4">
              <div className="rounded-sm border border-line bg-white p-4">
                <div className="text-sm font-semibold tracking-wide text-ink mb-2">Sazinies ar mums</div>
                <div className="text-[15px] text-ink">
                  <div className="mb-2">
                    <div className="text-muted">Tālrunis</div>
                    <a className="block text-ink" href="tel:+37167704154">+371 67704154</a>
                    <a className="block text-ink" href="tel:+37126668000">+371 26668000</a>
                  </div>
                  <div className="mb-2">
                    <div className="text-muted">E-pasts</div>
                    <a className="block text-ink" href="mailto:info@durvjunams.lv">info@durvjunams.lv</a>
                  </div>
                  <div className="mb-2">
                    <div className="text-muted">Salons</div>
                    <div className="text-ink">T/C Ozols, Mazā Rencēnu iela 1, Rīga</div>
                  </div>
                  <div>
                    <div className="text-muted">Darba laiks</div>
                    <div className="text-ink">katru dienu 10:00–21:00</div>
                  </div>
                </div>
              </div>

              <div className="rounded-sm border border-line overflow-hidden">
                <iframe
                  title="Durvju Nams — karte"
                  src="https://www.google.com/maps?q=Maz%C4%81%20Renc%C4%93nu%20iela%201%2C%20R%C4%ABga&output=embed"
                  className="w-full h-[280px] sm:h-[340px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Right: form */}
            <div>
              <form onSubmit={onSubmit} className="rounded-sm border border-line bg-white p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted mb-1">Vārds</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-sm border border-line bg-white px-3 py-2 text-[15px] text-ink"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-1">Tālrunis</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full rounded-sm border border-line bg-white px-3 py-2 text-[15px] text-ink"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1">E-pasts</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-sm border border-line bg-white px-3 py-2 text-[15px] text-ink"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1">Ziņojums</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="w-full rounded-sm border border-line bg-white px-3 py-2 text-[15px] text-ink"
                    placeholder="Jūsu jautājums vai pieprasījums"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button type="submit" className="bg-accent hover:bg-accent-dark text-white rounded-sm px-5 py-2">
                    Nosūtīt
                  </button>
                </div>
                {submitted && (
                  <div className="text-ink">
                    Paldies! Sazināsimies tuvākajā laikā.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
