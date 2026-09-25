import React, { forwardRef } from "react";
import { Form, Input, Upload } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";

const normFile = (e: any): any => (Array.isArray(e) ? e : e?.fileList);

export const PostForm = forwardRef<any>(function PostForm(_, formRef) {
  return (
    <Form name="create_post" layout="vertical" requiredMark={false} ref={formRef}>
      <Form.Item name="description" label="Caption" rules={[{ required: true, message: "Please write a caption" }]}>
        <Input.TextArea placeholder="What's this about?" autoSize={{ minRows: 2, maxRows: 4 }} maxLength={500} showCount />
      </Form.Item>

      <Form.Item
        name="uploadPost"
        label="Photo or video"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: "Please choose an image or a video" }]}
      >
        <Upload.Dragger name="files" beforeUpload={() => false} maxCount={1} accept="image/*,video/*" listType="picture">
          <p className="ant-upload-drag-icon">
            <CloudUploadOutlined />
          </p>
          <p className="ant-upload-text">Drop an image or video here, or click to browse</p>
          <p className="ant-upload-hint">One file per post</p>
        </Upload.Dragger>
      </Form.Item>
    </Form>
  );
});
