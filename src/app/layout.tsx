import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import { CookieNotice } from "@/components/layout/cookie-notice";
import { PostHogAnalytics } from "@/components/analytics/posthog-analytics";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const generalSans = localFont({
  variable: "--font-general-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  src: [
    { path: "./fonts/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/GeneralSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/GeneralSans-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/GeneralSans-Bold.woff2", weight: "700", style: "normal" },
  ],
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://revoos.app"),
  title: {
    default: "Revo OS — your AI memory layer",
    template: "%s — Revo OS",
  },
  description:
    "Revo OS brings your notes, links, and files into one searchable memory, then answers questions in plain language. No folders, no filing. Just memory.",
  applicationName: "Revo OS",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "AI memory",
    "second brain",
    "personal knowledge management",
    "AI notes app",
    "memory layer",
    "local-first AI",
    "Revo OS",
  ],
  authors: [{ name: "Revo OS", url: "https://revoos.app" }],
  creator: "Revo OS",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Revo OS",
    url: "https://revoos.app",
    title: "Revo OS — your AI memory layer",
    description:
      "Capture everything. Then ask anything. Revo OS is the AI memory layer for your digital life — local-first and private.",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Revo OS — your AI memory layer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@revoos",
    title: "Revo OS — your AI memory layer",
    description:
      "Capture everything. Then ask anything. The AI memory layer for your digital life.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const analyticsToken = process.env.NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN;

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plusJakarta.variable} ${generalSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {analyticsToken && (
          <Script
            id="cf-web-analytics"
            strategy="afterInteractive"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: analyticsToken })}
          />
        )}
        <PostHogAnalytics />
        <CookieNotice />
      </body>
    </html>
  );
}