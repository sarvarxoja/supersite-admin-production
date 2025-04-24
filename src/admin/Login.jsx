import React, { useEffect, useState } from "react";
import Img from "../assets/logo.png";
import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function Login({ access }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (access) {
      navigate("/ru/admin/");
    }
  }, [access]);

  const onFinish = async (values) => {
    setLoad(true);
    if (load === true) {
      return;
    }

    try {
      const { data } = await axios.post("/auth/login", {
        login: values.login,
        password: values.password,
      });

      console.log(data);

      if (data.status === 200) {
        localStorage.setItem("accessToken", data.accessToken);
        navigate("/ru/admin/");
        window.location.reload();
      }
    } catch (error) {
      setError(error.response.data.msg);
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="flex h-screen">
    {/* LEFT SIDE: Img only shows on screens smaller than 771px */}
    <div className="hidden sm:flex w-1/2 bg-[#A11E29] items-center justify-center">
      <img src={Img} alt="" />
    </div>
    
    {/* RIGHT SIDE: Form - always visible */}
    <div className="w-full sm:w-1/2 flex items-center justify-center px-4">
      <Form
        name="login"
        className="w-full max-w-[400px]"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="Username"
          name="login"
          rules={[{ required: true, message: "Please input your username!" }]}>
          <Input />
        </Form.Item>
        
        <div className="mt-4">
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}>
            <Input.Password />
          </Form.Item>
        </div>
        
        <span className="text-red-600 mt-4 block">{error}</span>
        
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" className="mt-4 w-full">
            {load === false ? "Submit" : "Loading..."}
          </Button>
        </Form.Item>
      </Form>
    </div>
  </div>
  );
}
