/**
 * Convert a hex color to an rgba string at a given alpha.
 * Handles #rrggbb format.
 */
export function hexToRgba(hex: string, alpha: number): string {
  if (hex.startsWith('rgba')) return hex

  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
