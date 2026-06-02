import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[--color-soft] text-ink border-t border-line">
      <div className="container py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold tracking-wide mb-3">Sortiments</h3>
            <ul className="space-y-2 text-[15px] text-ink">
              <li><Link className="hover:text-ink" href="/kategorija/ardurvis-dzivoklim">Ārdurvis dzīvoklim</Link></li>
              <li><Link className="hover:text-ink" href="/kategorija/ardurvis-privatmajai">Ārdurvis privātmājai</Link></li>
              <li><Link className="hover:text-ink" href="/kategorija/ieksdurvis">Iekšdurvis</Link></li>
              <li><Link className="hover:text-ink" href="/kategorija/bidamas-durvis">Bīdāmās durvis</Link></li>
              <li><Link className="hover:text-ink" href="/kategorija/sleptas-durvis">Slēptās durvis</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide mb-3">Pakalpojumi</h3>
            <ul className="space-y-2 text-[15px] text-ink">
              <li><Link className="hover:text-ink" href="/pakalpojumi/uzmerisana">Uzmērīšana</Link></li>
              <li><Link className="hover:text-ink" href="/pakalpojumi/montaza">Montāža</Link></li>
              <li><Link className="hover:text-ink" href="/pakalpojumi/garantija">Garantija</Link></li>
              <li><Link className="hover:text-ink" href="/pakalpojumi/piegade">Piegāde</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide mb-3">Uzņēmums</h3>
            <ul className="space-y-2 text-[15px] text-ink">
              <li><Link className="hover:text-ink" href="/par-mums">Par mums</Link></li>
              <li><Link className="hover:text-ink" href="/kontakti">Kontakti</Link></li>
              <li><Link className="hover:text-ink text-accent" href="/akcijas">Akcijas</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide mb-3">Kontakti</h3>
            <div className="space-y-2 text-[15px]">
              <div>
                <div className="text-muted">Tālrunis</div>
                <a className="block text-ink" href="tel:+37167704154">+371 67704154</a>
                <a className="block text-ink" href="tel:+37126668000">+371 26668000</a>
              </div>
              <div>
                <div className="text-muted">E-pasts</div>
                <a className="block text-ink" href="mailto:info@durvjunams.lv">info@durvjunams.lv</a>
              </div>
              <div>
                <div className="text-muted">Salons</div>
                <div className="text-ink">T/C Ozols, Mazā Rencēnu iela 1, Rīga</div>
              </div>
              <div>
                <div className="text-muted">Darba laiks</div>
                <div className="text-ink">10:00–21:00</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container py-4 text-center text-sm text-muted">
          © 2025 Durvju Nams. Visas tiesības aizsargātas.
        </div>
      </div>
    </footer>
  );
}
