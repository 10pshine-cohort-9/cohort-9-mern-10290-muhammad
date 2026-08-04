# Frontend - Notes App

React (Vite), plain JavaScript. JWT auth against the backend API.

## Structure

​```text
src/
  services/     - api.js (axios client + auth calls)
  context/      - AuthContext (user/token state)
  pages/        - Signup, Login, Profile
  App.jsx       - routes + protected route wrapper
  main.jsx      - entry point
  styles.css    - design tokens + all component styles
test/           - Jest + React Testing Library
​```

## Setup

​```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL to your running backend
npm run dev
​```

## Testing

​```bash
npm test
​```

## Notes

This PR covers authentication and profile screens. The notes dashboard and
editor come in a follow-up PR (`feature/frontend/notes`).