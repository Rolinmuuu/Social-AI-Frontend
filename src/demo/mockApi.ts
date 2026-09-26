// In-browser stand-in for the SocialAI API, used only by the demo build
// (REACT_APP_DEMO=true, e.g. the GitHub Pages deployment). It answers the same routes the
// Go gateway serves, with the same status codes, so the UI code is identical in both modes.
import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { SAMPLE_POSTS, SAMPLE_COMMENTS, RELATED } from "./data";
import type { DemoPost } from "./data";
import type { Comment } from "../types/model";

export const DEMO = process.env.REACT_APP_DEMO === "true";
const TOKEN_PREFIX = "demo.";

const nowSec = () => Math.floor(Date.now() / 1000);

function seedComments(): Map<string, Comment[]> {
  const out = new Map<string, Comment[]>();
  let n = 0;
  Object.entries(SAMPLE_COMMENTS).forEach(([postId, list]) => {
    out.set(
      postId,
      list.map((c, i) => {
        const id = `seed-${++n}`;
        return {
          comment_id: id,
          parent_comment_id: "",
          root_comment_id: id,
          user_id: c.user,
          post_id: postId,
          depth: 0,
          content: c.content,
          created_at: nowSec() - (list.length - i) * 600,
          deleted: false,
          deleted_at: 0,
        };
      }),
    );
  });
  return out;
}

const state = {
  posts: SAMPLE_POSTS.map((p) => ({ ...p })),
  comments: seedComments(), // post id -> comments, oldest first
  likes: new Set<string>(), // `${user}:${postId}`
  users: new Map<string, string>([["demo", "demo"]]),
  nextId: 1000,
  generated: 0,
  // Idempotency-Key -> stored response, as the backend keeps it (per user).
  replays: new Map<string, { status: number; data: unknown }>(),
};

function idempotencyKey(config: InternalAxiosRequestConfig, user: string): string | null {
  const k = config.headers?.["Idempotency-Key"] || config.headers?.["idempotency-key"];
  return k ? `${user}:${String(k)}` : null;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function currentUser(config: InternalAxiosRequestConfig): string | null {
  const auth = String(config.headers?.Authorization || config.headers?.authorization || "");
  const token = auth.replace(/^Bearer\s+/i, "");
  return token.startsWith(TOKEN_PREFIX) ? token.slice(TOKEN_PREFIX.length) : null;
}

function respond(config: InternalAxiosRequestConfig, status: number, data: unknown): AxiosResponse {
  const response = { data, status, statusText: String(status), headers: {}, config } as AxiosResponse;
  if (status >= 400) {
    throw new AxiosError(`Request failed with status code ${status}`, "ERR_BAD_REQUEST", config, null, response);
  }
  return response;
}

function parseBody(config: InternalAxiosRequestConfig): any {
  if (typeof config.data === "string") {
    try {
      return JSON.parse(config.data);
    } catch {
      return {};
    }
  }
  return config.data || {};
}

// Lower-case word list with a naive plural strip ("animals" -> "animal").
const words = (s: string) =>
  s
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1)
    .map((w) => (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w));

export function keywordMatch(post: DemoPost, query: string): boolean {
  const text = post.message.toLowerCase();
  return words(query).every((w) => text.includes(w));
}

// Scores posts by overlap between the (expanded) query and each post's tags and caption.
export function semanticRank(posts: DemoPost[], query: string): DemoPost[] {
  const q = words(query);
  const expanded = new Set(q);
  q.forEach((w) => (RELATED[w] || []).forEach((r) => words(r).forEach((x) => expanded.add(x))));
  const scored = posts
    .map((p) => {
      const bag = new Set([...p.tags.flatMap(words), ...words(p.message)]);
      let score = 0;
      expanded.forEach((w) => {
        if (bag.has(w)) score += q.includes(w) ? 2 : 1;
      });
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.map((x) => x.p);
}

function pickForPrompt(prompt: string): DemoPost {
  const images = SAMPLE_POSTS.filter((p) => p.type === "image");
  const ranked = semanticRank(images, prompt);
  if (ranked.length) return ranked[0];
  state.generated += 1;
  return images[state.generated % images.length];
}

async function handle(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const method = (config.method || "get").toLowerCase();
  const url = new URL(config.url || "/", "http://demo.local");
  const path = url.pathname;
  await wait(250 + Math.random() * 250);

  if (method === "post" && path.endsWith("/signup")) {
    const { user_id, password } = parseBody(config);
    if (!user_id || !password) return respond(config, 400, "invalid input");
    if (state.users.has(user_id)) return respond(config, 409, "user already exists");
    state.users.set(user_id, password);
    return respond(config, 201, { user_id });
  }
  if (method === "post" && path.endsWith("/signin")) {
    const { user_id, password } = parseBody(config);
    if (!user_id || !password) return respond(config, 401, "invalid credentials");
    const known = state.users.get(user_id);
    if (known !== undefined && known !== password) return respond(config, 401, "invalid credentials");
    return respond(config, 200, { token: TOKEN_PREFIX + user_id });
  }

  const user = currentUser(config);
  if (!user) return respond(config, 401, "missing or invalid token");

  if (method === "get" && path.endsWith("/search")) {
    const live = state.posts.filter((p) => !p.deleted).sort((a, b) => b.created_at - a.created_at);
    const kw = url.searchParams.get("keywords") || "";
    const uid = url.searchParams.get("user_id");
    let posts = live;
    if (uid) posts = live.filter((p) => p.user_id === uid);
    else if (url.searchParams.get("mode") === "semantic" && kw) posts = semanticRank(live, kw);
    else if (kw) posts = live.filter((p) => keywordMatch(p, kw));
    return respond(config, 200, { posts });
  }

  // Like the backend: a retried create with the same Idempotency-Key replays the first result.
  const idemKey = method === "post" && /\/(upload|generate-image-from-openai)$/.test(path) ? idempotencyKey(config, user) : null;
  const replay = idemKey ? state.replays.get(idemKey) : undefined;
  if (replay) return respond(config, replay.status, replay.data);
  const remember = (status: number, data: unknown) => {
    if (idemKey) state.replays.set(idemKey, { status, data });
    return respond(config, status, data);
  };

  if (method === "post" && path.endsWith("/upload")) {
    const form = config.data as FormData;
    const file = form?.get?.("media_file") as File | null;
    const caption = String(form?.get?.("message") || "");
    if (!file) return respond(config, 400, "media_file is required");
    const post: DemoPost = {
      ...SAMPLE_POSTS[0],
      post_id: `demo-${state.nextId++}`,
      user_id: user,
      user,
      message: caption,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
      like_count: 0,
      shared_count: 0,
      tags: words(caption),
      created_at: nowSec(),
    };
    state.posts.unshift(post);
    return remember(201, { post_id: post.post_id });
  }

  if (method === "post" && path.endsWith("/generate-image-from-openai")) {
    const { prompt } = parseBody(config);
    if (!prompt) return respond(config, 400, "prompt is required");
    await wait(1800);
    const source = pickForPrompt(prompt);
    const post: DemoPost = {
      ...source,
      post_id: `demo-${state.nextId++}`,
      user_id: user,
      user,
      message: prompt,
      like_count: 0,
      shared_count: 0,
      tags: [...source.tags, ...words(prompt)],
      created_at: nowSec(),
    };
    state.posts.unshift(post);
    return remember(201, post);
  }

  const m = path.match(/\/post\/([^/]+)(?:\/(like|share|comment|comments))?$/);
  if (m) {
    const target = state.posts.find((p) => p.post_id === m[1] && !p.deleted);
    if (!target) return respond(config, 404, "post not found");
    const action = m[2];
    if (method === "delete" && !action) {
      // Same rule as the backend: only the author may delete.
      if (target.user_id !== user) return respond(config, 403, "only the author can delete this post");
      target.deleted = true;
      return respond(config, 200, "deleted");
    }
    if (method === "post" && action === "like") {
      const key = `${user}:${target.post_id}`;
      if (state.likes.has(key)) return respond(config, 409, "already liked");
      state.likes.add(key);
      target.like_count += 1;
      return respond(config, 200, "liked");
    }
    if (method === "delete" && action === "like") {
      const key = `${user}:${target.post_id}`;
      if (!state.likes.delete(key)) return respond(config, 404, "post not liked");
      target.like_count -= 1;
      return respond(config, 200, "like removed");
    }
    if (method === "post" && action === "share") {
      target.shared_count += 1;
      return respond(config, 200, "shared");
    }
    if (method === "post" && action === "comment") {
      const { content } = parseBody(config);
      if (!content || String(content).length > 2000) return respond(config, 400, "comment must be 1-2000 characters");
      const id = `c-${state.nextId++}`;
      const list = state.comments.get(target.post_id) || [];
      list.push({
        comment_id: id,
        parent_comment_id: "",
        root_comment_id: id,
        user_id: user,
        post_id: target.post_id,
        depth: 0,
        content: String(content),
        created_at: nowSec(),
        deleted: false,
        deleted_at: 0,
      });
      state.comments.set(target.post_id, list);
      return respond(config, 201, { comment_id: id });
    }
    if (method === "get" && action === "comments") {
      // Same contract as the backend: oldest first, an opaque cursor, none on the last page.
      const all = state.comments.get(target.post_id) || [];
      const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 50, 1), 200);
      const cursor = url.searchParams.get("cursor");
      let start = 0;
      if (cursor) {
        try {
          start = Number(atob(cursor));
        } catch {
          start = NaN;
        }
        if (!Number.isInteger(start) || start < 0) return respond(config, 400, "invalid cursor");
      }
      const comments = all.slice(start, start + limit);
      const next = start + limit < all.length ? btoa(String(start + limit)) : undefined;
      return respond(config, 200, next ? { comments, next_cursor: next } : { comments });
    }
  }

  return respond(config, 404, "not found in demo API");
}

export function installDemoApi() {
  axios.defaults.adapter = (config) => handle(config as InternalAxiosRequestConfig);
}
