/**
 * HTML-escape utilities for the imperative `innerHTML` paths that still exist
 * across BookClient / CheckoutClient / ProfileClient / TrackClient.
 *
 * The long-term fix is to migrate those flows to JSX (which escapes by
 * default), but until then ANY user- or network-derived value that flows into
 * an `innerHTML` string MUST be passed through `escapeHtml` first.
 */

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

const HTML_ESCAPE_RE = /[&<>"'/`=]/g;

export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(HTML_ESCAPE_RE, (ch) => HTML_ESCAPES[ch] ?? ch);
}

/**
 * Escape a value for safe use inside an HTML attribute value.
 * Use when interpolating into `data-*="..."` or similar.
 */
export function escapeAttr(value: unknown): string {
  return escapeHtml(value);
}

/**
 * For URL-ish strings interpolated into `href` / `src` we additionally block
 * `javascript:` / `data:` / `vbscript:` schemes. Falls back to "#" if the URL
 * looks unsafe.
 */
export function safeUrl(value: unknown): string {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (/^\s*(javascript|data|vbscript):/i.test(raw)) return "#";
  return escapeAttr(raw);
}
