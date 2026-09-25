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
