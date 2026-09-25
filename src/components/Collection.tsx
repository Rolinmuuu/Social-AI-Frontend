import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Empty, Segmented, Skeleton } from "antd";
import { PictureOutlined, VideoCameraOutlined } from "@ant-design/icons";
import SearchBar from "./SearchBar";
import { SEARCH_KEY, BASE_URL, TOKEN_KEY } from "../constants";
import type { Post, SearchResponse } from "../types/model";
import { buildSearchUrl, authHeaders } from "../lib/search";
import type { SearchOption } from "../lib/search";
import PostCard from "./PostCard";
import CreatePostButton from "./CreatePostButton";

type MediaType = "image" | "video";

function Collection() {
  const [searchOption, setSearchOption] = useState<SearchOption>({ type: SEARCH_KEY.all, keywords: "" });
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<MediaType>("image");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios
      .get<SearchResponse>(buildSearchUrl(BASE_URL, searchOption), {
        headers: authHeaders(localStorage.getItem(TOKEN_KEY)),
      })
      .then((response) => {
        if (response.status === 200) setPosts(response.data?.posts || []);
      })
      .catch(() => message.error("Failed to fetch posts, try again later"))
      .finally(() => setLoading(false));
  }, [searchOption, reloadKey]);

  const handleDeletePost = (postId: string) => setPosts((prev) => prev.filter((p) => p.post_id !== postId));

  // After a new upload, switch to its media tab and reload the unfiltered feed.
  // The short delay (kept from the original) gives Elasticsearch time to index the post.
  const showPost = (postType: string) => {
    setActiveTab(postType === "video" ? "video" : "image");
    setTimeout(() => {
      setSearchOption({ type: SEARCH_KEY.all, keywords: "" });
      setReloadKey((k) => k + 1);
    }, 3000);
  };

  const count = (type: MediaType) => posts.filter((p) => p.type === type).length;
  const visible = posts.filter((p) => p.type === activeTab);
  const searching = searchOption.type !== SEARCH_KEY.all && searchOption.keywords;

  return (
    <div className="page explore-page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Explore</p>
          <h1>{searching ? `Results for “${searchOption.keywords}”` : "Latest from the community"}</h1>
        </div>
        <CreatePostButton onShowPost={showPost} />
      </div>

      <SearchBar handleSearch={setSearchOption} />

      <div className="feed-toolbar">
        <Segmented<MediaType>
          value={activeTab}
          onChange={setActiveTab}
          options={[
            { value: "image", label: <span className="seg-label"><PictureOutlined /> Images <em>{count("image")}</em></span> },
            { value: "video", label: <span className="seg-label"><VideoCameraOutlined /> Videos <em>{count("video")}</em></span> },
          ]}
        />
      </div>

      {loading ? (
        <div className="masonry">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div className="post-card skeleton-card" key={i}>
              <Skeleton.Image active className={`sk-img h${i % 3}`} />
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </div>
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="empty-wrap">
          <Empty description={searching ? `No ${activeTab}s match this search` : `No ${activeTab}s yet — create the first one`} />
        </div>
      ) : (
        <div className="masonry">
          {visible.map((post) => (
            <PostCard key={post.post_id} post={post} onDelete={handleDeletePost} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Collection;
