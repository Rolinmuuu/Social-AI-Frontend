# SocialAI — Frontend

React + TypeScript client for [SocialAI](https://github.com/Rolinmuuu/Social-AI-Backend),
a Go microservices social network with keyword / semantic search, AI image generation
and asynchronous feed fan-out.

## Features

- Sign up / sign in (JWT stored in `localStorage`)
- Create posts with image or video upload, or generate an image from a prompt (DALL·E 3 via the backend)
- Search posts by keyword, by user, or semantically (embedding search on the backend)
- Photo / video gallery with lightbox, likes and comments

Built with React 19, TypeScript, Ant Design 6, MUI and React Router.

## Run locally

```bash
npm ci
REACT_APP_API_BASE=http://localhost npm start    # backend gateway from docker-compose (nginx on :80)
```

`REACT_APP_API_BASE` defaults to `http://localhost`.

## Test and build

```bash
CI=true npm test -- --watchAll=false
npm run build
```

`src/setupTests.ts` polyfills `matchMedia` and `MessageChannel`, which Ant Design needs
but jsdom does not provide; `package.json` maps a few ESM-only package paths so Jest 27
(from Create React App) can load Ant Design 6.
