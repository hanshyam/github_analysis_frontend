/** Formats large numbers the way GitHub does: 1200 -> "1.2k" */
export function formatCount(n) {
  if (n == null) return '0';
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${(n / 1_000_000).toFixed(1)}m`;
}

/** Relative time like "3 days ago" without pulling in a date library. */
export function timeAgo(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [label, secs] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value} ${label}${value > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

/** Safe JSON parse for the top_languages column (stored as JSON text or already parsed). */
export function parseLanguages(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Deterministic color per language, so bars stay visually consistent. */
const LANGUAGE_COLORS = {
  JavaScript: '#e8c547',
  TypeScript: '#3fa9f5',
  Python: '#5aa469',
  Java: '#d97757',
  Go: '#4fd1c5',
  Rust: '#e07a5f',
  Ruby: '#cf6a4c',
  HTML: '#e3634f',
  CSS: '#8a63d2',
  'C++': '#cf622e',
  C: '#6b7280',
  'C#': '#6ba53a',
  PHP: '#7b8fd6',
  Shell: '#8fa876',
  Swift: '#f08a5d',
  Kotlin: '#b892e8',
};
export function colorForLanguage(lang) {
  return LANGUAGE_COLORS[lang] || '#9a6700';
}
