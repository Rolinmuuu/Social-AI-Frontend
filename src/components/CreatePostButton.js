import React, { Component } from "react";
import { Modal, Button, message } from "antd";
import axios from "axios";

import { PostForm } from "./PostForm";
import { BASE_URL, TOKEN_KEY } from "../constants";

class CreatePostButton extends Component {
  state = {
    visible: false,
    confirmLoading: false,
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleOk = (values) => {
    this.setState({
      confirmLoading: true,
    });
    this.postForm
      .validateFields()
      .then((form) => {
        const { description, uploadPost } = form;
        const { type, originFileObj } = uploadPost[0];
        const postType = type.match(/^(image|video)/g)[0];
        if (postType) {
          let formData = new FormData();
          formData.append("message", description);
          formData.append("message_file", originFileObj);

          const opt = {
            method: "POST",
            url: `${BASE_URL}/upload`,
            data: formData,
            headers: {
              Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
            },
          };

          axios(opt)
            .then((response) => {
              if (response.status === 200) {
                message.success("Post created successfully");
                this.postForm.resetFields();
                this.handleCancel();
                this.props.onShowPost(postType); // show the post in the collection
              }
            })
            .catch((error) => {
              message.error("Failed to create post");
            })
            .finally(() => {
              this.setState({
                confirmLoading: false,
              });
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible, confirmLoading } = this.state;
    // I18N 支持多国语言
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Create New Post
        </Button>
        <Modal
          title="Create New Post"
          open={visible}
          onOk={this.handleOk}
          okText="Create"
          onCancel={this.handleCancel}
          confirmLoading={confirmLoading}
        >
          <PostForm ref={(refInstance) => (this.postForm = refInstance)} />
        </Modal>
      </div>
    );
  }
}

export default CreatePostButton;
