import type { Metadata } from "next";
import { MarketingNavigation } from "@/components/marketing/navigation";
import {
  ProductOverviewHero,
  WhatItIsSection,
  CapabilitiesSection,
  OverviewHowItWorks,
  OverviewDifferentiation,
  OverviewFaqSection,
} from "@/components/marketing/product-overview";
import { FinalCTA } from "@/components/marketing/final-cta";
import { MarketingFooter } from "@/components/marketing/footer";
import { ScrollProgress } from "@/components/marketing/motion";
import { overviewFaqs } from "@/components/marketing/content";
import { jsonLdScript } from "@/lib/safe-url";

export const metadata: Metadata = {
  title: "Overview",
  description:
    "What Revo OS is: a personal AI memory layer that captures notes, links, screenshots, and files in one place, then answers your questions with sources.",
  alternates: { canonical: "/product/overview" },
  openGraph: {
    title: "Revo OS — product overview",
    description:
      "Capture anything, keep the context, and recall it by asking in plain language. An overview of how Revo OS works.",
    url: "https://revoos.app/product/overview",
  },
};

export default function ProductOverviewPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Revo OS",
        url: "https://revoos.app/product/overview",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description:
          "A personal AI memory layer: save notes, links, and files, then ask questions and get answers with sources.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: overviewFaqs.map((faq) => ({
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
          <ProductOverviewHero />
          <WhatItIsSection />
          <CapabilitiesSection />
          <OverviewHowItWorks />
          <OverviewDifferentiation />
          <OverviewFaqSection />
          <FinalCTA />
        </main>

        <MarketingFooter />
      </div>
    </div>
  );
}
