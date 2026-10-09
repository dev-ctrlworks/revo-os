import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of Revo OS, a Ctrl Works prototype.",
  alternates: { canonical: "/terms" },
};

const UPDATED = "October 9, 2026";

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" updated={UPDATED}>
      <LegalSection heading="Agreement to these terms">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of Revo OS
          (the &ldquo;Service&rdquo;), a prototype operated by{" "}
          <strong>Ctrl Works</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;) and
          available at{" "}
          <a href="https://revoos.app">revoos.app</a>. By using
          the Service you agree to these Terms and to our{" "}
          <Link href="/privacy">Privacy Policy</Link>. If you do not agree, do
          not use the Service.
        </p>
      </LegalSection>

      <LegalSection heading="What the Service is">
        <p>
          Revo OS is an early <strong>demonstration prototype</strong> intended
          for testing and feedback. It is pre-loaded with demo content and is
          offered free of charge. Features, data, and availability may change or
          be removed at any time, and data stored locally may be lost.
        </p>
      </LegalSection>

      <LegalSection heading="Eligibility">
        <p>
          You must be at least 16 years old to use the Service. By using it you
          confirm that you meet this requirement.
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <p>You agree not to:</p>
        <ul>
          <li>use the Service for anything unlawful or harmful;</li>
          <li>
            attempt to probe, disrupt, overload, or circumvent the Service,
            including our security and rate limits;
          </li>
          <li>
            upload or submit content that infringes others&rsquo; rights or that
            you do not have the right to share;
          </li>
          <li>
            scrape, resell, or misuse the Service or access it through
            automated means other than ordinary use.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="Your content and AI output">
        <p>
          You retain ownership of the content you capture or submit. You grant
          us only the limited rights needed to operate the Service — for
          example, to store feedback you send us and to send an AI request to
          our provider when you ask a question. You are responsible for the
          content you capture and for complying with any rights that apply to
          it.
        </p>
        <p>
          AI-generated answers may be inaccurate, incomplete, or out of date.
          They are provided for informational purposes only and are not
          professional, legal, medical, or financial advice. Verify important
          information independently.
        </p>
      </LegalSection>

      <LegalSection heading="Intellectual property">
        <p>
          The Service, including the Revo OS name, logo, design, and software, is
          owned by Ctrl Works and protected by intellectual property laws. These
          Terms do not grant you any right to use our branding except as needed
          to use the Service as intended.
        </p>
      </LegalSection>

      <LegalSection heading="Disclaimer of warranties">
        <p>
          The Service is provided <strong>&ldquo;as is&rdquo;</strong> and{" "}
          <strong>&ldquo;as available&rdquo;</strong>, without warranties of any
          kind, whether express or implied, including fitness for a particular
          purpose, accuracy, and non-infringement. We do not warrant that the
          Service will be uninterrupted, error-free, or secure, or that any data
          will be preserved.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <p>
          To the fullest extent permitted by law, Ctrl Works will not be liable
          for any indirect, incidental, special, consequential, or punitive
          damages, or for any loss of data, profits, or goodwill, arising from or
          related to your use of the Service. Because the Service is provided
          free of charge as a prototype, our total liability to you is limited to
          the greater of the amount you paid us (which is zero) and the minimum
          permitted by applicable law. Nothing in these Terms excludes liability
          that cannot be excluded by law.
        </p>
      </LegalSection>

      <LegalSection heading="Changes and termination">
        <p>
          We may modify, suspend, or discontinue the Service, or update these
          Terms, at any time. Material changes will be reflected by a new{" "}
          &ldquo;last updated&rdquo; date. Continued use after changes means you
          accept the updated Terms.
        </p>
      </LegalSection>

      <LegalSection heading="Governing law">
        <p>
          These Terms are governed by the laws of{" "}
          <strong>[GOVERNING LAW / JURISDICTION]</strong>, and disputes will be
          subject to the exclusive jurisdiction of the courts of{" "}
          <strong>[JURISDICTION]</strong>. This placeholder should be completed
          by Ctrl Works with the applicable jurisdiction before public launch.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about these Terms:{" "}
          <a href="mailto:hello@revoos.app">hello@revoos.app</a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
