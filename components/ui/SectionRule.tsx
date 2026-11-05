import styles from "./SectionRule.module.css";

type SectionRuleProps = {
  /** Two-digit section index, e.g. "02". Decorative only. */
  index: string;
  className?: string;
};

/**
 * Thin editorial rule that opens a static section: a mono index on the left,
 * a hairline fading to the right. Purely presentational, so it is hidden from
 * assistive technology (the section heading carries the meaning).
 */
export function SectionRule({ index, className }: SectionRuleProps) {
  return (
    <div className={[styles.rule, className].filter(Boolean).join(" ")} aria-hidden="true">
      <span className={styles.index}>{index}</span>
      <span className={styles.line} />
    </div>
  );
}
