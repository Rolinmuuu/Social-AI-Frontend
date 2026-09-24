import React from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants";
import type { SigninResponse } from "../types/model";

interface LoginProps {
  handleLoggedIn: (token: string) => void;
}

interface LoginFormValues {
  username: string;
  password: string;
}

function Login({ handleLoggedIn }: LoginProps) {
  const onFinish = (values: LoginFormValues) => {
    const { username, password } = values;
    axios
      .post<SigninResponse>(`${BASE_URL}/signin`, {
        user_id: username,
        password,
      })
      .then((response) => {
        if (response.status === 200) {
          handleLoggedIn(response.data.token);
          message.success("Login successful!");
        }
      })
      .catch(() => {
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
