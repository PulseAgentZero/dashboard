/** Grafana-style dashboard auto-refresh intervals (seconds). null = off. */

export const REFRESH_INTERVAL_OPTIONS: { label: string; seconds: number | null }[] = [
  { label: "Off", seconds: null },
  { label: "5s", seconds: 5 },
  { label: "10s", seconds: 10 },
  { label: "30s", seconds: 30 },
  { label: "1m", seconds: 60 },
  { label: "5m", seconds: 300 },
  { label: "15m", seconds: 900 },
  { label: "30m", seconds: 1800 },
  { label: "1h", seconds: 3600 },
];

/** Minimum refresh for public embeds (rate limits). */
export const EMBED_MIN_REFRESH_SECONDS = 30;

export function clampEmbedRefresh(seconds: number | null): number | null {
  if (seconds == null) return null;
  if (seconds < EMBED_MIN_REFRESH_SECONDS) return EMBED_MIN_REFRESH_SECONDS;
  return seconds;
}
