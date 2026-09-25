// Safe retries for POSTs that create something (an upload, a paid image generation).
//
// One key is generated per user action and sent as the Idempotency-Key header on every attempt.
// If the connection drops or times out, the client cannot know whether the server created the
// post, so it retries with the SAME key: the backend then either replays the first result or
// answers 409 while the first attempt is still running (we wait and ask again). It never
// creates a second post.
import axios from "axios";
import type { AxiosError, AxiosResponse } from "axios";

export function newIdempotencyKey(): string {
  const c: Crypto | undefined = typeof crypto !== "undefined" ? crypto : undefined;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

// Worth retrying with the same key: no response at all (network error, timeout), 409 (the first
// attempt is still running) or a 5xx from a proxy in front of the service.
export function isRetryable(err: unknown): boolean {
  const e = err as AxiosError;
  if (!e || !e.isAxiosError) return false;
  const status = e.response?.status;
  return status === undefined || status === 409 || status === 502 || status === 503 || status === 504;
}

export interface RetryOptions {
  attempts?: number; // total attempts, default 3
  delayMs?: (attempt: number) => number; // default 1s, 2s, 4s…
  sleep?: (ms: number) => Promise<void>;
}

// withIdempotentRetries calls send(key) until it succeeds, fails with a non-retryable error, or
// runs out of attempts. Every attempt gets the same key.
export async function withIdempotentRetries<T>(
  send: (key: string) => Promise<T>,
  { attempts = 3, delayMs = (n) => 1000 * 2 ** (n - 1), sleep = (ms) => new Promise((r) => setTimeout(r, ms)) }: RetryOptions = {},
): Promise<T> {
  const key = newIdempotencyKey();
  for (let attempt = 1; ; attempt++) {
    try {
      return await send(key);
    } catch (err) {
      if (attempt >= attempts || !isRetryable(err)) throw err;
      await sleep(delayMs(attempt));
    }
  }
}

export function postIdempotent<T>(url: string, data: unknown, headers: Record<string, string>, options?: RetryOptions): Promise<AxiosResponse<T>> {
  return withIdempotentRetries((key) => axios.post<T>(url, data, { headers: { ...headers, "Idempotency-Key": key } }), options);
}
