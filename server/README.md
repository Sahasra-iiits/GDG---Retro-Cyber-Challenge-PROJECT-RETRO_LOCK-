# Retro-Cyber Server (Express + JWT)

## Setup
```bash
cd server
npm install
cp .env.example .env
# edit .env (JWT_SECRET and FRONTEND_ORIGIN)
npm run dev
```
API runs at http://localhost:4000 by default.

## Endpoints
- `POST /api/auth/register` (optional) — create user
- `POST /api/auth/login` — sets httpOnly cookie with JWT
- `GET /api/session` — returns user info if logged in
- `GET /api/clue` (protected; chosen role only) — returns Caesar cipher text
- `GET /api/secret?code=matrix` (protected) — returns final key

## Notes
- Special account: `neo / trinity` with role `chosen`.
- Regular users can be registered but won't see clues.
- CORS allows your FRONTEND_ORIGIN; cookies are httpOnly for safety.
