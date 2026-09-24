export const TOKEN_KEY = "social-ai-token";
export const BASE_URL = process.env.REACT_APP_API_BASE || "http://localhost";

export const SEARCH_KEY = {
  all: 0,
  keywords: 1,
  user: 2,
  semantic: 3,
} as const;

export type SearchKeyType = (typeof SEARCH_KEY)[keyof typeof SEARCH_KEY];
