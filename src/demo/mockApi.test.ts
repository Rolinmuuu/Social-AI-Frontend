import axios from "axios";
import { installDemoApi, semanticRank, keywordMatch } from "./mockApi";
import { SAMPLE_POSTS } from "./data";

beforeAll(() => installDemoApi());

const auth = (user: string) => ({ headers: { Authorization: `Bearer demo.${user}` } });

test("semantic search ranks posts by meaning, not only exact words", () => {
  const top = semanticRank(SAMPLE_POSTS, "sea animal")[0];
  expect(top.tags).toEqual(expect.arrayContaining(["whale"]));
});

test("keyword search matches caption words", () => {
  const ramen = SAMPLE_POSTS.find((p) => p.url.includes("ramen"))!;
  expect(keywordMatch(ramen, "shoyu ramen")).toBe(true);
  expect(keywordMatch(ramen, "pizza")).toBe(false);
});

test("the demo API enforces auth, author-only delete and one like per user", async () => {
  await expect(axios.get("http://x/search")).rejects.toMatchObject({ response: { status: 401 } });

  const { data } = await axios.post("http://x/signin", { user_id: "alice", password: "pw" });
  expect(data.token).toBe("demo.alice");

  const feed = await axios.get("http://x/search", auth("alice"));
  const someoneElses = feed.data.posts.find((p: { user_id: string }) => p.user_id !== "alice");
  await expect(axios.delete(`http://x/post/${someoneElses.post_id}`, auth("alice"))).rejects.toMatchObject({
    response: { status: 403 },
  });

  await axios.post(`http://x/post/${someoneElses.post_id}/like`, {}, auth("alice"));
  await expect(axios.post(`http://x/post/${someoneElses.post_id}/like`, {}, auth("alice"))).rejects.toMatchObject({
    response: { status: 409 },
  });
});

test("a retried generation with the same Idempotency-Key replays the first post", async () => {
  const headers = { Authorization: "Bearer demo.bob", "Idempotency-Key": "k-1" };
  const before = (await axios.get("http://x/search", auth("bob"))).data.posts.length;
  const first = await axios.post("http://x/post/generate-image-from-openai", { prompt: "a cat" }, { headers });
  const retry = await axios.post("http://x/post/generate-image-from-openai", { prompt: "a cat" }, { headers });
  expect(retry.data.post_id).toBe(first.data.post_id);
  const after = (await axios.get("http://x/search", auth("bob"))).data.posts.length;
  expect(after).toBe(before + 1);
}, 10000);

test("comments are listed oldest first and paged with an opaque cursor", async () => {
  const first = await axios.get("http://x/post/demo-10/comments?limit=2", auth("carol"));
  expect(first.data.comments).toHaveLength(2);
  expect(first.data.comments[0].content).toMatch(/excellent taste/);
  expect(first.data.next_cursor).toBeTruthy();

  await axios.post("http://x/post/demo-10/comment", { content: "so round" }, auth("carol"));
  const second = await axios.get(`http://x/post/demo-10/comments?limit=2&cursor=${first.data.next_cursor}`, auth("carol"));
  expect(second.data.comments.map((c: { user_id: string }) => c.user_id)).toEqual(["maya_lin", "carol"]);
  expect(second.data.next_cursor).toBeUndefined();

  await expect(axios.get("http://x/post/demo-10/comments?cursor=%25%25", auth("carol"))).rejects.toMatchObject({
    response: { status: 400 },
  });
  await expect(axios.post("http://x/post/demo-10/comment", { content: "" }, auth("carol"))).rejects.toMatchObject({
    response: { status: 400 },
  });
}, 10000);

test("a like can be removed, once", async () => {
  await axios.post("http://x/post/demo-3/like", {}, auth("dave"));
  await axios.delete("http://x/post/demo-3/like", auth("dave"));
  await expect(axios.delete("http://x/post/demo-3/like", auth("dave"))).rejects.toMatchObject({ response: { status: 404 } });
}, 10000);
