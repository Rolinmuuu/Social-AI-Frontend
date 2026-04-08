import React, { useState } from "react";
import { Card, message, Tooltip, Space, Typography, Avatar, Image } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  CommentOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { BASE_URL, TOKEN_KEY } from "../constants";
import CommentSection from "./CommentSection";

const { Paragraph } = Typography;

function PostCard({ post, onDelete }) {
  const [likeCount, setLikeCount] = useState(post.like_count || 0);
  const [shareCount, setShareCount] = useState(post.shared_count || 0);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
  });

  const handleLike = () => {
    axios
      .post(
        `${BASE_URL}/post/${post.post_id}/like`,
        {},
        { headers: getAuthHeaders() },
      )
      .then(() => {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      })
      .catch((error) => {
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
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        },
      )
      .then(() => {
        setShareCount((prev) => prev + 1);
        message.success("Post shared!");
      })
      .catch(() => {
        message.error("Failed to share post");
      });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      axios
        .delete(`${BASE_URL}/post/${post.post_id}`, {
          headers: getAuthHeaders(),
        })
        .then(() => {
          message.success("Post deleted");
          onDelete?.(post.post_id);
        })
        .catch(() => {
          message.error("Failed to delete post");
        });
    }
  };

  const renderMedia = () => {
    if (post.type === "video") {
      return (
        <video
          src={post.url}
          controls
          style={{ width: "100%", maxHeight: 400, objectFit: "cover" }}
        />
      );
    }
    return (
      <Image
        alt={post.message}
        src={post.url}
        style={{ width: "100%", maxHeight: 400, objectFit: "cover" }}
      />
    );
  };

  return (
    <Card
      cover={renderMedia()}
      actions={[
        <Tooltip title="Like" key="like">
          <Space onClick={handleLike} style={{ cursor: "pointer" }}>
            {liked ? (
              <HeartFilled style={{ color: "#ff4d4f" }} />
            ) : (
              <HeartOutlined />
            )}
            <span>{likeCount}</span>
          </Space>
        </Tooltip>,
        <Tooltip title="Share" key="share">
          <Space onClick={handleShare} style={{ cursor: "pointer" }}>
            <ShareAltOutlined />
            <span>{shareCount}</span>
          </Space>
        </Tooltip>,
        <Tooltip title="Comment" key="comment">
          <CommentOutlined
            onClick={() => setShowComments(!showComments)}
            style={{ cursor: "pointer" }}
          />
        </Tooltip>,
        <Tooltip title="Delete" key="delete">
          <DeleteOutlined
            onClick={handleDelete}
            style={{ color: "#ff4d4f", cursor: "pointer" }}
          />
        </Tooltip>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar icon={<UserOutlined />} />}
        title={post.user || post.user_id}
        description={
          <Paragraph ellipsis={{ rows: 2, expandable: true }}>
            {post.message}
          </Paragraph>
        }
      />
      {showComments && <CommentSection postId={post.post_id} />}
    </Card>
  );
}

export default PostCard;
