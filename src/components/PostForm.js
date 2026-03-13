import React, { forwardRef } from "react";
import { Form, Input, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";

export const PostForm = forwardRef((props, formRef) => {
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const normFile = (e) => (Array.isArray(e) ? e : e && e.fileList);

  return (
    <Form name="validate_other" {...formItemLayout} ref={formRef}>
      <Form.Item
        name="description"
        label="Message"
        rules={[{ required: true, message: "Please input the message" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="Dragger">
        <Form.Item
          name="uploadPost"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          noStyle
          rules={[
            {
              required: true,
              message: "Please input your message or upload a file",
            },
          ]}
        >
          <Upload.Dragger name="files" beforeUpload={() => false}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag and drop files here to upload
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form.Item>
    </Form>
  );
});
