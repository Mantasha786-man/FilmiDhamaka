import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { useSelector } from 'react-redux';


const Navigation = () => {
  const { user } = useSelector((state) => state.users); // Access user information from Redux store

  return (
    <Menu mode="horizontal">
      <Menu.Item key="home">
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="movies">
        <Link to="/movies">Movies</Link>
      </Menu.Item>

      <Menu.Item key="wishlist">
        <Link to="/wishlist">Wishlist</Link>
      </Menu.Item>

      <Menu.Item key="about">
        <Link to="/about">About</Link>
      </Menu.Item>
      <Menu.Item key="contact">
        <Link to="/contact">Contact</Link>
      </Menu.Item>
      <Menu.Item key="review">
        <Link to="/review">Review</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Navigation;
