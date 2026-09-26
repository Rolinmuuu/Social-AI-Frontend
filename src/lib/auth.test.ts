import { userIdFromToken } from "./auth";

const b64url = (s: string) => btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

test("reads user_id from a JWT payload (base64url, unpadded)", () => {
  const token = `${b64url('{"alg":"HS256"}')}.${b64url('{"user_id":"maya_lin","exp":1}')}.sig`;
  expect(userIdFromToken(token)).toBe("maya_lin");
});

test("reads the demo token and rejects garbage", () => {
  expect(userIdFromToken("demo.alice")).toBe("alice");
  expect(userIdFromToken(null)).toBeNull();
  expect(userIdFromToken("not-a-token")).toBeNull();
  expect(userIdFromToken("a.%%%.c")).toBeNull();
  expect(userIdFromToken(`x.${b64url('{"sub":"x"}')}.y`)).toBeNull();
});
