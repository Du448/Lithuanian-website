"use client";

import { useId, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronDown } from "lucide-react";

export default function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [hover, setHover] = useState(false);
  const bodyRef = useRef(null);
  const iconRef = useRef(null);
  const contentId = useId();

  const toggle = () => {
    const body = bodyRef.current;
    const icon = iconRef.current;
    const next = !open;
    setOpen(next);
    if (!body) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.killTweensOf([body, icon]);

    if (reduce) {
      gsap.set(body, { height: next ? "auto" : 0, opacity: next ? 1 : 0 });
      if (icon) gsap.set(icon, { rotate: next ? 180 : 0 });
      return;
    }

    if (icon) gsap.to(icon, { rotate: next ? 180 : 0, duration: 0.35, ease: "power2.out" });

    if (next) {
      gsap.fromTo(
        body,
        { height: 0, opacity: 0, y: -6 },
        {
          height: "auto",
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power3.out",
          onComplete: () => gsap.set(body, { height: "auto" }),
        }
      );
    } else {
      gsap.to(body, { height: 0, opacity: 0, y: -6, duration: 0.35, ease: "power2.inOut" });
    }
  };

  return (
    <div className="group">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={contentId}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`relative overflow-hidden flex w-full cursor-pointer items-center justify-between gap-3 p-4 text-left text-ink transition-colors border ${open || hover ? 'bg-[--color-soft] border-[var(--color-ink)]' : 'bg-white border-transparent'} hover:bg-[--color-soft] hover:border-[var(--color-ink)]`}
      >
        <span className="relative z-10 font-medium">{title}</span>
        <span ref={iconRef} className="relative z-10 inline-flex text-muted will-change-transform" style={{ rotate: defaultOpen ? "180deg" : "0deg" }}>
          <ChevronDown size={18} />
        </span>
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-ink/5 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
      </button>
      <div
        id={contentId}
        ref={bodyRef}
        className="overflow-hidden px-4"
        style={{ height: defaultOpen ? "auto" : 0, opacity: defaultOpen ? 1 : 0 }}
      >
        <div className="pb-4 text-[15px] text-ink">{children}</div>
      </div>
    </div>
  );
}
