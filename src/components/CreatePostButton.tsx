import React, { useState, useRef } from "react";
import { Modal, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import { postIdempotent } from "../lib/idempotent";
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

          // Retried with one Idempotency-Key: a dropped connection never creates the post twice.
          postIdempotent(`${BASE_URL}/upload`, formData, {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
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
      <Button type="primary" shape="round" size="large" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
        New post
      </Button>
      <Modal
        title="New post"
        open={visible}
        onOk={handleOk}
        okText="Publish"
        onCancel={() => setVisible(false)}
        confirmLoading={confirmLoading}
      >
        <PostForm ref={formRef} />
      </Modal>
    </div>
  );
}

export default CreatePostButton;
