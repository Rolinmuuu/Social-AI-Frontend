import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";

test("renders app without crashing", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
});
