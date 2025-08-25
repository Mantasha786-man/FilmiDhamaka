import React, { useEffect } from "react"; 
import { Form, message } from "antd";
import 'antd/dist/reset.css';
import '@ant-design/v5-patch-for-react-19';
import Button from "../../components/button";
import { Link, useNavigate } from 'react-router-dom';
import { LoginUser, GetCurrentUser } from "../../apiscalls/users";
import { useDispatch } from "react-redux";
import { SetUser } from "../../redux/usersSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const onFinish = async(values) => {
    try {
      const response = await LoginUser(values);
      
      // Handle response properly
      if(response && response.data) {
        
        const { success, message: msg, data } = response.data;
        
        if(success) {
          message.success(msg || "Login successful!");
          localStorage.setItem('token', data);
          
          // Fetch user data after successful login
          try {
            const userResponse = await GetCurrentUser();
            if(userResponse.success) {
              dispatch(SetUser(userResponse.data));
            }
          } catch(userError) {
            console.error("Error fetching user data:", userError);
          }
          
          navigate("/");
        } else {
          message.error(msg || "Login failed!");
        }
      } else if(response && response.message) {
        // Handle direct error messages
        message.error(response.message);
      } else {
        message.error("Invalid response from server");
      }
    } catch(error) {
      console.error("Login error:", error);
      
      // Handle different error structures
      if(error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        if(errorData && errorData.message) {
          message.error(errorData.message);
        } else {
          message.error("Login failed!");
        }
      } else if(error.request) {
        // Request was made but no response received
        message.error("Network error - please check your connection");
      } else {
        // Something else happened
        message.error("An error occurred during login");
      }
    }
  };

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token && token !== "undefined") {
      navigate("/");
    }
    },[navigate]);

  return (
    <div className="flex justify-center h-screen items-center bg-primary">
      <div className="card p-3 w-400">
        <h1 className="text-xl mb-1">FILMIDHAMAKA-LOGIN</h1>
        <hr/>
        <Form layout="vertical" className="mt-1" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <input type="email" />
          </Form.Item>
          
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <input type="password" />
          </Form.Item>
          
          <div className="flex flex-column mt-2 gap-1">
            <Button fullwidth title="LOGIN" type="submit"/>
            <Link to="/register" className="text-primary text-sm">
              Don't have an account? Register
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
