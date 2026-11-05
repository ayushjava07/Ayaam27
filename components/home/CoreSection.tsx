import { Wordmark } from "@/components/brand/Wordmark";
import { SectionRule } from "@/components/ui/SectionRule";
import { site } from "@/content/site";
import { Reveal } from "./Reveal";
import { SpotlightPoster } from "./SpotlightPoster";
import { homeCopy } from "./copy";
import styles from "./CoreSection.module.css";

/** The phrase that renders as outlined type, echoing the poster numerals. */
const OUTLINE_PHRASE = "and innovation";

/**
 * Section 02 — static. The text column slides in from the left and the
 * Spotlight poster from the right, once, when the section enters view.
 * The wordmark answers the pointer like the poster's theatrical light.
 * DOM (= mobile) order: heading → statement → poster.
 */
export function CoreSection() {
  /* Keep the statement single-sourced in copy.ts; only its middle phrase is
     restyled, so the wording is never duplicated in two places. */
  const at = homeCopy.statement.indexOf(OUTLINE_PHRASE);
  const before = at >= 0 ? homeCopy.statement.slice(0, at) : homeCopy.statement;
  const after = at >= 0 ? homeCopy.statement.slice(at + OUTLINE_PHRASE.length) : "";

  return (
    <section id="core" className={styles.core} aria-labelledby="core-title">
      <SectionRule index="02" className={styles.rail} />

      <div className={styles.frame}>
        <Reveal from="left" className={styles.text}>
          <h2 id="core-title" className={styles.title}>
            <span className="visually-hidden">{site.name}</span>
            <Wordmark
              variant="chrome"
              alt=""
              sizes="(max-width: 767px) 80vw, 40vw"
              className={styles.titleMark}
              sheen
              light
            />
          </h2>

          <div className={styles.line}>
            <p className={styles.eyebrow}>{homeCopy.eyebrow}</p>
            <p className={styles.statement}>
              {before}
              <span className={styles.outline}>{OUTLINE_PHRASE}</span>
              {after}
            </p>
          </div>
        </Reveal>

        <Reveal from="right" delay={0.15} className={styles.posterCell}>
          <SpotlightPoster className={styles.poster} />
        </Reveal>
      </div>
    </section>
  );
}
