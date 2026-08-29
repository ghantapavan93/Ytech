import { ImageResponse } from "next/og";

/**
 * The tab icon: a load that stops before it reaches the bottom.
 *
 * The bright bar is released capacity entering the structure, the gap is the
 * gate that does not pass it, and the dim stub is what actually reaches
 * business value. It is the site's one argument at sixteen pixels, and it
 * reads as a mark rather than as a picture, which is the only thing a favicon
 * can afford to be.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 5,
          background: "#090a0f",
          padding: "4px 0",
        }}
      >
        <div style={{ width: 10, height: 15, background: "#cdf94a", borderRadius: 2 }} />
        <div style={{ width: 10, height: 4, background: "#52525b", borderRadius: 2 }} />
      </div>
    ),
    size,
  );
}
