import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "./styles/index.css";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { DEMO, installDemoApi } from "./demo/mockApi";

// Demo build (GitHub Pages): answer API calls in the browser and use hash routing,
// since a static host cannot rewrite deep links to index.html.
if (DEMO) installDemoApi();
const Router = DEMO ? HashRouter : BrowserRouter;

const theme = {
  token: {
    colorPrimary: "#6d4aff",
    colorLink: "#6d4aff",
    colorError: "#e5484d",
    borderRadius: 12,
    fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", sans-serif',
    colorText: "#17151f",
    colorTextSecondary: "#6b6878",
    colorBorder: "#e6e3ee",
    controlHeightLG: 46,
  },
  components: {
    Segmented: { itemSelectedBg: "#ffffff", trackBg: "#efedf5" },
    Button: { fontWeight: 600, primaryShadow: "0 8px 20px -10px rgba(109, 74, 255, 0.8)" },
  },
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Router>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </Router>,
);

reportWebVitals();
