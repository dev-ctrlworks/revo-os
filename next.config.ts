import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://static.cloudflareinsights.com https://*.posthog.com`,
  `connect-src 'self' https://cloudflareinsights.com https://*.posthog.com${isDev ? " ws: wss:" : ""}`,
  "worker-src 'self' blob: data:",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  poweredByHeader: false,
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "www.revoos.app" }],
        destination: "https://revoos.app/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.revoos.app" }],
        destination: "https://revoos.app/:path*",
        permanent: true,
      },
      {
        source: "/",
        has: [{ type: "host", value: "revoos.ctrlworks.co" }],
        destination: "https://revoos.app/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "revoos.ctrlworks.co" }],
        destination: "https://revoos.app/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/api/(.*)",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
