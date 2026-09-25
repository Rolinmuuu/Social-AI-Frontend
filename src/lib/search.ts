import { SEARCH_KEY } from "../constants";
import type { SearchKeyType } from "../constants";

export interface SearchOption {
  type: SearchKeyType;
  keywords: string;
}

// Maps the search mode to the backend's /search query parameters.
export function buildSearchUrl(base: string, { type, keywords }: SearchOption): string {
  const url = `${base}/search`;
  const q = encodeURIComponent(keywords);
  if (!keywords) return url;
  if (type === SEARCH_KEY.keywords) return `${url}?keywords=${q}`;
  if (type === SEARCH_KEY.user) return `${url}?user_id=${q}`;
  if (type === SEARCH_KEY.semantic) return `${url}?mode=semantic&keywords=${q}`;
  return url;
}

export const authHeaders = (token: string | null) => ({ Authorization: `Bearer ${token}` });

// Two-letter initials for avatar placeholders.
export function initials(name: string): string {
  const parts = name.replace(/[_.-]+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const letters = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[1][0];
  return letters.toUpperCase();
}

// Stable hue per user so avatars keep their colour between renders.
export function hueFor(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}
