"use client";

import { usePathname } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";

export default function PageTransitionFM({ children }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.2, 0.6, 0.2, 1] }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}
