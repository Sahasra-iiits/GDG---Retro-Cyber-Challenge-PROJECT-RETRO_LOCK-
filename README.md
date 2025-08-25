# Retro-Cyber Terminal + JWT + Secret Key (GDG Challenge)

A mini CTF-style web app with a **retro-cyber terminal**, **JWT auth**, and a **2–3 step discovery** to reveal a secret key.

## Flow
1. Visit landing page → type `help`, explore commands.
2. Use `credentials` to discover login.
3. `login` → go to login page and authenticate.
4. After login (chosen account only), go to `/puzzle` and solve the Caesar cipher.
5. When solved, click **REVEAL SECRET KEY** to fetch from protected API.

## Tech
- **Web**: React + Vite, neon/glitch/CRT effects, Matrix rain.
- **Backend**: Node.js + Express, JWT (httpOnly cookie), protected routes.

## Quick Start
```bash
# in one terminal
cd server && npm install && cp .env.example .env && npm run dev

# in another terminal
cd client && npm install && echo "VITE_API_BASE=http://localhost:4000" > .env && npm run dev
```

Open http://localhost:5173

## Deploy
- **Frontend (Vercel/Netlify)**: set `VITE_API_BASE` to your backend URL.
- **Backend (Railway/Render/Heroku)**: set `FRONTEND_ORIGIN` to your frontend URL, `JWT_SECRET` to a strong value, enable cookies over HTTPS (`secure: true`).

## Secret Key Design
- Discovery is logical, not obvious.
- Terminal commands: `help, clear, whoami, status, credentials, login, matrix, decode, about, fortune, keyhint`.
- Two protections: JWT + role-based access + final query `code=matrix`.
