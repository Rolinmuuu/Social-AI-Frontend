import React, { useState, useRef } from "react";
import { Modal, Button, message } from "antd";
import type { FormInstance } from "antd";
import axios from "axios";
import { PostForm } from "./PostForm";
import { BASE_URL, TOKEN_KEY } from "../constants";

interface CreatePostButtonProps {
  onShowPost: (postType: string) => void;
}

function CreatePostButton({ onShowPost }: CreatePostButtonProps) {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const formRef = useRef<FormInstance>(null);

  const handleOk = () => {
    setConfirmLoading(true);
    formRef.current
      ?.validateFields()
      .then((form: any) => {
        const { description, uploadPost } = form;
        const { type, originFileObj } = uploadPost[0];
        const match = type?.match(/^(image|video)/g);
        const postType = match?.[0];
        if (postType) {
          const formData = new FormData();
          formData.append("message", description);
          formData.append("media_file", originFileObj);

          axios
            .post(`${BASE_URL}/upload`, formData, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
              },
            })
            .then((response) => {
              if (response.status === 200 || response.status === 201) {
                message.success("Post created successfully");
                formRef.current?.resetFields();
                setVisible(false);
                onShowPost(postType);
              }
            })
            .catch(() => {
              message.error("Failed to create post");
            })
            .finally(() => {
              setConfirmLoading(false);
            });
        } else {
          setConfirmLoading(false);
        }
      })
      .catch((error: any) => {
        console.error(error);
        setConfirmLoading(false);
      });
  };

  return (
    <div>
      <Button type="primary" onClick={() => setVisible(true)}>
        Create New Post
      </Button>
      <Modal
        title="Create New Post"
        open={visible}
        onOk={handleOk}
        okText="Create"
        onCancel={() => setVisible(false)}
        confirmLoading={confirmLoading}
      >
        <PostForm ref={formRef} />
      </Modal>
    </div>
  );
}

export default CreatePostButton;
