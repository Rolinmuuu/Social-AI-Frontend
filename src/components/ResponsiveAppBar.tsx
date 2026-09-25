import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Button, Tooltip } from "antd";
import { LogoutOutlined, CompassOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Wordmark } from "./Brand";

interface ResponsiveAppBarProps {
  isLoggedIn: boolean;
  handleLogout: () => void;
}

const links = [
  { to: "/create", label: "Create", icon: <ThunderboltOutlined /> },
  { to: "/collection", label: "Explore", icon: <CompassOutlined /> },
];

function ResponsiveAppBar({ isLoggedIn, handleLogout }: ResponsiveAppBarProps) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="topbar-brand" aria-label="SocialAI home">
          <Wordmark />
        </Link>

        {isLoggedIn && (
          <nav className="topnav" aria-label="Main">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `topnav-link${isActive ? " active" : ""}`}>
                {l.icon}
                <span>{l.label}</span>
              </NavLink>
            ))}
          </nav>
        )}

        <div className="topbar-right">
          {isLoggedIn ? (
            <Tooltip title="Log out">
              <Button shape="round" icon={<LogoutOutlined />} onClick={handleLogout} className="logout-btn">
                <span className="hide-sm">Log out</span>
              </Button>
            </Tooltip>
          ) : (
            <Link to="/register" className="topbar-cta">
              Create account
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default ResponsiveAppBar;
