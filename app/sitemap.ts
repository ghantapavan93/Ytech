import { NAV_ITEMS } from "@/lib/nav-data";
import { SITE, indexingAllowed } from "@/lib/site";
import type { MetadataRoute } from "next";

/**
 * The route list, derived from the one the command palette reads.
 *
 * Writing the URLs out again would give the site two lists of its own pages,
 * and the second one would be the one nobody updates. Query strings are
 * dropped because they are entry points into a page rather than pages.
 *
 * Empty while indexing is off, so the sitemap never contradicts robots.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexingAllowed) return [];

  const paths = [...new Set(NAV_ITEMS.map((i) => i.href.split("?")[0]))];

  return paths.map((path) => ({
    url: `${SITE}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    // The run and the room are the way in; everything else supports them.
    priority: path === "/" ? 1 : path === "/room" ? 0.9 : 0.6,
  }));
}
