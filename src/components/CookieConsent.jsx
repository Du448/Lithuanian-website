"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, t } from "@/lib/i18n";

const STORAGE_KEY = "cookie-consent"; // values: "essential" | "all"

export default function CookieConsent() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname || "/");
  const [choice, setChoice] = useState(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "essential" || v === "all") setChoice(v);
    } catch {}
  }, []);

  const save = (v) => {
    try { localStorage.setItem(STORAGE_KEY, v); } catch {}
    setChoice(v);
    // optionally, emit a custom event so loaders can react
    try { window.dispatchEvent(new CustomEvent("cookie-consent", { detail: v })); } catch {}
  };

  // Hide banner once a decision exists
  if (choice === "essential" || choice === "all") return null;

  // Show only if there is any analytics configured; otherwise it is optional but still GDPR-friendly
  const hasAnalyticsHint = Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || process.env.NEXT_PUBLIC_GA_ID);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="container">
        <div className="mb-3 rounded-sm border border-line bg-white shadow-premium p-3 sm:p-4">
          <div className="text-[14px] text-ink">
            {t(locale, "privacy.cookiesNotice") || "Mēs izmantojam tikai nepieciešamās sīkdatnes. Ar Jūsu atļauju varam ieslēgt arī analītikas sīkdatnes, lai uzlabotu vietni."}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="rounded-sm border border-line px-4 py-2 text-[14px] text-ink hover:border-[--color-muted] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ink]" onClick={() => save("essential")}>
              {t(locale, "privacy.rejectNonEssential") || "Noraidīt neobligātās"}
            </button>
            {hasAnalyticsHint ? (
              <button type="button" className="rounded-sm bg-accent hover:bg-accent-dark px-4 py-2 text-[14px] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[--color-ink]" onClick={() => save("all")}>
                {t(locale, "privacy.acceptAll") || "Piekrītu visām"}
              </button>
            ) : null}
            <a href={locale ? `/${locale}/par-mums` : "/par-mums"} className="ml-auto text-[13px] text-muted underline">
              {t(locale, "privacy.learnMore") || "Uzzināt vairāk"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
