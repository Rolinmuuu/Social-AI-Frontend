import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Landing from "./Landing";
import Collection from "./Collection";

interface MainProps {
  isLoggedIn: boolean;
  handleLoggedIn: (token: string) => void;
}

function Main({ isLoggedIn, handleLoggedIn }: MainProps) {
  const requireAuth = (component: React.ReactElement) => {
    return isLoggedIn ? component : <Navigate to="/login" />;
  };

  const showLogin = () => {
    return isLoggedIn ? <Landing /> : <Login handleLoggedIn={handleLoggedIn} />;
  };

  const showRegister = () => {
    return isLoggedIn ? <Landing /> : <Register />;
  };

  return (
    <div className="main">
      <Routes>
        <Route path="/" element={showLogin()} />
        <Route path="/create" element={requireAuth(<Landing />)} />
        <Route path="/register" element={showRegister()} />
        <Route path="/login" element={showLogin()} />
        <Route path="/collection" element={requireAuth(<Collection />)} />
      </Routes>
    </div>
  );
}

export default Main;
