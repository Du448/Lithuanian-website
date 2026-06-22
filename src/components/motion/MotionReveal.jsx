"use client";

import { m, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function MotionReveal({
  as: Tag = m.div,
  index = 0,
  stagger = 0.06,
  delay = 0,
  className = "",
  children,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const d = delay || index * stagger;

  return (
    <Tag
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.22, delay: d, ease: [0.2, 0.6, 0.2, 1] }}
      className={className}
    >
      {children}
    </Tag>
  );
}
