import { SITE, indexingAllowed } from "@/lib/site";
import type { MetadataRoute } from "next";

/**
 * Search indexing is off unless it is deliberately turned on.
 *
 * This site quotes named people and reads their published positions against
 * each other. That is legitimate research on public material, and it is
 * still not something that should surface in a search for somebody's name
 * because a stranger built a prototype about their work.
 *
 * The default is also the reversible one. Going from noindex to indexed
 * takes one environment variable and a redeploy; going the other way means
 * waiting on crawlers and caches. When the choice is between two defaults
 * and one of them is hard to undo, take the other.
 *
 * Set NEXT_PUBLIC_ALLOW_INDEXING=true to allow it.
 */
export default function robots(): MetadataRoute.Robots {
  if (!indexingAllowed) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
