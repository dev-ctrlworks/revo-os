import type { Metadata } from "next";
import { MarketingNavigation } from "@/components/marketing/navigation";
import { HeroSection } from "@/components/marketing/hero";
import { ProblemSection } from "@/components/marketing/problem";
import { FeatureCarousel } from "@/components/marketing/feature-carousel";
import { HowItWorksSection } from "@/components/marketing/how-it-works";
import { LibraryShowcase } from "@/components/marketing/library-showcase";
import { CollectionSummarySection } from "@/components/marketing/collection-summary";
import { SourceMarquee } from "@/components/marketing/marquee";
import { DifferentiationSection } from "@/components/marketing/differentiation";
import { FaqSection } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { MarketingFooter } from "@/components/marketing/footer";
import { ScrollProgress } from "@/components/marketing/motion";
import { faqs } from "@/components/marketing/content";
import { jsonLdScript } from "@/lib/safe-url";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Revo OS",
        alternateName: ["Revo", "RevoOS", "revoos.app"],
        url: "https://revoos.app",
        description:
          "Revo OS is a personal AI memory. Save notes, links, and files in one place, then ask questions and get answers with sources.",
        inLanguage: "en",
        image: "https://revoos.app/og.png",
        logo: "https://revoos.app/logo.png",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://revoos.app/ask?q={query}",
          "query-input": "required name=query",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "Revo OS",
        url: "https://revoos.app",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        image: "https://revoos.app/logo.png",
        description:
          "A personal AI memory layer: save notes, links, and files, then ask questions and get answers with sources.",
      },
      {
        "@type": "Organization",
        name: "Revo OS",
        url: "https://revoos.app",
        email: "hello@revoos.app",
        logo: {
          "@type": "ImageObject",
          url: "https://revoos.app/logo.png",
          width: 512,
          height: 512,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
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
          <HeroSection />
          <ProblemSection />
          <FeatureCarousel />
          <HowItWorksSection />
          <LibraryShowcase />
          <CollectionSummarySection />
          <SourceMarquee />
          <DifferentiationSection />
          <FaqSection />
          <FinalCTA />
        </main>

        <MarketingFooter />
      </div>
    </div>
  );
}
