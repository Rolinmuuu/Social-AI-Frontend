import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import "../styles/Register.css";
import { BASE_URL } from "../constants";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 16, offset: 0 },
    sm: { span: 16, offset: 8 },
  },
};

function Register(props) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    const { username, password } = values;
    const option = {
      method: "POST",
      url: `${BASE_URL}/signup`,
      data: { username, password },
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(option)
      .then((response) => {
        console.log("Response from server: ", response);
        if (response.status === 200) {
          message.success("Register successful!");
          navigate("/login");
        }
      })
      .catch((error) => {
        console.log("Error from server: ", error);
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
          ({ getFieldValue }) => {
            return {
              validator(rules, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!"),
                );
              },
            };
          },
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
