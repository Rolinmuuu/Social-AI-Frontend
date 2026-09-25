import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { SendOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL, TOKEN_KEY } from "../constants";
import type { CommentResponse } from "../types/model";

interface LocalComment {
  comment_id: string;
  content: string;
}

interface CommentSectionProps {
  postId: string;
}

// Comments written in this session. The backend has no comment-list endpoint yet,
// so earlier comments on the post are not loaded here.
function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<LocalComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    const content = newComment.trim();
    if (!content) {
      message.warning("Please enter a comment");
      return;
    }
    setSubmitting(true);
    axios
      .post<CommentResponse>(
        `${BASE_URL}/post/${postId}/comment`,
        { content },
        { headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`, "Content-Type": "application/json" } },
      )
      .then((response) => {
        if (response.status === 201) {
          setComments((prev) => [...prev, { comment_id: response.data.comment_id, content }]);
          setNewComment("");
        }
      })
      .catch(() => message.error("Failed to add comment"))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="comments">
      {comments.length > 0 && (
        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c.comment_id}>
              <span className="comment-you">You</span>
              {c.content}
            </li>
          ))}
        </ul>
      )}
      <div className="comment-input">
        <Input.TextArea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment…"
          autoSize={{ minRows: 1, maxRows: 3 }}
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
