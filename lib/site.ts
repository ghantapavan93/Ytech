/**
 * Where the site lives, and whether crawlers may have it.
 *
 * Both were needed in more than one place — the layout's metadataBase, the
 * robots rules, the sitemap — and a hostname computed three times is a
 * hostname that eventually disagrees with itself.
 */

/**
 * Vercel supplies the production hostname, so a deployed build is correct
 * without anyone remembering to configure it. The explicit variable wins for
 * a custom domain; localhost is the honest fallback for a build that has not
 * been deployed anywhere.
 */
export const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

/** Off unless deliberately switched on. See app/robots.ts for why. */
export const indexingAllowed = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
