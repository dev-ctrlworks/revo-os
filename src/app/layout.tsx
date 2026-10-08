import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#f4f3fb",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://revoos.ctrlworks.co"),
  title: {
    default: "Revo OS — your AI memory layer",
    template: "%s — Revo OS",
  },
  description:
    "Revo OS quietly captures your screenshots, notes, links, and documents, then answers questions about your life in plain language. No folders. No filing. Just memory.",
  applicationName: "Revo OS",
  icons: {
    icon: "/icon.svg",
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
  authors: [{ name: "Revo OS", url: "https://revoos.ctrlworks.co" }],
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
    url: "https://revoos.ctrlworks.co",
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
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
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
      </body>
    </html>
  );
}