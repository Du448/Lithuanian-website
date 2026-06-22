"use client";

import { useState } from "react";
import Image from "next/image";
import { BadgeCheck, Truck, Wrench } from "lucide-react";
import RevealGrid from "@/components/anim/RevealGrid";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

const leftImage =
  "https://images.unsplash.com/photo-1674649207083-281c2517ab49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600";
const rightImage =
  "https://images.unsplash.com/photo-1758448756207-54505680d130?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600";

const columns = [
  {
    id: "left",
    items: [
      {
        id: "experience",
        titleKey: "home.benefits.experience",
        icon: BadgeCheck,
        image: leftImage,
        imageClass: "object-[50%_34%]",
        isLarge: true,
      },
      {
        id: "installation",
        titleKey: "home.benefits.installation",
        icon: Wrench,
        image: leftImage,
        imageClass: "object-[50%_64%]",
        isLarge: false,
      },
    ],
  },
  {
    id: "right",
    items: [
      {
        id: "warranty",
        titleKey: "home.benefits.warranty",
        icon: BadgeCheck,
        image: rightImage,
        imageClass: "object-[50%_30%]",
        isLarge: false,
      },
      {
        id: "delivery",
        titleKey: "home.benefits.delivery",
        icon: Truck,
        image: rightImage,
        imageClass: "object-[50%_70%]",
        isLarge: true,
      },
    ],
  },
];

function ShowcaseCard({ locale, item, active, hasActiveSibling, onActivate, onDeactivate }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onMouseLeave={onDeactivate}
      onBlur={onDeactivate}
      aria-label={t(locale, item.titleKey)}
      aria-pressed={active}
      className={cn(
        "group relative flex min-h-[170px] w-full overflow-hidden rounded-sm border border-line text-left shadow-sm transition-[flex-grow,box-shadow,border-color] duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ink] focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:min-h-[210px] lg:min-h-0",
        active
          ? "border-[var(--color-ink)] shadow-premium"
          : "bg-white hover:shadow-[0_16px_36px_-18px_rgba(0,0,0,0.28)]",
        hasActiveSibling && !active ? "opacity-95" : "opacity-100",
        item.isLarge ? (active ? "flex-[1.6]" : "flex-[0.72]") : active ? "flex-[2.05]" : "flex-[0.38]"
      )}
    >
      <Image
        src={item.image}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className={cn(
          "object-cover grayscale transform-none transition-[filter] duration-500 ease-out",
          item.imageClass,
          active ? "grayscale-0" : "brightness-[0.72] contrast-[1.05]"
        )}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      <div className="relative z-10 flex h-full w-full items-end p-4 sm:p-5">
        <div className="max-w-[85%]">
          <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/95 backdrop-blur-[2px]">
            <Icon size={18} />
          </span>
          <div className="text-[16px] font-semibold leading-snug text-white sm:text-[18px]">
            {t(locale, item.titleKey)}
          </div>
        </div>
      </div>
    </button>
  );
}

function ShowcaseColumn({ locale, items, activeId, setActiveId }) {
  const hasActive = items.some((item) => item.id === activeId);

  return (
    <div className="flex flex-col gap-4 lg:h-[560px]">
      {items.map((item) => {
        const active = activeId === item.id;

        return (
          <ShowcaseCard
            key={item.id}
            locale={locale}
            item={item}
            active={active}
            hasActiveSibling={hasActive}
            onActivate={() => setActiveId(item.id)}
            onDeactivate={() => setActiveId(null)}
          />
        );
      })}
    </div>
  );
}

export default function HomeBenefitsShowcase({ locale }) {
  const [activeId, setActiveId] = useState(null);

  return (
    <section className="-mt-10 border-b border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,1)_100%)] sm:-mt-12 lg:-mt-16">
      <div className="container pb-6 pt-0 sm:pb-8 lg:pb-10">
        <div className="mb-4 sm:mb-5">
          <p className="text-xs uppercase tracking-[0.28em] text-muted">{t(locale, "home.benefitsShowcaseEyebrow")}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {t(locale, "home.benefitsShowcaseTitle")}
          </h2>
        </div>

        <RevealGrid className="grid gap-4 lg:grid-cols-2" revealKey="home-benefits-showcase" y={28} stagger={0.1}>
          {columns.map((column) => (
            <ShowcaseColumn
              key={column.id}
              locale={locale}
              items={column.items}
              activeId={activeId}
              setActiveId={setActiveId}
            />
          ))}
        </RevealGrid>
      </div>
    </section>
  );
}
