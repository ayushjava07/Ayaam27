"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/brand/Wordmark";
import { headerLinks, navItems, site } from "@/content/site";
import { NavigationOverlay } from "./NavigationOverlay";
import styles from "./SiteHeader.module.css";

const OVERLAY_ID = "site-navigation";
const SCROLL_THRESHOLD = 24;

const barLinks = headerLinks
  .map((href) => navItems.find((item) => item.href === href))
  .filter((item): item is (typeof navItems)[number] => item !== undefined);

export function SiteHeader() {
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  /**
   * The overlay is open only while the route it was opened on is current, so
   * any route change (link click, back/forward) closes it without an effect.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn !== null && openedOn === pathname;

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
      headerRef.current?.style.setProperty("--scroll-progress", progress.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const close = useCallback(() => setOpenedOn(null), []);

  return (
    <>
      <header
        ref={headerRef}
        className={[styles.header, scrolled ? styles.scrolled : null].filter(Boolean).join(" ")}
      >
        <span className={styles.progress} aria-hidden="true" />

        <Link href="/" className={styles.brand} aria-label={`${site.name} home`}>
          <Wordmark variant="chrome" alt="" sizes="120px" className={styles.mark} />
        </Link>

        <nav className={styles.bar} aria-label="Highlights">
          <ul className={styles.barList}>
            {barLinks.map((item) => (
              <li key={item.href} className={item.badge || item.pulse ? styles.barBadged : styles.barItem}>
                <Link
                  href={item.href}
                  className={styles.barLink}
                  aria-current={item.href === pathname ? "page" : undefined}
                >
                  {item.pulse ? <span className={styles.liveDot} aria-hidden="true" /> : null}
                  {item.label}
                  {item.badge ? (
                    <span className={styles.badge}>
                      <span className="visually-hidden">, </span>
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={triggerRef}
          type="button"
          className={styles.trigger}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls={OVERLAY_ID}
          aria-haspopup="dialog"
          onClick={() => setOpenedOn(pathname)}
        >
          <span className={styles.triggerLabel} aria-hidden="true">
            Menu
          </span>
          <span className={styles.icon} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </header>

      <NavigationOverlay
        id={OVERLAY_ID}
        open={open}
        onClose={close}
        triggerRef={triggerRef}
        headerRef={headerRef}
      />
    </>
  );
}
