import React from "react"; 
import { Form, message } from "antd";
import 'antd/dist/reset.css';
import Button from "../../components/button";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUser } from "../../apiscalls/users";

function Register() {
  const navigate = useNavigate();
  
  const onFinish = async (values) => {
    try {
      const response = await RegisterUser(values);
      if(response.data.success){
        message.success(response.data.message);
        localStorage.setItem('token', response.data.data);
        navigate("/");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="flex justify-center h-screen items-center bg-primary">
      <div className="card p-3 w-400">
        <h1 className="text-xl mb-1">FILMIDHAMAKA - REGISTER</h1>
        <hr />
        <Form layout="vertical" className="mt-1" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name." }]}
          >
            <input type="text" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email." }]}
          >
            <input type="email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password." }]}
          >
            <input type="password" />
          </Form.Item>

          <div className="flex flex-column mt-2 gap-1">
            <Button fullwidth title="REGISTER" type="submit" />
            <Link to="/login" className="text-primary text-sm">
              Already have an account? Login
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;
