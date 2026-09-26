// Sample content for the demo build (REACT_APP_DEMO=true). The artwork in public/demo/
// is generated from code for this demo; the users and captions are fictional.
import type { Post } from "../types/model";

export interface DemoPost extends Post {
  tags: string[];
}

const img = (file: string) => `${process.env.PUBLIC_URL || ""}/demo/${file}`;

let seq = 0;
const post = (
  user: string,
  file: string,
  message: string,
  tags: string[],
  like_count: number,
  shared_count: number,
  type: "image" | "video" = "image",
): DemoPost => {
  seq += 1;
  return {
    post_id: `demo-${seq}`,
    user_id: user,
    user,
    message,
    url: img(file),
    type,
    deleted: false,
    deleted_at: 0,
    like_count,
    shared_count,
    tags,
    created_at: Math.floor(Date.now() / 1000) - seq * 3600,
  };
};

export const SAMPLE_POSTS: DemoPost[] = [
  post("maya_lin", "cafe-morning.jpg", "Rainy Sunday, flat white and a croissant by the window.", ["coffee", "cafe", "rain", "cozy", "warm", "food", "flat illustration"], 128, 12),
  post("kenji.dev", "pixel-night-city.jpg", "Pixel skyline — every lit window is one pixel, the red car is two.", ["pixel art", "city", "night", "neon", "retro", "8-bit"], 214, 31),
  post("noor", "lowpoly-alpine-lake.jpg", "Low-poly study of an alpine lake. Triangles all the way down.", ["mountains", "lake", "landscape", "low poly", "nature", "cool"], 93, 9),
  post("ines.g", "botanical-fan-palm.jpg", "Ink sketch from the greenhouse: Chinese fan palm.", ["plant", "botanical", "line art", "ink", "green", "nature"], 57, 4),
  post("jun.h", "isometric-home-office.jpg", "My desk, if it were a tiny isometric diorama.", ["isometric", "room", "desk", "workspace", "plant", "3d"], 176, 22),
  post("sam_ocean", "papercut-whale-tail.jpg", "Paper-cut layers — a whale waving goodbye.", ["ocean", "whale", "paper cut", "blue", "sea", "animal"], 241, 40),
  post("atelier_k", "bauhaus-poster.jpg", "Bauhaus poster exercise: three primaries, one rule.", ["poster", "bauhaus", "geometric", "design", "typography", "red", "blue", "yellow"], 88, 15),
  post("kenji.dev", "synthwave-highway.jpg", "Outrun drive, 1986 edition.", ["synthwave", "neon", "retro", "road", "palm", "night", "pink"], 302, 57),
  post("ines.g", "watercolor-lemons.jpg", "Watercolor lemons — trying to keep the edges loose.", ["watercolor", "lemon", "still life", "fruit", "yellow", "painting", "warm"], 64, 6),
  post("maya_lin", "flat-sleepy-cat.jpg", "Mochi has claimed the rug again. Zzz.", ["cat", "pet", "animal", "cozy", "sleep", "flat illustration"], 389, 71),
  post("chef_tomo", "topdown-ramen.jpg", "Shoyu ramen, top-down. Egg timing: 6:30.", ["food", "ramen", "noodles", "japanese", "bowl", "warm"], 155, 18),
  post("orbit.lab", "space-ringed-planet.jpg", "Next stop: the ringed one.", ["space", "planet", "rocket", "stars", "galaxy", "purple"], 198, 26),
  post("sam_ocean", "canal-houses.jpg", "Canal houses in every color we had in the palette.", ["architecture", "houses", "city", "canal", "colorful", "travel", "boat"], 112, 13),
  post("kenji.dev", "synthwave-loop.mp4#t=0.1", "Looping the highway — 6 seconds of grid.", ["synthwave", "neon", "loop", "animation", "retro"], 77, 8, "video"),
  post("sam_ocean", "waves-loop.mp4#t=0.1", "The paper waves, animated.", ["ocean", "waves", "paper cut", "animation", "loop", "blue"], 49, 5, "video"),
];

// A few existing comments, so opening a post's comments shows a conversation.
export const SAMPLE_COMMENTS: Record<string, { user: string; content: string }[]> = {
  "demo-10": [
    { user: "sam_ocean", content: "Mochi has excellent taste in rugs." },
    { user: "noor", content: "The little Zzz is perfect." },
    { user: "maya_lin", content: "She has not moved in three hours." },
  ],
  "demo-6": [
    { user: "atelier_k", content: "How many layers is this?" },
    { user: "sam_ocean", content: "Seven, plus the tail." },
  ],
  "demo-8": [{ user: "orbit.lab", content: "Need this as a wallpaper." }],
};

// A small synonym map so "semantic" search in the demo behaves like meaning-based search
// (the real backend compares embeddings; the demo has no model, so it expands the query).
export const RELATED: Record<string, string[]> = {
  autumn: ["warm", "orange", "cozy"],
  cozy: ["warm", "cat", "coffee", "rain"],
  sea: ["ocean", "whale", "waves", "blue"],
  animal: ["cat", "whale", "pet"],
  pet: ["cat"],
  food: ["ramen", "lemon", "coffee", "croissant"],
  city: ["houses", "night", "architecture"],
  nature: ["mountains", "plant", "lake", "botanical"],
  retro: ["synthwave", "pixel art", "8-bit"],
  calm: ["lake", "sleep", "watercolor", "ocean"],
  work: ["desk", "workspace", "isometric"],
  travel: ["canal", "houses", "mountains", "space"],
  night: ["neon", "stars", "city"],
};
