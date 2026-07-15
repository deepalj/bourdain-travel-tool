/**
 * Helper to calculate or estimate timezone offsets dynamically.
 * Combines a lookup table for known travel locations with a mathematical
 * estimation based on Longitude coordinates for any other spot on Earth.
 */

// Known timezone offsets for our core destinations to handle DST and political time offsets
const knownOffsets: Record<string, number> = {
  "vietnam-hanoi": 7,
  "morocco-marrakech": 1,
  "japan-tokyo": 9,
  "france-paris": 2, // CEST (UTC+2)
  "mexico-oaxaca": -6 // CST (UTC-6)
};

export function estimateTimezoneOffset(lng: number, destinationId?: string): number {
  // If we have a hardcoded match for the destination ID, use it
  if (destinationId && knownOffsets[destinationId] !== undefined) {
    return knownOffsets[destinationId];
  }

  // Otherwise, estimate mathematically based on Longitude
  // The earth has 24 timezones of 15 degrees longitude each (360 degrees total)
  // offset = longitude / 15
  return Math.round(lng / 15);
}
