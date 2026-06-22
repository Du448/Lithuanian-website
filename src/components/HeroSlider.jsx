"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, t } from "@/lib/i18n";

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function HeroSlider({ slides }) {
  const locale = getLocaleFromPathname(usePathname());
  const safeSlides = Array.isArray(slides) && slides.length > 0 ? slides : [];
  const count = safeSlides.length;

  const rootRef = useRef(null);
  const slideRefs = useRef([]);
  const splitRef = useRef(null);
  const animatingRef = useRef(false);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [gsapLib, setGsapLib] = useState(null);

  // Lazy-load GSAP and plugins on the client
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        const { SplitText } = await import("gsap/SplitText");
        if (mounted) {
          gsap.registerPlugin(ScrollTrigger, SplitText);
          setGsapLib(gsap);
        }
      } catch {
        // If GSAP fails to load, slider still functions without animations
        setGsapLib(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const animateContentIn = useCallback((slideEl, delay = 0) => {
    if (!gsapLib) return null;
    const img = slideEl.querySelector("[data-hero-img]");
    const card = slideEl.querySelector("[data-hero-card]");
    const titleEl = slideEl.querySelector("[data-hero-title]");
    const els = slideEl.querySelectorAll("[data-hero-el]");
    const tl = gsapLib.timeline({ delay, defaults: { ease: "power3.out" } });

    if (img) tl.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 2.4, ease: "power2.out" }, 0);
    if (card) tl.fromTo(card, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, 0.15);
    if (titleEl) {
      if (splitRef.current?.revert) {
        splitRef.current.revert();
        splitRef.current = null;
      }
      try {
        // SplitText is registered on gsapLib
        const split = gsapLib.plugins?.SplitText?.create
          ? gsapLib.plugins.SplitText.create(titleEl, { type: "lines", mask: "lines" })
          : null;
        if (split) {
          splitRef.current = split;
          tl.from(split.lines, { yPercent: 110, duration: 0.85, stagger: 0.1 }, 0.3);
        } else {
          tl.fromTo(titleEl, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, 0.3);
        }
      } catch {
        tl.fromTo(titleEl, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, 0.3);
      }
    }
    if (els.length) tl.fromTo(els, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.09 }, 0.45);
    return tl;
  }, [gsapLib]);

  // Initialize slide state and parallax when GSAP is available
  useEffect(() => {
    if (!count) return;
    // Set initial visibility without gsap as well
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = i === 0 ? 1 : 0;
      el.style.zIndex = i === 0 ? 1 : 0;
    });

    if (!gsapLib || prefersReduced()) return;

    if (slideRefs.current[0]) animateContentIn(slideRefs.current[0], 0.15);

    const imgs = rootRef.current?.querySelectorAll("[data-hero-img]");
    if (imgs?.length) {
      gsapLib.to(imgs, {
        yPercent: 5,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }, [count, gsapLib, animateContentIn]);

  const goTo = useCallback((rawNext) => {
    if (!count || animatingRef.current) return;
    const next = ((rawNext % count) + count) % count;
    const cur = activeRef.current;
    if (next === cur) return;
    const curEl = slideRefs.current[cur];
    const nextEl = slideRefs.current[next];
    if (!curEl || !nextEl) return;

    activeRef.current = next;
    setActive(next);

    if (prefersReduced() || !gsapLib) {
      curEl.style.opacity = 0;
      curEl.style.zIndex = 0;
      nextEl.style.opacity = 1;
      nextEl.style.zIndex = 1;
      return;
    }

    animatingRef.current = true;
    gsapLib.set(nextEl, { zIndex: 2 });
    gsapLib.set(curEl, { zIndex: 1 });

    const tl = gsapLib.timeline({
      onComplete: () => {
        gsapLib.set(curEl, { autoAlpha: 0, zIndex: 0 });
        gsapLib.set(nextEl, { zIndex: 1 });
        animatingRef.current = false;
      },
    });
    tl.fromTo(nextEl, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.85, ease: "power2.inOut" }, 0);
    tl.add(animateContentIn(nextEl), 0.1);
  }, [count, gsapLib, animateContentIn]);

  useEffect(() => {
    if (count < 2 || paused) return;
    const id = setInterval(() => goTo(activeRef.current + 1), 6000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, paused]);

  const onKey = (e) => {
    if (e.key === "ArrowLeft") goTo(activeRef.current - 1);
    if (e.key === "ArrowRight") goTo(activeRef.current + 1);
  };

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={onKey}
      tabIndex={0}
      aria-label={t(locale, "hero.carouselLabel")}
    >
      <div className="relative h-[80vh] lg:h-screen bg-[--color-soft]">
        {count ? (
          safeSlides.map((slide, i) => (
            <div
              key={i}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className="absolute inset-0"
              style={{ opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 1 : 0 }}
              aria-hidden={i !== active}
            >
              <div data-hero-img className="absolute inset-x-0 -inset-y-[6%] will-change-transform">
                <Image
                  src={slide.image}
                  alt={slide.title || t(locale, "hero.imageAlt")}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center">
                <div className="container">
                  <div className="px-6 sm:px-10 max-w-3xl">
                    <div
                      data-hero-card
                      className="rounded-sm border border-white/60 bg-white/85 backdrop-blur-sm p-5 sm:p-7 shadow-sm"
                    >
                      {slide.kicker ? (
                        <div data-hero-el className="text-muted text-sm uppercase tracking-wide mb-2">{slide.kicker}</div>
                      ) : null}
                      {slide.title ? (
                        i === 0 ? (
                          <h1 data-hero-title className="text-ink text-3xl sm:text-5xl font-semibold leading-tight">{slide.title}</h1>
                        ) : (
                          <p data-hero-title className="text-ink text-3xl sm:text-5xl font-semibold leading-tight">{slide.title}</p>
                        )
                      ) : null}
                      {slide.subtitle ? (
                        <p data-hero-el className="mt-3 text-ink/80 text-base sm:text-lg">{slide.subtitle}</p>
                      ) : null}
                      {slide.cta ? (
                        <div data-hero-el className="mt-6 flex flex-wrap gap-3">
                          {slide.cta.map((btn, j) => (
                            <Link
                              key={j}
                              href={btn.href}
                              tabIndex={i === active ? 0 : -1}
                              className={`${btn.variant === "outline" ? "border border-ink/30 bg-white text-ink" : "bg-accent text-white hover:bg-accent-dark"} rounded-sm px-5 py-2.5 transition-[background-color,transform] duration-300 hover:-translate-y-0.5 active:translate-y-0`}
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
            </div>
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">{t(locale, "hero.noSlides")}</div>
        )}
      </div>

      {/* Controls */}
      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goTo(activeRef.current - 1)}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-sm bg-white/80 text-ink p-2.5 transition-[background-color,transform] duration-200 hover:bg-white hover:scale-105 active:scale-95"
            aria-label={t(locale, "hero.prevSlide")}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeRef.current + 1)}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-sm bg-white/80 text-ink p-2.5 transition-[background-color,transform] duration-200 hover:bg-white hover:scale-105 active:scale-95"
            aria-label={t(locale, "hero.nextSlide")}
          >
            <ChevronRight />
          </button>

          <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 flex items-center gap-2">
            {safeSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/75"}`}
                aria-label={t(locale, "hero.goToSlide").replace("{n}", String(i + 1))}
              />)
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
