import React, { useCallback, useEffect, useState } from "react";
import { Input, Button, message } from "antd";
import { SendOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL, TOKEN_KEY } from "../constants";
import { userIdFromToken } from "../lib/auth";
import type { Comment, CommentPage, CommentResponse } from "../types/model";

interface CommentSectionProps {
  postId: string;
  pageSize?: number;
}

// Comments on a post, oldest first, loaded a page at a time from GET /post/{id}/comments.
function CommentSection({ postId, pageSize = 20 }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem(TOKEN_KEY);
  const me = userIdFromToken(token);
  const headers = { Authorization: `Bearer ${token}` };

  const load = useCallback(
    (cursor?: string) => {
      setLoading(true);
      setLoadFailed(false);
      const params = new URLSearchParams({ limit: String(pageSize) });
      if (cursor) params.set("cursor", cursor);
      axios
        .get<CommentPage>(`${BASE_URL}/post/${postId}/comments?${params}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
        })
        .then(({ data }) => {
          // A later page continues the list; the first page replaces it.
          setComments((prev) => (cursor ? [...prev, ...data.comments] : data.comments));
          setNextCursor(data.next_cursor);
        })
        .catch(() => setLoadFailed(true))
        .finally(() => setLoading(false));
    },
    [postId, pageSize],
  );

  useEffect(() => load(), [load]);

  const handleSubmit = () => {
    const content = newComment.trim();
    if (!content) {
      message.warning("Please enter a comment");
      return;
    }
    setSubmitting(true);
    axios
      .post<CommentResponse>(`${BASE_URL}/post/${postId}/comment`, { content }, { headers: { ...headers, "Content-Type": "application/json" } })
      .then((response) => {
        if (response.status === 201) {
          const id = response.data.comment_id;
          setComments((prev) => [
            ...prev,
            {
              comment_id: id,
              parent_comment_id: "",
              root_comment_id: id,
              user_id: me || "",
              post_id: postId,
              depth: 0,
              content,
              created_at: Math.floor(Date.now() / 1000),
              deleted: false,
              deleted_at: 0,
            },
          ]);
          setNewComment("");
        }
      })
      .catch(() => message.error("Failed to add comment"))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="comments">
      {loadFailed && (
        <p className="comment-status" role="alert">
          Couldn't load comments.{" "}
          <button type="button" className="link-button" onClick={() => load()}>
            Retry
          </button>
        </p>
      )}
      {!loadFailed && !loading && comments.length === 0 && <p className="comment-status">No comments yet.</p>}
      {comments.length > 0 && (
        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c.comment_id} className={c.depth > 0 ? "reply" : undefined}>
              <span className="comment-author">{c.user_id === me ? "You" : c.user_id}</span>
              {c.content}
            </li>
          ))}
        </ul>
      )}
      {nextCursor && (
        <button type="button" className="link-button comment-more" disabled={loading} onClick={() => load(nextCursor)}>
          {loading ? "Loading…" : "Show more comments"}
        </button>
      )}
      <div className="comment-input">
        <Input.TextArea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment…"
          autoSize={{ minRows: 1, maxRows: 3 }}
          maxLength={2000}
          aria-label="Add a comment"
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <Button type="primary" shape="circle" icon={<SendOutlined />} loading={submitting} onClick={handleSubmit} aria-label="Post comment" />
      </div>
    </div>
  );
}

export default CommentSection;
