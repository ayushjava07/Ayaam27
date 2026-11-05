import Image from "next/image";
import styles from "./Wordmark.module.css";
import { WordmarkGlow } from "./WordmarkGlow";
import wordmark from "@/public/images/brand/aayam-wordmark@2x.webp";

type WordmarkProps = {
  /**
   * molten — original red/magenta/orange/gold artwork (hero, footers)
   * chrome — same artwork rendered as liquid silver (secondary placements)
   */
  variant?: "molten" | "chrome";
  /** Load eagerly with high priority (use only for the above-the-fold hero). */
  priority?: boolean;
  /** Responsive `sizes` hint for next/image. */
  sizes?: string;
  className?: string;
  /** Pass "" when an adjacent text label already names the fest. */
  alt?: string;
  /** A chromium sweep crosses the letters on hover (CSS only). */
  sheen?: boolean;
  /** A light tucked inside the letters follows the pointer (small client JS). */
  light?: boolean;
};

/**
 * The AAYAM wordmark is artwork, never typed text. To swap in an official
 * asset, replace /public/images/brand/aayam-wordmark@2x.webp (transparent
 * background, ~1700px wide) — see README "Updating the wordmark".
 */
export function Wordmark({
  variant = "molten",
  priority = false,
  sizes = "(max-width: 768px) 90vw, 60vw",
  className,
  alt = "AAYAM",
  sheen = false,
  light = false,
}: WordmarkProps) {
  const root = [styles.root, styles[variant], className].filter(Boolean).join(" ");

  const inner = (
    <>
      <Image
        src={wordmark}
        alt={alt}
        priority={priority}
        sizes={sizes}
        className={styles.img}
        draggable={false}
      />
      {sheen ? <span className={styles.sheen} aria-hidden="true" /> : null}
      {light ? <span className={styles.glow} aria-hidden="true" /> : null}
    </>
  );

  if (light) {
    return <WordmarkGlow className={root}>{inner}</WordmarkGlow>;
  }

  return <span className={root}>{inner}</span>;
}
