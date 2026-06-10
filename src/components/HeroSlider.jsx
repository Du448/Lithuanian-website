"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, t } from "@/lib/i18n";

export default function HeroSlider({ slides }) {
  const locale = getLocaleFromPathname(usePathname());
  const safeSlides = Array.isArray(slides) && slides.length > 0 ? slides : [];
  const [idx, setIdx] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const count = safeSlides.length;

  const extendedSlides = useMemo(() => {
    if (!count) return [];
    return [safeSlides[count - 1], ...safeSlides, safeSlides[0]];
  }, [safeSlides, count]);

  const activeIndex = useMemo(() => {
    if (!count) return 0;
    const real = idx - 1;
    return ((real % count) + count) % count;
  }, [idx, count]);

  useEffect(() => {
    if (!count) return;
    setIsAnimating(false);
    setIdx(1);
    requestAnimationFrame(() => setIsAnimating(true));
  }, [count]);

  useEffect(() => {
    if (!count) return;
    if (paused) return;
    timerRef.current = setInterval(() => setIdx((i) => i + 1), 5000);
    return () => clearInterval(timerRef.current);
  }, [count, paused]);

  const go = (n) => {
    if (!count) return;
    setIsAnimating(true);
    setIdx(n);
  };

  const onKey = (e) => {
    if (e.key === "ArrowLeft") go(idx - 1);
    if (e.key === "ArrowRight") go(idx + 1);
  };

  const onTransitionEnd = () => {
    if (!count) return;
    if (idx === 0) {
      setIsAnimating(false);
      setIdx(count);
      requestAnimationFrame(() => requestAnimationFrame(() => setIsAnimating(true)));
    }
    if (idx === count + 1) {
      setIsAnimating(false);
      setIdx(1);
      requestAnimationFrame(() => requestAnimationFrame(() => setIsAnimating(true)));
    }
  };

  return (
    <div
      className="relative overflow-hidden w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={onKey}
      tabIndex={0}
      aria-label={t(locale, "hero.carouselLabel")}
    >
      <div className="relative h-[80vh] lg:h-screen bg-[--color-soft]">
        {count ? (
          <div
            className={`${isAnimating ? "transition-transform duration-700 ease-out" : ""} flex h-full`}
            style={{ transform: `translateX(-${idx * 100}%)` }}
            onTransitionEnd={onTransitionEnd}
          >
            {extendedSlides.map((slide, i) => (
              <div key={i} className="relative w-full h-full flex-none">
                <Image
                  src={slide.image}
                  alt={slide.title || t(locale, "hero.imageAlt")}
                  fill
                  unoptimized
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                {i === activeIndex + 1 ? (
                  <div className="absolute inset-0 flex items-center">
                    <div className="container">
                      <div className="px-6 sm:px-10 max-w-3xl">
                        <div className="rounded-sm border border-white/60 bg-white/85 backdrop-blur-sm p-5 sm:p-7 shadow-sm">
                          {slide.kicker ? (
                            <div className="text-muted text-sm uppercase tracking-wide mb-2">{slide.kicker}</div>
                          ) : null}
                          {slide.title ? (
                            <h1 className="text-ink text-3xl sm:text-5xl font-semibold leading-tight">{slide.title}</h1>
                          ) : null}
                          {slide.subtitle ? (
                            <p className="mt-3 text-ink/80 text-base sm:text-lg">{slide.subtitle}</p>
                          ) : null}
                          {slide.cta ? (
                            <div className="mt-6 flex flex-wrap gap-3">
                              {slide.cta.map((btn, j) => (
                                <Link
                                  key={j}
                                  href={btn.href}
                                  className={`${btn.variant === "outline" ? "border border-ink/30 bg-white text-ink" : "bg-accent text-white"} rounded-sm px-5 py-2 hover:opacity-95`}
                                >
                                  {btn.label}
                                </Link>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">{t(locale, "hero.noSlides")}</div>
        )}
      </div>

      {/* Controls */}
      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={() => go(idx - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-sm bg-white/80 text-ink p-2 hover:bg-white"
            aria-label={t(locale, "hero.prevSlide")}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={() => go(idx + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm bg-white/80 text-ink p-2 hover:bg-white"
            aria-label={t(locale, "hero.nextSlide")}
          >
            <ChevronRight />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {safeSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                className={`h-2 w-2 rounded-full ${i === activeIndex ? "bg-white" : "bg-white/50"}`}
                aria-label={t(locale, "hero.goToSlide").replace("{n}", String(i + 1))}
              />)
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
