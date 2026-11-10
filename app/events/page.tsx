import Image, { StaticImageData } from "next/image";
import { sectionMetadata } from "@/app/_lib/sectionMetadata";
import { SiteFooter } from "@/components/shell/SiteFooter";

/* ── Static poster imports ─────────────────────────────────────────────── */
import poster1 from "./1.png";
import poster2 from "./2.png";
import poster3 from "./3.png";
import poster4 from "./4.png";
import poster5 from "./5.png";
import poster6 from "./6.png";
import poster7 from "./7.png";
import poster8 from "./8.png";
import poster9 from "./9.png";
import poster10 from "./10.png";
import poster11 from "./11.png";
import poster12 from "./12.png";
import poster13 from "./13.png";
import poster14 from "./14.png";
import poster15 from "./15.png";
import poster16 from "./16.png";
import poster17 from "./17.png";
import poster18 from "./18.png";
import poster19 from "./19.png";
import poster20 from "./20.png";
import poster22 from "./22.png";
import poster23 from "./23.png";

export const metadata = sectionMetadata({
  title: "Events",
  description: "All events at AAYAM 2026, NIT Agartala — 13, 14 & 15 November.",
  path: "/events",
});

/* ── Types ──────────────────────────────────────────────────────────────── */
interface Event {
  name: string;
  poster: StaticImageData;
  registerUrl: string;
}

interface DayGroup {
  day: string;
  date: string;
  events: Event[];
}

/* ── Event data ─────────────────────────────────────────────────────────── */
const days: DayGroup[] = [
  {
    day: "Day 1",
    date: "13 November 2026",
    events: [
      { name: "HackSphere Finale", poster: poster18, registerUrl: "#" },
      { name: "Designothon", poster: poster12, registerUrl: "#" },
      { name: "Velocity X", poster: poster2, registerUrl: "#" },
      { name: "Velocity X Robot Challenge", poster: poster15, registerUrl: "#" },
      { name: "CAD Rush", poster: poster9, registerUrl: "#" },
      { name: "Game of Codes", poster: poster4, registerUrl: "#" },
    ],
  },
  {
    day: "Day 2",
    date: "14 November 2026",
    events: [
      { name: "Technovus Hackathon", poster: poster3, registerUrl: "#" },
      { name: "Robo Expo", poster: poster1, registerUrl: "#" },
      { name: "Beyond Bits Workshop", poster: poster5, registerUrl: "#" },
      { name: "Mechanism Masters", poster: poster7, registerUrl: "#" },
      { name: "Aero Design Workshop", poster: poster8, registerUrl: "#" },
      { name: "Robo Soccer", poster: poster19, registerUrl: "#" },
      { name: "Neorothon", poster: poster20, registerUrl: "#" },
      { name: "Kickoff Protocol", poster: poster22, registerUrl: "#" },
      { name: "Case Competition", poster: poster14, registerUrl: "#" },
    ],
  },
  {
    day: "Day 3",
    date: "15 November 2026",
    events: [
      { name: "Drone League", poster: poster10, registerUrl: "#" },
      { name: "Air Show", poster: poster11, registerUrl: "#" },
      { name: "Buggy Road Show", poster: poster6, registerUrl: "#" },
      { name: "Sumo Rumble", poster: poster16, registerUrl: "#" },
      { name: "Technothon", poster: poster13, registerUrl: "#" },
      { name: "Checkmate Protocol", poster: poster23, registerUrl: "#" },
      { name: "Stargazing Event", poster: poster17, registerUrl: "#" },
    ],
  },
];

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function EventsPage() {
  return (
    <>
      <div style={styles.page}>
        {/* ── Hero header ── */}
        <header style={styles.hero}>
          <p style={styles.heroEyebrow}>NIT Agartala · Nov 13 – 15, 2026</p>
          <h1 style={styles.heroTitle}>Events</h1>

        </header>

        {/* ── Days ── */}
        <div style={styles.container}>
          {days.map((group) => (
            <section key={group.date} style={styles.daySection}>
              {/* Day label */}
              <div style={styles.dayHeader}>
                <span style={styles.dayBadge}>{group.day}</span>
                <h2 style={styles.dayDate}>{group.date}</h2>
                <div style={styles.dayRule} aria-hidden="true" />
              </div>

              {/* Event grid */}
              <div style={styles.grid}>
                {group.events.map((event) => (
                  <article key={event.name} style={styles.card}>
                    {/* Poster */}
                    <div style={styles.posterWrap}>
                      <Image
                        src={event.poster}
                        alt={`${event.name} poster`}
                        fill
                        sizes="(max-width: 480px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
                        style={{ objectFit: "cover" }}
                        placeholder="blur"
                      />
                    </div>

                    {/* Name + CTA */}
                    <div style={styles.cardBody}>
                      <h3 style={styles.cardName}>{event.name}</h3>
                      <a
                        href={event.registerUrl}
                        style={styles.registerBtn}
                        target={event.registerUrl === "#" ? undefined : "_blank"}
                        rel={event.registerUrl === "#" ? undefined : "noopener noreferrer"}
                      >
                        Register
                        <span style={styles.arrow} aria-hidden="true">→</span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <SiteFooter />
    </>
  );
}

/* ── Inline styles (zero external deps, matches site tokens) ─────────────── */
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "var(--void-black)",
    color: "var(--chrome-white)",
    fontFamily: "var(--font-sans)",
    paddingTop: "var(--header-h)",
  },

  /* Hero */
  hero: {
    textAlign: "center",
    padding: "clamp(48px, 10vw, 100px) var(--gutter) clamp(32px, 6vw, 64px)",
    borderBottom: "1px solid var(--line)",
    position: "relative",
  },
  heroEyebrow: {
    fontFamily: "var(--font-mono)",
    fontSize: "var(--fs-micro)",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "var(--steel-grey)",
    marginBottom: "12px",
  },
  heroTitle: {
    fontSize: "var(--fs-h1)",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    fontVariationSettings: `"wdth" var(--wdth-condensed)`,
    background: "linear-gradient(135deg, var(--chrome-white) 40%, var(--steel-grey))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    lineHeight: 1,
    marginBottom: "16px",
  },
  heroSub: {
    fontSize: "var(--fs-lead)",
    color: "var(--liquid-silver)",
    maxWidth: "520px",
    margin: "0 auto",
  },

  /* Layout */
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "clamp(40px, 6vw, 80px) var(--gutter)",
    display: "flex",
    flexDirection: "column",
    gap: "clamp(56px, 8vw, 96px)",
  },

  /* Day section */
  daySection: {
    display: "flex",
    flexDirection: "column",
    gap: "clamp(24px, 4vw, 40px)",
  },
  dayHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  dayBadge: {
    fontFamily: "var(--font-mono)",
    fontSize: "var(--fs-micro)",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "var(--void-black)",
    background: "var(--chrome-white)",
    padding: "4px 10px",
    borderRadius: "2px",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  dayDate: {
    fontSize: "var(--fs-h3)",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    fontVariationSettings: `"wdth" var(--wdth-condensed)`,
    whiteSpace: "nowrap",
  },
  dayRule: {
    flex: 1,
    height: "1px",
    minWidth: "40px",
    background: "var(--line)",
  },

  /* Grid */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(min(220px, 100%), 1fr))",
    gap: "clamp(16px, 2.5vw, 28px)",
  },

  /* Card */
  card: {
    display: "flex",
    flexDirection: "column",
    background: "var(--obsidian)",
    border: "1px solid var(--line)",
    borderRadius: "6px",
    overflow: "hidden",
    transition: "border-color 180ms ease, transform 180ms ease",
  },
  posterWrap: {
    position: "relative",
    aspectRatio: "3 / 4",
    overflow: "hidden",
    flexShrink: 0,
  },
  cardBody: {
    padding: "14px 16px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    flex: 1,
  },
  cardName: {
    fontSize: "var(--fs-body)",
    fontWeight: 700,
    letterSpacing: "-0.01em",
    lineHeight: 1.3,
    color: "var(--chrome-white)",
    flexGrow: 1,
  },
  registerBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    background: "transparent",
    border: "1px solid var(--line-strong)",
    borderRadius: "3px",
    color: "var(--chrome-white)",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--fs-micro)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    textDecoration: "none",
    alignSelf: "flex-start",
    transition: "background 180ms ease, border-color 180ms ease",
  },
  arrow: {
    display: "inline-block",
    transition: "transform 180ms ease",
  },
};
