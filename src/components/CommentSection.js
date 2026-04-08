import React, { useState } from "react";
import { Input, Button, List, message, Avatar } from "antd";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL, TOKEN_KEY } from "../constants";

const { TextArea } = Input;

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!newComment.trim()) {
      message.warning("Please enter a comment");
      return;
    }
    setSubmitting(true);
    axios
      .post(
        `${BASE_URL}/post/${postId}/comment`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
            "Content-Type": "application/json",
          },
        },
      )
      .then((response) => {
        if (response.status === 201) {
          setComments((prev) => [
            ...prev,
            {
              comment_id: response.data.comment_id,
              content: newComment,
            },
          ]);
          setNewComment("");
          message.success("Comment added");
        }
      })
      .catch(() => {
        message.error("Failed to add comment");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div style={{ marginTop: 16 }}>
      <List
        dataSource={comments}
        locale={{ emptyText: "No comments yet — be the first!" }}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar size="small" icon={<UserOutlined />} />}
              description={item.content}
            />
          </List.Item>
        )}
      />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <TextArea
          rows={1}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          autoSize={{ minRows: 1, maxRows: 3 }}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          style={{ flex: 1 }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          loading={submitting}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}

export default CommentSection;
