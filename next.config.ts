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
};

export default nextConfig;
