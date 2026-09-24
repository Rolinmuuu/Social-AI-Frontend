import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import "../styles/Register.css";
import { BASE_URL } from "../constants";

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
};

const tailFormItemLayout = {
  wrapperCol: { xs: { span: 16, offset: 0 }, sm: { span: 16, offset: 8 } },
};

interface RegisterFormValues {
  username: string;
  password: string;
  confirm: string;
}

function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values: RegisterFormValues) => {
    const { username, password } = values;
    axios
      .post(`${BASE_URL}/signup`, { user_id: username, password })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          message.success("Register successful!");
          navigate("/login");
        }
      })
      .catch(() => {
        message.error("Register went wrong, please try again");
      });
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      className="register"
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Please input your password!" }]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          { required: true, message: "Please confirm your password!" },
          ({ getFieldValue }) => ({
            async validator(_: unknown, value: string) {
              if (!value || getFieldValue("password") === value) {
                return;
              }
              throw new Error("The two passwords do not match!");
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button
          type="primary"
          htmlType="submit"
          className="register-button"
          style={{ backgroundColor: "black" }}
        >
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Register;
