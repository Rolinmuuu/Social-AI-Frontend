import React from "react";
import { PictureOutlined, SearchOutlined, ThunderboltOutlined } from "@ant-design/icons";

const FEATURES = [
  { icon: <ThunderboltOutlined />, title: "Create with AI", text: "Describe an image and publish what DALL·E 3 generates." },
  { icon: <SearchOutlined />, title: "Search by meaning", text: "Find posts by keyword, author, or what they are about." },
  { icon: <PictureOutlined />, title: "Share photos & video", text: "Upload media, then like, share and comment on posts." },
];

// Split-screen shell used by the sign-in and sign-up pages.
function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="auth">
      <section className="auth-hero" aria-hidden="false">
        <div className="auth-blob a" />
        <div className="auth-blob b" />
        <div className="auth-hero-inner">
          <p className="eyebrow light">Social network · AI-native</p>
          <h1>
            Share what you see.
            <br />
            <span>Create what you imagine.</span>
          </h1>
          <ul className="auth-features">
            {FEATURES.map((f) => (
              <li key={f.title}>
                <span className="auth-feature-icon">{f.icon}</span>
                <div>
                  <strong>{f.title}</strong>
                  <span>{f.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <h2>{title}</h2>
          <p className="muted">{subtitle}</p>
          {children}
        </div>
      </section>
    </div>
  );
}

export default AuthLayout;
