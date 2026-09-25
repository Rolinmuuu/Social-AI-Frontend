import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "../constants";
import AuthLayout from "./AuthLayout";

interface RegisterFormValues {
  username: string;
  password: string;
  confirm: string;
}

function Register() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = ({ username, password }: RegisterFormValues) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/signup`, { user_id: username, password })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          message.success("Account created. Please sign in.");
          navigate("/login");
        }
      })
      .catch(() => message.error("Could not create the account, please try again"))
      .finally(() => setLoading(false));
  };

  return (
    <AuthLayout title="Create your account" subtitle="It takes ten seconds. No email needed.">
      <Form form={form} name="register" layout="vertical" requiredMark={false} onFinish={onFinish} size="large">
        <Form.Item name="username" label="Username" rules={[{ required: true, message: "Please choose a username" }]}>
          <Input prefix={<UserOutlined />} placeholder="your-username" autoComplete="username" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please choose a password" }]} hasFeedback>
          <Input.Password prefix={<LockOutlined />} autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              async validator(_: unknown, value: string) {
                if (!value || getFieldValue("password") === value) return;
                throw new Error("The two passwords do not match");
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} autoComplete="new-password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading} className="auth-submit">
          Create account
        </Button>
      </Form>
      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
