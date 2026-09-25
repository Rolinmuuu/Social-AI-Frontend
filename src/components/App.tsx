import React, { useState } from "react";
import Main from "./Main";
import ResponsiveAppBar from "./ResponsiveAppBar";
import { TOKEN_KEY } from "../constants";
import { DEMO } from "../demo/mockApi";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem(TOKEN_KEY),
  );

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsLoggedIn(false);
  };

  const loggedIn = (token: string) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="App">
      {DEMO && (
        <div className="demo-banner" role="note">
          Live demo with sample data — the API runs in your browser, nothing is saved.{" "}
          <a href="https://github.com/Rolinmuuu/Social-AI-Backend" target="_blank" rel="noreferrer">
            See the Go backend
          </a>
        </div>
      )}
      <ResponsiveAppBar isLoggedIn={isLoggedIn} handleLogout={logout} />
      <Main isLoggedIn={isLoggedIn} handleLoggedIn={loggedIn} />
    </div>
  );
}

export default App;
