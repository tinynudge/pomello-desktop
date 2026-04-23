/**
 * Parses a human-entered duration string into total seconds.
 *
 * Supported formats:
 * - Unit-based: "1h 23m", "1h23m", "1hr 23min", "1 hour 23 minutes", "400s", "400 seconds"
 * - Colon-delimited: "1:23" (H:MM), "1:23:00" (H:MM:SS), "0:23"
 * - Decimal hours: "1.5h", "1,5h"
 * - Decimal minutes: "1.5m", "1,5m"
 * - Plain number: "83" (interpreted as minutes)
 *
 * Returns total seconds as an integer, or null if unparseable.
 */
export const parseDuration = (input: string): number | null => {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  const normalized = trimmed.toLowerCase();

  // Try each parser in order of specificity
  return (
    parseColonFormat(normalized) ??
    parseUnitFormat(normalized) ??
    parseDecimalUnit(normalized) ??
    parsePlainNumber(normalized)
  );
};

/**
 * Formats a duration in seconds to the canonical display format.
 *
 * Seconds are included only when non-zero.
 *
 * Examples:
 * - 4980 → "1h 23m"
 * - 4985 → "1h 23m 5s"
 * - 3600 → "1h"
 * - 1800 → "30m"
 * - 0 → "0m"
 * - 45 → "45s"
 */
export const formatDuration = (totalSeconds: number): string => {
  if (totalSeconds === 0) {
    return '0m';
  }

  const isNegative = totalSeconds < 0;
  const absoluteSeconds = Math.abs(totalSeconds);
  const hours = Math.floor(absoluteSeconds / 3600);
  const minutes = Math.floor((absoluteSeconds % 3600) / 60);
  const seconds = absoluteSeconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }

  if (seconds > 0) {
    parts.push(`${seconds}s`);
  }

  let formattedDuration = parts.length > 0 ? parts.join(' ') : '0m';

  if (isNegative) {
    formattedDuration = `-${formattedDuration}`;
  }

  return formattedDuration;
};

// H:MM or H:MM:SS
const parseColonFormat = (input: string): number | null => {
  const match = input.match(/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/);

  if (!match) {
    return null;
  }

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = match[3] ? parseInt(match[3], 10) : 0;

  if (minutes > 59 || seconds > 59) {
    return null;
  }

  const total = hours * 3600 + minutes * 60 + seconds;

  return total >= 0 ? total : null;
};

// Matches combinations of hours, minutes, and seconds with unit labels.
// e.g. "1h 23m", "1 hour 23 minutes", "1hr 23min", "400s", "400 seconds"
const parseUnitFormat = (input: string): number | null => {
  const hourPattern = /(\d+)\s*(?:hours?|hrs?|h)(?=\s|$|\d)/;
  const minutePattern = /(\d+)\s*(?:minutes?|mins?|m)(?=\s|$|\d)/;
  const secondPattern = /(\d+)\s*(?:seconds?|secs?|s)(?=\s|$|\d)/;

  const hourMatch = input.match(hourPattern);
  const minuteMatch = input.match(minutePattern);
  const secondMatch = input.match(secondPattern);

  if (!hourMatch && !minuteMatch && !secondMatch) {
    return null;
  }

  // Verify the entire input is consumed by the matched units and whitespace.
  // Build what we expect the input to look like and compare.
  let remaining = input;

  if (hourMatch) {
    remaining = remaining.replace(hourMatch[0], '');
  }

  if (minuteMatch) {
    remaining = remaining.replace(minuteMatch[0], '');
  }

  if (secondMatch) {
    remaining = remaining.replace(secondMatch[0], '');
  }

  if (remaining.trim() !== '') {
    return null;
  }

  const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
  const seconds = secondMatch ? parseInt(secondMatch[1], 10) : 0;

  return hours * 3600 + minutes * 60 + seconds;
};

// Decimal hours or minutes: "1.5h", "1,5h", "0.5m", "1,5m"
const parseDecimalUnit = (input: string): number | null => {
  const match = input.match(/^(\d+[.,]\d+)\s*(?:(hours?|hrs?|h)|(minutes?|mins?|m))\s*$/);

  if (!match) {
    return null;
  }

  const value = parseFloat(match[1].replace(',', '.'));

  if (isNaN(value) || value < 0) {
    return null;
  }

  // match[2] is hours group, match[3] is minutes group
  if (match[2]) {
    return Math.round(value * 3600);
  }

  return Math.round(value * 60);
};

// Plain number interpreted as minutes
const parsePlainNumber = (input: string): number | null => {
  const match = input.match(/^(\d+(?:[.,]\d+)?)\s*$/);

  if (!match) {
    return null;
  }

  const value = parseFloat(match[1].replace(',', '.'));

  if (isNaN(value) || value < 0) {
    return null;
  }

  return Math.round(value * 60);
};
