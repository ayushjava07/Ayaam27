import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { OG_IMAGE } from "@/app/_lib/sectionMetadata";
import { site } from "@/content/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} ${site.year} · ${site.institute}`,
    template: `%s · ${site.name} ${site.year}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} ${site.year} · ${site.institute}`,
    description: site.description,
    url: "/",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} ${site.year} · ${site.institute}`,
    description: site.description,
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: "#050608",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const NO_JS_REVEAL =
  "[data-reveal]{opacity:1!important;transform:none!important}" +
  "[data-touch-scene]{--hero-t:1!important;height:100svh!important}";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrains.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="preload" as="image" href="/cursors/league-of-legends-sword.webp" />
        <noscript>
          <style>{NO_JS_REVEAL}</style>
        </noscript>
      </head>
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  );
}