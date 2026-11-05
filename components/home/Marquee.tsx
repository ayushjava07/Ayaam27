import { site } from "@/content/site";
import styles from "./Marquee.module.css";

/** Facts already published elsewhere on the site — no new copy. */
const ITEMS = [site.name, site.institute, site.dates.rangeShort, site.year];

/**
 * Each group repeats the sequence three times so it stays wider than the
 * viewport; translating by exactly half the track then never exposes a gap.
 */
const SEQUENCE = [...ITEMS, ...ITEMS, ...ITEMS];

/**
 * Closing marquee band: condensed chrome type drifting right to left.
 * Two identical groups make the loop seamless. Decorative only, so the whole
 * band is hidden from assistive technology (the footer repeats the facts).
 */
export function Marquee() {
  return (
    <div className={styles.band} aria-hidden="true">
      <div className={styles.track}>
        {[0, 1].map((copy) => (
          <ul className={styles.group} key={copy}>
            {SEQUENCE.map((item, i) => (
              <li className={styles.item} key={`${copy}-${i}`}>
                {item}
                <span className={styles.sep}>/</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
