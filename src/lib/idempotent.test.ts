import { AxiosError } from "axios";
import { withIdempotentRetries, isRetryable } from "./idempotent";

const noSleep = { sleep: () => Promise.resolve() };
const networkError = () => new AxiosError("Network Error", "ERR_NETWORK");
const httpError = (status: number) =>
  new AxiosError(`status ${status}`, "ERR_BAD_RESPONSE", undefined, undefined, { status, data: {}, statusText: "", headers: {}, config: {} as any });

test("every retry of one action sends the same key", async () => {
  const keys: string[] = [];
  let calls = 0;
  const result = await withIdempotentRetries(async (key) => {
    keys.push(key);
    calls++;
    if (calls < 3) throw calls === 1 ? networkError() : httpError(409);
    return "created";
  }, noSleep);
  expect(result).toBe("created");
  expect(keys).toHaveLength(3);
  expect(new Set(keys).size).toBe(1);
});

test("a new action gets a new key", async () => {
  const seen: string[] = [];
  await withIdempotentRetries(async (k) => seen.push(k), noSleep);
  await withIdempotentRetries(async (k) => seen.push(k), noSleep);
  expect(seen[0]).not.toBe(seen[1]);
});

test("client errors are not retried", async () => {
  let calls = 0;
  await expect(
    withIdempotentRetries(async () => {
      calls++;
      throw httpError(422);
    }, noSleep),
  ).rejects.toBeTruthy();
  expect(calls).toBe(1);
  expect(isRetryable(httpError(400))).toBe(false);
  expect(isRetryable(httpError(503))).toBe(true);
});

test("gives up after the attempt budget", async () => {
  let calls = 0;
  await expect(
    withIdempotentRetries(async () => {
      calls++;
      throw networkError();
    }, { ...noSleep, attempts: 3 }),
  ).rejects.toBeTruthy();
  expect(calls).toBe(3);
});
