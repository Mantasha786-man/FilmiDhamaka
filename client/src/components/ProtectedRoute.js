import { message, Spin, Modal, Form, Input, Button } from "antd";
import React, { useEffect, useCallback, useState } from "react";
import { GetCurrentUser } from "../apiscalls/users";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { SetUser, SetLoading } from "../redux/usersSlice";
import { axiosInstance } from "../apiscalls/axiosConfig";

function ProtectedRoute({ children }) {
  const { user, loading } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [updateLoading, setUpdateLoading] = useState(false);

  // New state for user details modal
  const [isUserDetailsModalVisible, setIsUserDetailsModalVisible] = useState(false);

  const getCurrentUser = useCallback(async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetCurrentUser();

      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        dispatch(SetUser(null));
        localStorage.removeItem("token");
        message.error(response.message || "Authentication failed");
        navigate("/login");
      }
    } catch (error) {
      console.error("Auth error:", error);
      dispatch(SetUser(null));
      localStorage.removeItem("token");

      if (error.response?.status === 401) {
        message.error("Session expired. Please login again.");
      } else {
        message.error(error.message || "Authentication failed");
      }
      navigate("/login");
    } finally {
      dispatch(SetLoading(false));
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (!user) {
        getCurrentUser();
      }
    } else {
      navigate("/login");
    }
  }, [user, navigate, getCurrentUser]);

  const showEditModal = () => {
    form.setFieldsValue({
      name: user?.name,
      email: user?.email,
    });
    setIsProfileModalVisible(true);
  };

  // New function to show user details modal
  const showUserDetailsModal = () => {
    setIsUserDetailsModalVisible(true);
  };

  const handleUpdateProfile = async (values) => {
    try {
      setUpdateLoading(true);
      const response = await axiosInstance.put("/api/users/update-profile", values);

      if (response.data.success) {
        message.success("Profile updated successfully!");
        dispatch(SetUser(response.data.data));
        setIsProfileModalVisible(false);
        form.resetFields();
      } else {
        message.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  // loader
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Role-based access control for admin route
  if (window.location.pathname.startsWith("/admin") && !user?.isAdmin) {
    message.error("Access denied. Admins only.");
    navigate("/");
    return null;
  }

  // Format registration date
  const registrationDate = user?.createdAt ? (() => {
    const date = new Date(user.createdAt);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  })() : "N/A";

  return user && (
    <div className="layout">
      <div className="header bg-primary flex justify-between items-center p-2">
        {/* Website Name on Left */}
        <div
          className="text-white text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          FilmiDhamaka
        </div>

        {/* Navigation Menu - Centered */}
        <div className="flex gap-1 text-white justify-center" style={{ flex: 1 }}>
          <span
            className="cursor-pointer hover:underline p-1"
            onClick={() => navigate("/")}
          >
            Home
          </span>
          <span
            className="cursor-pointer hover:underline p-1"
            onClick={() => navigate("/movies")}
          >
            Movies
          </span>
          <span
            className="cursor-pointer hover:underline p-1"
            onClick={() => navigate("/wishlist")}
          >
            Wishlist
          </span>
          <span
            className="cursor-pointer hover:underline p-1"
            onClick={() => navigate("/my-bookings")}
          >
            My Bookings
          </span>
          <span
            className="cursor-pointer hover:underline p-1"
            onClick={() => navigate("/about")}
          >
            About
          </span>
          <span
            className="cursor-pointer hover:underline p-1"
            onClick={() => navigate("/contact")}
          >
            Contact
          </span>
          <span
            className="cursor-pointer hover:underline p-1"
            onClick={() => navigate("/review")}
          >
            Review
          </span>
        </div>

        <div className="bg-white p-1 flex items-center gap-1 br-1">
          {/* Dummy user image replacing icon */}
          <img
            src="https://tse4.mm.bing.net/th/id/OIP.odQMOHa9FGD_Hp44WNaZxwHaHa?pid=Api&P=0&h=180"
            alt="User"
            style={{ cursor: "pointer", width: 28, height: 28, borderRadius: "50%", border: "1px solid #ccc" }}
            onClick={showUserDetailsModal}
            title="User Details"
          />

          <h1
            className="text-sm"
            title={user?.isAdmin ? "Admin Panel" : "Your profile"}
            onClick={() => {
              if (user?.isAdmin) {
                navigate("/admin");
              }
            }}
            style={{ cursor: user?.isAdmin ? "pointer" : "default" }}
          >
            {user?.name || "User"}
          </h1>

          {/* Edit Icon - Show for all users */}
          <i
            className="ri-edit-line text-primary cursor-pointer ml-1"
            onClick={showEditModal}
            style={{ cursor: "pointer", marginLeft: "5px", fontSize: "20px" }}
            title="Edit Profile"
          ></i>
          <i
            className="ri-logout-box-r-line text-primary cursor-pointer ml-1"
            onClick={() => {
              localStorage.removeItem("token");
              dispatch(SetUser(null));
              message.success("Logged out successfully");
              navigate("/login");
            }}
            style={{ cursor: "pointer", marginLeft: "5px", fontSize: "20px" }}
            title="Logout"
          ></i>
        </div>
      </div>

      <div>
        {children}
      </div>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={isProfileModalVisible}
        onCancel={() => setIsProfileModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input
              prefix={<i className="ri-user-line" />}
              placeholder="Enter your name"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" }
            ]}
          >
            <Input
              prefix={<i className="ri-mail-line" />}
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item
            label="New Password (optional)"
            name="password"
            rules={[{ min: 6, message: "Password must be at least 6 characters!" }]}
          >
            <Input.Password
              prefix={<i className="ri-lock-line" />}
              placeholder="Enter new password"
            />
          </Form.Item>

          <div className="flex justify-end gap-1">
            <Button onClick={() => setIsProfileModalVisible(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateLoading}
            >
              Update Profile
            </Button>
          </div>
        </Form>
      </Modal>

      {/* User Details Modal */}
      <Modal
        title="User Details"
        open={isUserDetailsModalVisible}
        onCancel={() => setIsUserDetailsModalVisible(false)}
        footer={null}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src="https://tse4.mm.bing.net/th/id/OIP.odQMOHa9FGD_Hp44WNaZxwHaHa?pid=Api&P=0&h=180"
            alt="User"
            style={{ width: 50, height: 50, borderRadius: "50%", border: "2px solid #ccc" }}
          />
        </div>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Registered On:</strong> {registrationDate}</p>
        <p><strong>Role:</strong> {user?.isAdmin ? "Admin" : "User"}</p>
      </Modal>
    </div>
  );
}

export default ProtectedRoute;
