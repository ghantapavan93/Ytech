/**
 * The palette the diagrams draw in.
 *
 * Same tokens as the rest of the site, as hex numbers because three.js wants
 * them that way. A state means the same thing in a scene as it does in a
 * card, so a reader never has to learn a second colour language.
 */
export const DIAGRAM_COLOR = {
  canvas: 0x090a0f,
  surface: 0x12141c,
  line: 0x2a2d38,
  lineStrong: 0x3f4350,
  ok: 0x10b981,
  warn: 0xf59e0b,
  crit: 0xf43f5e,
  live: 0x06b6d4,
  claim: 0xcdf94a,
  zinc300: 0xd4d4d8,
  zinc500: 0x71717a,
  zinc700: 0x3f3f46,
} as const;

export type DiagramColorKey = keyof typeof DIAGRAM_COLOR;
