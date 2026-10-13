import { AuroraBackground } from "@/components/motion/aurora-background";
import { SectionHeader } from "@/components/landing/section-header";
import { Reveal } from "@/components/motion/reveal";
import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { Features } from "@/components/landing/features";
import { UseCases } from "@/components/landing/use-cases";
import { Demo } from "@/components/landing/demo";
import { Privacy } from "@/components/landing/privacy";
import { WaitlistSection } from "@/components/landing/waitlist-section";
import { Faq, faqs } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { SiteFooter } from "@/components/landing/site-footer";
import { FeedbackButton } from "@/components/feedback/feedback-button";
import { jsonLdScript } from "@/lib/safe-url";

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
          target: "https://revoos.app/search?q={query}",
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
          "A personal AI memory layer: save notes, links, and files, then ask questions and get answers with sources. Local-first.",
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
    <div className="min-h-screen overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <AuroraBackground />
      <SiteHeader />

      <main>
        <Hero />
        <Problem />
        <Features />

        <section id="use-cases" className="container mx-auto max-w-7xl px-5 py-20 sm:py-24">
          <SectionHeader
            kicker="Use cases"
            align="center"
            title="Ask across your life."
            lead="One memory layer answers work, study, travel, shopping, and everyday questions."
          />
          <Reveal className="mt-12" y={32}>
            <UseCases />
          </Reveal>
        </section>

        <Demo />
        <Privacy />
        <WaitlistSection />
        <Faq />
        <FinalCta />
      </main>

      <SiteFooter />
      <FeedbackButton />
    </div>
  );
}
