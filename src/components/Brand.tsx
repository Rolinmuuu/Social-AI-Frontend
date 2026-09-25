import React from "react";
import { initials, hueFor } from "../lib/search";

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <span className="logo-mark" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 24 24" width={size * 0.56} height={size * 0.56}>
        <path
          d="M12 2.8l2.1 5.6 5.6 2.1-5.6 2.1L12 18.2l-2.1-5.6-5.6-2.1 5.6-2.1z"
          fill="currentColor"
        />
        <circle cx="19" cy="19" r="2.2" fill="currentColor" opacity="0.7" />
      </svg>
    </span>
  );
}

export function Wordmark() {
  return (
    <span className="wordmark">
      <LogoMark />
      <span>
        Social<b>AI</b>
      </span>
    </span>
  );
}

export function UserAvatar({ name, size = 36 }: { name: string; size?: number }) {
  const h = hueFor(name || "?");
  return (
    <span
      className="user-avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, hsl(${h} 75% 62%), hsl(${(h + 40) % 360} 70% 52%))`,
      }}
      aria-hidden="true"
    >
      {initials(name || "?")}
    </span>
  );
}
