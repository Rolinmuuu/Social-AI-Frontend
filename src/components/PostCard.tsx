import React, { useState } from "react";
import { message, Tooltip, Typography, Image, Popconfirm } from "antd";
import { HeartOutlined, HeartFilled, ShareAltOutlined, MessageOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL, TOKEN_KEY } from "../constants";
import type { Post } from "../types/model";
import CommentSection from "./CommentSection";
import { UserAvatar } from "./Brand";

const { Paragraph } = Typography;

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => void;
}

function PostCard({ post, onDelete }: PostCardProps) {
  const [likeCount, setLikeCount] = useState(post.like_count || 0);
  const [shareCount, setShareCount] = useState(post.shared_count || 0);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const getAuthHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` });
  const author = post.user || post.user_id;

  const handleLike = () => {
    if (liked) return;
    axios
      .post(`${BASE_URL}/post/${post.post_id}/like`, {}, { headers: getAuthHeaders() })
      .then(() => {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      })
      .catch((error: any) => {
        if (error.response?.status === 409) {
          setLiked(true);
          message.info("You already liked this post");
        } else {
          message.error("Failed to like post");
        }
      });
  };

  const handleShare = () => {
    axios
      .post(
        `${BASE_URL}/post/${post.post_id}/share`,
        { platform: "web" },
        { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } },
      )
      .then(() => {
        setShareCount((prev) => prev + 1);
        message.success("Post shared");
      })
      .catch(() => message.error("Failed to share post"));
  };

  const handleDelete = () =>
    axios
      .delete(`${BASE_URL}/post/${post.post_id}`, { headers: getAuthHeaders() })
      .then(() => {
        message.success("Post deleted");
        onDelete?.(post.post_id);
      })
      .catch((error: any) =>
        message.error(error.response?.status === 403 ? "You can only delete your own posts" : "Failed to delete post"),
      );

  return (
    <article className="post-card">
      <div className="post-media">
        {post.type === "video" ? (
          <video src={post.url} controls preload="metadata" />
        ) : (
          <Image alt={post.message} src={post.url} />
        )}
      </div>

      <div className="post-body">
        <div className="post-author">
          <UserAvatar name={author} size={32} />
          <span className="post-author-name">{author}</span>
        </div>
        <Paragraph className="post-caption" ellipsis={{ rows: 3, expandable: true, symbol: "more" }}>
          {post.message}
        </Paragraph>

        <div className="post-actions">
          <Tooltip title={liked ? "Liked" : "Like"}>
            <button type="button" className={`act${liked ? " liked" : ""}`} onClick={handleLike} aria-label="Like">
              {liked ? <HeartFilled /> : <HeartOutlined />}
              <span>{likeCount}</span>
            </button>
          </Tooltip>
          <Tooltip title="Share">
            <button type="button" className="act" onClick={handleShare} aria-label="Share">
              <ShareAltOutlined />
              <span>{shareCount}</span>
            </button>
          </Tooltip>
          <Tooltip title="Comments">
            <button
              type="button"
              className={`act${showComments ? " on" : ""}`}
              onClick={() => setShowComments(!showComments)}
              aria-label="Comments"
              aria-expanded={showComments}
            >
              <MessageOutlined />
            </button>
          </Tooltip>
          <Popconfirm
            title="Delete this post?"
            description="This cannot be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={handleDelete}
          >
            <button type="button" className="act danger" aria-label="Delete">
              <DeleteOutlined />
            </button>
          </Popconfirm>
        </div>

        {showComments && <CommentSection postId={post.post_id} />}
      </div>
    </article>
  );
}

export default PostCard;
