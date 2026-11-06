import type { Metadata } from "next";
import { MarketingNavigation } from "@/components/marketing/navigation";
import {
  DownloadHero,
  DownloadExtensionSection,
  StepsSection,
  FuturePlatformsSection,
  DownloadFaqSection,
} from "@/components/marketing/download";
import { FinalCTA } from "@/components/marketing/final-cta";
import { MarketingFooter } from "@/components/marketing/footer";
import { ScrollProgress } from "@/components/marketing/motion";
import { downloadFaqs, extensionStores } from "@/components/marketing/content";
import { jsonLdScript } from "@/lib/safe-url";

export const metadata: Metadata = {
  title: "Download",
  description:
    "Download the Revo OS browser extension for Chrome to save pages with screenshots and context. Available on Plus and Pro. Mobile and desktop apps are coming soon.",
  alternates: { canonical: "/download" },
  openGraph: {
    title: "Download Revo OS",
    description:
      "The Revo OS browser extension saves any page with screenshots and context in one click. Add it to Chrome. Available on Plus and Pro.",
    url: "https://revoos.app/download",
  },
};

export default function DownloadPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Revo OS Browser Extension",
        url: "https://revoos.app/download",
        applicationCategory: "BrowserApplication",
        operatingSystem: "Chrome",
        description:
          "A browser extension that saves the page you're on to Revo OS, with its title, URL, selection, screenshot, and context, so you can find and ask about it later. Available on Plus and Pro.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        downloadUrl: extensionStores.chrome,
      },
      {
        "@type": "FAQPage",
        mainEntity: downloadFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />

      <div className="relative isolate flex min-h-screen flex-col">
        <MarketingNavigation />
        <ScrollProgress />

        <main id="main" className="relative z-0 flex-1">
          <DownloadHero />
          <DownloadExtensionSection />
          <StepsSection />
          <FuturePlatformsSection />
          <DownloadFaqSection />
          <FinalCTA />
        </main>

        <MarketingFooter />
      </div>
    </div>
  );
}
