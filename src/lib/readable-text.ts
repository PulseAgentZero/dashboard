const ACRONYMS = new Set([
  "api",
  "id",
  "ip",
  "url",
  "uri",
  "db",
  "sql",
  "ngn",
  "usd",
  "eur",
  "gbp",
  "ml",
]);

const TEXT_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bML model\b/gi, "Entivia"],
  [/\bfeature importances?\b/gi, "main factors"],
  [/\brejection probability\b/gi, "chance of rejection"],
  [/\bchurn probability\b/gi, "chance of leaving"],
  [/\bdrives? risk\b/gi, "raises the risk"],
];

function titleWord(word: string) {
  const lower = word.toLowerCase();
  if (ACRONYMS.has(lower)) return lower.toUpperCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function humanizeKey(key: string) {
  const cleaned = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return key;

  return cleaned
    .split(" ")
    .map(titleWord)
    .join(" ")
    .replace(/\bNGN\b/g, "(NGN)")
    .replace(/\bUSD\b/g, "(USD)")
    .replace(/\bEUR\b/g, "(EUR)")
    .replace(/\bGBP\b/g, "(GBP)");
}

export function humanizeRecommendationType(type: string | null) {
  if (!type) return "Recommendation";
  return humanizeKey(type);
}

export function humanizeStatus(status: string | null | undefined) {
  if (status === "actioned") return "Done";
  if (status === "open") return "Open";
  if (status === "dismissed") return "Dismissed";
  if (status === "escalated") return "Escalated";
  if (!status) return "Unknown";
  return humanizeKey(status);
}

export function humanizeGeneratedText(text: string | null | undefined) {
  if (!text) return "";

  let readable = text.replace(
    /\b([a-z][a-z0-9]*(?:_[a-z0-9]+)+)\s*\(\d+(?:\.\d+)?%\s+importance\)/gi,
    (_match, key: string) => humanizeKey(key),
  );

  readable = readable.replace(
    /\b([a-z][a-z0-9]*(?:_[a-z0-9]+)+)\b/gi,
    (_match, key: string) => humanizeKey(key),
  );

  for (const [pattern, replacement] of TEXT_REPLACEMENTS) {
    readable = readable.replace(pattern, replacement);
  }

  return readable;
}

export function formatProfileValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return humanizeGeneratedText(value);
  if (typeof value === "number") return Number.isInteger(value) ? value.toLocaleString() : value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.map(formatProfileValue).filter(Boolean).join(", ");
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(([, v]) => v != null);
    if (entries.length === 0) return "";
    return entries.map(([key, v]) => `${humanizeKey(key)}: ${formatProfileValue(v)}`).join("; ");
  }
  return String(value);
}
