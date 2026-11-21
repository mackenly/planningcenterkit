/**
 * The site's logo, drawn once for every place it appears: the header and the
 * docs layout (Logo.astro) and the social cards (src/pages/og/_card.ts).
 * A neutral mark of our own (four parts of a kit), deliberately unlike
 * Planning Center's branding: this project is unofficial. Keep it a
 * single-colour mark; each place fills it with its own text colour.
 */
const rect = (x: number, y: number, size: number, r: number) =>
  `M${x + r} ${y}H${x + size - r}A${r} ${r} 0 0 1 ${x + size} ${y + r}V${y + size - r}A${r} ${r} 0 0 1 ${x + size - r} ${y + size}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + size - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;

export const logo = {
  /** The drawing's box; callers size it by height and keep the ratio. */
  width: 24,
  height: 24,
  paths: [
    rect(1, 1, 10, 2.5),
    rect(13, 1, 10, 2.5),
    rect(1, 13, 10, 2.5),
    "M18 13A5 5 0 1 1 18 23A5 5 0 1 1 18 13Z",
  ],
};
