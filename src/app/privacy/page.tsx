import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Revo OS, a Ctrl Works product, collects, uses, and protects your information.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "October 9, 2026";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated={UPDATED}>
      <LegalSection heading="Who we are">
        <p>
          Revo OS is a product operated by <strong>Ctrl Works</strong>{" "}
          (&ldquo;we&rdquo;, &ldquo;us&rdquo;). This policy explains what we
          collect when you use Revo OS at{" "}
          <a href="https://revoos.app">revoos.app</a>, why we
          collect it, and the choices you have. For any privacy question or
          request, contact{" "}
          <a href="mailto:hello@revoos.app">hello@revoos.app</a>.
        </p>
        <p>
          Revo OS is intended for people aged 16 and over and is not directed at
          children.
        </p>
      </LegalSection>

      <LegalSection heading="The short version">
        <ul>
          <li>
            Your captured memories, notes, links, and uploads are stored on your
            behalf in our database (Supabase), scoped to your account with
            row-level security. Only you can access what you save.
          </li>
          <li>
            When you use an AI feature, your question and the relevant memory
            snippets are sent to our AI provider (OpenAI) to generate an answer.
          </li>
          <li>
            We receive your email when you create an account.
          </li>
          <li>
            We use privacy-friendly analytics. Cloudflare Web Analytics runs
            cookieless; PostHog (which uses cookies) runs only if you accept the
            cookie banner. We do not sell your data and we do not run
            advertising.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="Information we collect">
        <ul>
          <li>
            <strong>Account details.</strong> When you create an account, we
            store your email address and authentication details, and any profile
            information you provide, so we can operate your account. Stored in
            our database (Supabase).
          </li>
          <li>
            <strong>Your memories and uploads.</strong> The notes, links,
            screenshots, files, collections, and other content you save are
            stored in our database and file storage (Supabase), scoped to your
            account so only you can access them.
          </li>
          <li>
            <strong>AI requests.</strong> When you ask a question, the text of
            your question and the memory snippets selected as relevant (titles,
            content, collection, date, source, and tags) are sent to OpenAI to
            produce the answer. We do not use this to train our own models, and
            OpenAI&rsquo;s API terms do not permit using API data to train their
            models.
          </li>
          <li>
            <strong>Usage analytics.</strong> We use Cloudflare Web Analytics,
            which is cookieless and does not fingerprint or track you across
            sites, and it reports aggregate page views and performance. If you
            accept the cookie banner, we also use PostHog, which sets cookies
            and a pseudonymous identifier to measure how the product is used
            (pages viewed, clicks, sessions). Rejecting analytics leaves
            PostHog disabled. We also record product events such as
            &ldquo;memories created&rdquo; or &ldquo;question asked&rdquo;
            server-side; these never include the content of your questions or
            emails.
          </li>
          <li>
            <strong>Technical and log data.</strong> Our hosting provider
            processes request data (such as IP address and user agent) to
            deliver the site, prevent abuse, and rate-limit requests. Error logs
            may be retained briefly for debugging.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="How we use information">
        <ul>
          <li>To operate, secure, and rate-limit Revo OS.</li>
          <li>To store and retrieve the content you save.</li>
          <li>To generate AI answers you ask for.</li>
          <li>To understand aggregate usage and improve the product.</li>
          <li>To comply with legal obligations.</li>
        </ul>
        <p>
          We do not sell your personal information, and we do not use it for
          advertising.
        </p>
      </LegalSection>

      <LegalSection heading="Legal bases (UK/EU GDPR)">
        <p>
          Where GDPR applies, we process personal data on these bases:
          our <strong>legitimate interests</strong> in operating and securing
          Revo OS and improving the product; your <strong>consent</strong> when
          you use AI features or
          accept analytics cookies; performance of our <strong>contract</strong>{" "}
          with you for storing your account and its content; and our{" "}
          <strong>legal obligations</strong> where they apply.
        </p>
      </LegalSection>

      <LegalSection heading="Service providers we share with">
        <p>
          We share data with the following processors strictly to run Revo OS:
        </p>
        <ul>
          <li>
            <strong>Cloudflare</strong> — hosting, CDN, security, rate limiting,
            and analytics.
          </li>
          <li>
            <strong>Supabase</strong> — account, database, and file storage for
            your memories.
          </li>
          <li>
            <strong>OpenAI</strong> — processing AI requests you make.
          </li>
          <li>
            <strong>PostHog</strong> — product analytics, only after you consent
            to analytics cookies.
          </li>
        </ul>
        <p>
          We share information when required by law or to protect rights and
          safety. We do not sell or rent personal information.
        </p>
      </LegalSection>

      <LegalSection heading="Cookies and tracking">
        <p>
          We do not set advertising or cross-site tracking cookies. Our hosting
          provider sets strictly necessary security cookies, such as{" "}
          <code>__cf_bm</code>, to distinguish humans from bots and protect the
          service. These are always on because the site cannot work safely
          without them.
        </p>
        <p>
          Analytics cookies are used only with your consent. Cloudflare Web
          Analytics is cookieless and needs no consent. PostHog sets cookies and
          a pseudonymous identifier and is enabled only if you choose{" "}
          <strong>Accept</strong> on the cookie banner. If you{" "}
          <strong>Decline</strong>, PostHog is not loaded and no analytics
          cookies are set. You can change your choice at any time via{" "}
          <strong>Cookie settings</strong> in the footer, and you can clear
          local data from <Link href="/settings">Settings</Link>.
        </p>
      </LegalSection>

      <LegalSection heading="Retention">
        <ul>
          <li>
            <strong>Account and memories:</strong> kept while your account is
            active. Delete individual memories in the product, or ask us to
            delete your account and its data.
          </li>
          <li>
            <strong>Logs:</strong> retained briefly by our providers for
            security and debugging.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="International transfers">
        <p>
          Our providers (Cloudflare, Supabase, OpenAI) may process data in the
          United States and other countries. Where required, transfers rely on
          appropriate safeguards such as the UK/EU Standard Contractual Clauses.
        </p>
      </LegalSection>

      <LegalSection heading="Your rights and choices">
        <p>
          Depending on where you live, you may have the right to access, correct,
          delete, or export your personal data, to object to or restrict certain
          processing, and to withdraw consent at any time.
        </p>
        <p>
          You can manage your account and saved memories at any time from{" "}
          <Link href="/settings">Settings</Link>, or email{" "}
          <a href="mailto:hello@revoos.app">hello@revoos.app</a> to access or
          delete your data. If you are in the UK/EU, you have the right to
          complain to your local data protection authority.
        </p>
      </LegalSection>

      <LegalSection heading="Security">
        <p>
          We use HTTPS, security headers, origin checks, row-level security, and
          rate limiting to protect Revo OS. No method of transmission or storage
          is completely secure, and Revo OS is provided without warranty.
        </p>
      </LegalSection>

      <LegalSection heading="Changes to this policy">
        <p>
          We may update this policy as Revo OS evolves. Material changes
          will be reflected by a new &ldquo;last updated&rdquo; date on this
          page.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Ctrl Works — <a href="mailto:hello@revoos.app">hello@revoos.app</a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
