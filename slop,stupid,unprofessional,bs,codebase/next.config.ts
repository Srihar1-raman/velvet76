import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * The current codebase still ships imperative `innerHTML` strings with inline
 * `onclick=` handlers (see BookClient / CheckoutClient / ProfileClient). Until
 * those are migrated to JSX + event listeners, we have to keep
 * `'unsafe-inline'` for `script-src` and `style-src`. Everything else is
 * tightened so XSS payloads can no longer call out to attacker-controlled
 * origins or load external resources.
 *
 * TODO(security): once inline handlers are removed, switch to nonce-based
 * script-src and drop `'unsafe-inline'`.
 */
const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isDev ? ["'unsafe-eval'"] : []),
  "https://maps.googleapis.com",
  "https://maps.gstatic.com",
  "https://*.googleapis.com",
].join(" ");

const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://maps.gstatic.com https://maps.googleapis.com https://maps.google.com https://*.googleapis.com https://*.ggpht.com https://*.gstatic.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://maps.googleapis.com https://maps.gstatic.com https://places.googleapis.com https://*.googleapis.com",
  "media-src 'self' blob:",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
