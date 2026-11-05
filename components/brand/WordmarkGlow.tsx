"use client";

import { useEffect, useRef } from "react";
import { damp } from "@/lib/touchScene";

type WordmarkGlowProps = {
  className?: string;
  children: React.ReactNode;
};

const REST = { x: 50, y: 30 };

/**
 * Bridges the server-rendered wordmark and a small pointer interaction: one
 * soft chrome light tucked inside the letterforms (masked, see
 * Wordmark.module.css) trails the cursor with the same damped easing as the
 * Spotlight poster's cone, so both halves of the section answer to the same
 * light. No pointer data is stored; it only writes two CSS variables.
 */
export function WordmarkGlow({ className, children }: WordmarkGlowProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let last = 0;
    const light = { ...REST };
    const target = { ...REST };

    const write = () => {
      el.style.setProperty("--mx", `${light.x.toFixed(2)}%`);
      el.style.setProperty("--my", `${light.y.toFixed(2)}%`);
    };
    write();

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
      last = now;
      light.x = damp(light.x, target.x, 0.14, dt);
      light.y = damp(light.y, target.y, 0.14, dt);
      write();
      const moving = Math.abs(light.x - target.x) > 0.15 || Math.abs(light.y - target.y) > 0.15;
      if (moving && !reduced.matches) raf = window.requestAnimationFrame(frame);
      else last = 0;
    };

    const kick = () => {
      if (!raf && !reduced.matches) raf = window.requestAnimationFrame(frame);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      target.x = Math.max(0, Math.min(100, ((event.clientX - r.left) / r.width) * 100));
      target.y = Math.max(0, Math.min(100, ((event.clientY - r.top) / r.height) * 100));
      if (reduced.matches) {
        light.x = target.x;
        light.y = target.y;
        write();
        return;
      }
      kick();
    };

    const onLeave = () => {
      target.x = REST.x;
      target.y = REST.y;
      if (reduced.matches) {
        light.x = REST.x;
        light.y = REST.y;
        write();
        return;
      }
      kick();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) window.cancelAnimationFrame(raf);
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    };
  }, []);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
