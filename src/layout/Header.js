import React from "react";
import { Button, Layout, Menu } from "antd";
import "react-router-dom"
import { useNavigate } from "react-router-dom";

const { Header } = Layout;



const nav = [
    {key: "/", label: "Home"},
    {key: "/about", label: "About Us" },
    {key: "/renting", label: "Renting" },
    {key: "/profile", label: "Profile" },
]

const CustomHeader = () => {
    const navigate = useNavigate();

    const handlingMenuClick = (e) => {
        navigate(e.key)
    }
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="demo-logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["/"]}
        items={nav}
        style={{
          flex: 1,
          minWidth: 0,
        }}
        onClick={handlingMenuClick}
      />
      <Button type="primary" size="large">
          Gradient Button
        </Button>
    </Header>
  );
};

export default CustomHeader;
