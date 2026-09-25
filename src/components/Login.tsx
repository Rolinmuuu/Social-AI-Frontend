import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants";
import type { SigninResponse } from "../types/model";
import AuthLayout from "./AuthLayout";

interface LoginProps {
  handleLoggedIn: (token: string) => void;
}

interface LoginFormValues {
  username: string;
  password: string;
}

function Login({ handleLoggedIn }: LoginProps) {
  const [loading, setLoading] = useState(false);

  const onFinish = ({ username, password }: LoginFormValues) => {
    setLoading(true);
    axios
      .post<SigninResponse>(`${BASE_URL}/signin`, { user_id: username, password })
      .then((response) => {
        if (response.status === 200) {
          handleLoggedIn(response.data.token);
          message.success("Welcome back!");
        }
      })
      .catch(() => message.error("Wrong username or password, please try again"))
      .finally(() => setLoading(false));
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to create, search and share.">
      <Form name="login" layout="vertical" requiredMark={false} onFinish={onFinish} size="large">
        <Form.Item name="username" label="Username" rules={[{ required: true, message: "Please enter your username" }]}>
          <Input prefix={<UserOutlined />} placeholder="your-username" autoComplete="username" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please enter your password" }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="••••••••" autoComplete="current-password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading} className="auth-submit">
          Sign in
        </Button>
      </Form>
      <p className="auth-switch">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
