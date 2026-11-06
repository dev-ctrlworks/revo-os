import type { Metadata } from "next";
import { MarketingNavigation } from "@/components/marketing/navigation";
import {
  PricingHero,
  PricingComparison,
  IntegrationsSection,
  KnowledgeGraphSection,
  PricingFaqSection,
  PricingFinalCta,
} from "@/components/marketing/pricing";
import { MarketingFooter } from "@/components/marketing/footer";
import { ScrollProgress } from "@/components/marketing/motion";
import { jsonLdScript } from "@/lib/safe-url";
import { PLANS, PRICING_FAQS } from "@/config/pricing";

export const metadata: Metadata = {
  title: "RevoOS Pricing — Free, Plus & Pro Plans",
  description:
    "Explore RevoOS pricing plans. Start with a free personal memory library and upgrade for more storage, AI-powered recall, and advanced knowledge connections.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "RevoOS Pricing — Free, Plus & Pro Plans",
    description:
      "Start free. Compare Free, Plus, and Pro for more memories, storage, AI recall, and a connected knowledge graph.",
    url: "https://revoos.app/pricing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RevoOS Pricing — Free, Plus & Pro Plans",
    description:
      "Start free. Compare Free, Plus, and Pro for more memories, storage, AI recall, and a connected knowledge graph.",
  },
};

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      ...Object.values(PLANS).map((plan) => ({
        "@type": "Product",
        name: `Revo OS ${plan.name}`,
        description: plan.description,
        brand: { "@type": "Brand", name: "Revo OS" },
        offers: {
          "@type": "Offer",
          price: plan.monthlyPrice,
          priceCurrency: "USD",
          availability: "https://schema.org/PreOrder",
          url: "https://revoos.app/pricing",
          priceSpecification: [
            {
              "@type": "UnitPriceSpecification",
              price: plan.monthlyPrice,
              priceCurrency: "USD",
              billingDuration: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
            },
            {
              "@type": "UnitPriceSpecification",
              price: plan.annualPrice,
              priceCurrency: "USD",
              billingDuration: { "@type": "QuantitativeValue", value: 1, unitCode: "ANN" },
            },
          ],
        },
      })),
      {
        "@type": "FAQPage",
        mainEntity: PRICING_FAQS.map((faq) => ({
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
          <PricingHero />
          <PricingComparison />
          <IntegrationsSection />
          <KnowledgeGraphSection />
          <PricingFaqSection />
          <PricingFinalCta />
        </main>

        <MarketingFooter />
      </div>
    </div>
  );
}
