/**
 * Brand colors as literal hex strings.
 *
 * Canvas 2D APIs need real color values and can't read Tailwind classes or
 * CSS custom properties, so these mirror the palette defined in
 * `tailwind.config.ts`. Keep both in sync when the brand changes.
 */
export const BRAND_COLORS = {
  blue: "#38BDF8",
  cyan: "#06B6D4",
  purple: "#8B5CF6",
} as const;

/** Default particle palette shared by the ambient canvas layers. */
export const PARTICLE_COLORS = [
  BRAND_COLORS.blue,
  BRAND_COLORS.cyan,
  BRAND_COLORS.purple,
];
