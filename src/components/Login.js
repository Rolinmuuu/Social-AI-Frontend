import React from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";

import { BASE_URL } from "../constants";

function Login(props) {
  const { handleLoggedIn } = props;
  const onFinish = (values) => {
    const { username, password } = values;
    const option = {
      method: "POST",
      url: `${BASE_URL}/signin`,
      data: {
        username,
        password,
      },
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios(option)
      .then((response) => {
        if (response.status === 200) {
          const { data } = response;
          handleLoggedIn(data);
          message.success("Login successful!");
        }
      })
      .catch((error) => {
        message.error("Login failed, please try again");
      });
  };

  return (
    <Form name="normal_login" className="login-form" onFinish={onFinish}>
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ backgroundColor: "black" }}
        >
          Log in
        </Button>
        Or <Link to="/register">register now!</Link>
      </Form.Item>
    </Form>
  );
}
export default Login;
