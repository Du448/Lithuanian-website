"use client";

import Link from "next/link";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);

  return (
    <footer className="mt-16 bg-[--color-soft] text-ink border-t border-line">
      <div className="container py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold tracking-wide mb-3">{t(locale, "footer.assortment")}</h3>
            <ul className="space-y-2 text-[15px] text-ink">
              <li><Link className="hover:text-ink" href={withLocaleHref(locale, "/kategorija/ardurvis-dzivoklim")}>{t(locale, "nav.exteriorApartment")}</Link></li>
              <li><Link className="hover:text-ink" href={withLocaleHref(locale, "/kategorija/ardurvis-privatmajai")}>{t(locale, "nav.exteriorHouse")}</Link></li>
              <li><Link className="hover:text-ink" href={withLocaleHref(locale, "/kategorija/ieksdurvis")}>{t(locale, "nav.interior")}</Link></li>
              <li><Link className="hover:text-ink" href={withLocaleHref(locale, "/kategorija/bidamas-durvis")}>{t(locale, "nav.sliding")}</Link></li>
              <li><Link className="hover:text-ink" href={withLocaleHref(locale, "/kategorija/sleptas-durvis")}>{t(locale, "nav.hidden")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide mb-3">{t(locale, "footer.services")}</h3>
            <ul className="space-y-2 text-[15px] text-ink">
              <li><Link className="hover:text-ink" href={withLocaleHref(locale, "/pakalpojumi/uzmerisana")}>{t(locale, "footer.measurement")}</Link></li>
              <li><Link className="hover:text-ink" href={withLocaleHref(locale, "/pakalpojumi/montaza")}>{t(locale, "footer.installation")}</Link></li>
              <li><Link className="hover:text-ink" href={withLocaleHref(locale, "/pakalpojumi/garantija")}>{t(locale, "footer.warranty")}</Link></li>
              <li><Link className="hover:text-ink" href={withLocaleHref(locale, "/pakalpojumi/piegade")}>{t(locale, "footer.delivery")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide mb-3">{t(locale, "footer.company")}</h3>
            <ul className="space-y-2 text-[15px] text-ink">
              <li><Link className="hover:text-ink" href={withLocaleHref(locale, "/par-mums")}>{t(locale, "nav.about")}</Link></li>
              <li><Link className="hover:text-ink" href={withLocaleHref(locale, "/kontakti")}>{t(locale, "nav.contacts")}</Link></li>
              <li><Link className="hover:text-ink text-accent" href={withLocaleHref(locale, "/akcijas")}>{t(locale, "nav.deals")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide mb-3">{t(locale, "footer.contacts")}</h3>
            <div className="space-y-2 text-[15px]">
              <div>
                <div className="text-muted">{t(locale, "footer.phone")}</div>
                <a className="block text-ink" href="tel:+37066213171">+370 662 13171</a>
                <a className="block text-ink" href="tel:+37060557978">+370 605 57978</a>
              </div>
              <div>
                <div className="text-muted">{t(locale, "footer.email")}</div>
                <a className="block text-ink" href="mailto:info@tnbaltic.lt">info@tnbaltic.lt</a>
              </div>
              <div>
                <div className="text-muted">{t(locale, "footer.showroom")}</div>
                <div className="text-ink">Džūkų g. 17, Šveicarijos k., LT-55301 Jonavos r.</div>
              </div>
              <div>
                <div className="text-muted">{t(locale, "footer.hours")}</div>
                <div className="text-ink">9:00–18:00</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container py-4 text-center text-sm text-muted">
          © 2025 TN Baltic. {t(locale, "footer.rights")}
        </div>
      </div>
    </footer>
  );
}
