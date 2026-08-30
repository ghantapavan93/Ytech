import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * `next build` and `next dev` write to the same directory by default, and
   * on this machine that directory is a junction outside OneDrive. Building
   * while a dev server is running left dev with a half-overwritten
   * incremental cache, which surfaced as phantom module-not-found errors for
   * files that were present on disk the whole time.
   *
   * The build now gets its own directory, so the two never touch.
   */
  distDir: process.env.NEXT_DIST_DIR ?? ".next",

  // The run used to live at /run before it became the landing page. Anyone
  // holding that link still lands in the right place.
  async redirects() {
    return [{ source: "/run", destination: "/", permanent: true }];
  },

  /**
   * Response headers, because the first thing a security-minded reader does
   * is look at them and the platform only supplies HSTS.
   *
   * The content policy is deliberate about one weakness. Next inlines its
   * bootstrap script, so a policy without `unsafe-inline` on script-src
   * needs a per-request nonce, which needs middleware, which makes every
   * route dynamic. Trading twenty-three prerendered pages for a slightly
   * stricter directive is the wrong trade for a static site, so the
   * allowance stays and is written down here rather than left to be
   * discovered. Everything that can be locked down without that cost is:
   * no framing, no plugins, no arbitrary base href, forms only to self.
   */
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
