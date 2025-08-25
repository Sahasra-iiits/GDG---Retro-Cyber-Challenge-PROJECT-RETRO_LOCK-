# Retro-Cyber Client (React + Vite)

## Setup
```bash
cd client
npm install
npm run dev
```
Create `.env` file with:
```
VITE_API_BASE=http://localhost:4000
```
Then open http://localhost:5173

## Pages
- `/` Terminal landing with commands (type `help`).
- `/login` Secure login.
- `/puzzle` Decrypt puzzle (requires auth).
- `/secret` Key reveal page.

## Styling
- Neon color palette, glitch effect, CRT scanlines, Matrix rain toggle (via `matrix` command).
