import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import "./styles/index.css";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

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
  <BrowserRouter>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </BrowserRouter>,
);

reportWebVitals();
