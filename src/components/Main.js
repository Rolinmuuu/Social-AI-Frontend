import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Landing from "./Landing";
import Collection from "./Collection";

// Responsive app / mobile responsive design

function Main(props) {
  const { isLoggedIn, handleLoggedIn } = props;

  // auth gating
  const showLogin = () => {
    return isLoggedIn ? <Landing /> : <Login handleLoggedIn={handleLoggedIn} />;
  };

  const showRegister = () => {
    return isLoggedIn ? <Landing /> : <Register />;
  };

  const showCollection = () => {
    return isLoggedIn ? <Collection /> : <Navigate to="/login" />;
  };

  return (
    <div className="main">
      <Routes>
        <Route path="/" exact element={showLogin()} />
        <Route path="/register" element={showRegister()} />
        <Route path="/login" element={showLogin()} />
        <Route path="/collection" element={showCollection()} />
      </Routes>
    </div>
  );
}

export default Main;
