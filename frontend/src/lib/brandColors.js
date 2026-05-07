/**
 * Canonical AURUM gold — keep in sync with `@theme --color-primary` in `index.css`
 * (`--color-primary: 40 60% 50%` → #cc9933).
 */
export const PRIMARY_HEX = '#cc9933';

/** Same hue family for Three.js lights / small highlights */
export const PRIMARY_INT = 0xcc9933;
export const PRIMARY_SATELLITE_INT = 0xd0a44e;
export const PRIMARY_KEYLIGHT_INT = 0xd3b069;

export const PRIMARY_HSL = 'hsl(40 60% 50%)';

/** Matches `--color-foreground: 40 20% 95%` */
export const FOREGROUND_HSL = 'hsl(40 20% 95%)';

const R = 0xcc;
const G = 0x99;
const B = 0x33;

export function primaryRgba(alpha) {
  return `rgba(${R},${G},${B},${alpha})`;
}
