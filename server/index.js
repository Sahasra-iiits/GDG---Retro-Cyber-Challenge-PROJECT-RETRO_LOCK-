import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const COOKIE_NAME = process.env.COOKIE_NAME || "neon_token";
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

// ---- In-memory users for demo ----
// Special account:
const SPECIAL_USER = {
  username: "neo",
  // bcrypt hash for 'trinity'
  passwordHash: bcrypt.hashSync("trinity", 10),
  role: "chosen",
};
// Regular users (if you want to add register)
const users = { [SPECIAL_USER.username]: SPECIAL_USER };

function signToken(user) {
  return jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, {
    expiresIn: "2h",
  });
}

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // set to true when using https in production
    maxAge: 1000 * 60 * 60 * 2,
  });
}

function authMiddleware(req, res, next) {
  const bearer = req.headers.authorization?.split(" ")[1];
  const token = req.cookies[COOKIE_NAME] || bearer;
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// --- Routes ---
app.get("/", (req, res) => res.json({ ok: true, msg: "Retro-cyber API" }));

// Optional register (not exposed in UI, but available)
app.post("/api/auth/register", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ error: "Missing fields" });
  if (users[username]) return res.status(409).json({ error: "User exists" });
  users[username] = {
    username,
    passwordHash: bcrypt.hashSync(password, 10),
    role: "user",
  };
  return res.json({ ok: true });
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {};
  const user = users[username];
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  if (!bcrypt.compareSync(password, user.passwordHash))
    return res.status(401).json({ error: "Invalid credentials" });
  const token = signToken(user);
  setAuthCookie(res, token);
  return res.json({
    ok: true,
    user: { username: user.username, role: user.role },
  });
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ ok: true });
});

app.get("/api/session", (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(200).json({ user: null });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return res.json({ user: payload });
  } catch {
    return res.status(200).json({ user: null });
  }
});

// Protected clue: only for the chosen account (role === 'chosen')
app.get("/api/clue", authMiddleware, (req, res) => {
  if (req.user.role !== "chosen") {
    return res.status(403).json({ error: "ACCESS LIMITED to chosen account" });
  }
  // Caesar cipher of: "ACCESS GRANTED — proceed with CODE=matrix"
  const cipher = "JLLJXX LZHYU LK — ywujl le ol ZVKL=djhafm"; // Not accurate Caesar; we'll generate a proper one below.
  // Let's compute a real Caesar quickly: We'll just send a prepared one from server state.
  return res.json({ cipher: serverCipher });
});

// Final secret: requires valid JWT + correct query param
app.get("/api/secret", authMiddleware, (req, res) => {
  if (req.user.role !== "chosen") {
    return res.status(403).json({ error: "ACCESS LIMITED" });
  }
  const code = req.query.code;
  if (code !== "matrix") return res.status(400).json({ error: "Bad code" });
  // Generate your final key (could be random per session)
  const key = "GDG{RETRO-CYBER-CHALLENGE-2025}";
  return res.json({ key });
});

// --- Start ---
const server = app.listen(PORT, () => {
  console.log("API on http://localhost:" + PORT);
});

// Generate proper Caesar cipher for the clue at runtime (shift 7 for example)
function caesarEncode(text, shift) {
  const a = "abcdefghijklmnopqrstuvwxyz";
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return text
    .split("")
    .map((ch) => {
      if (a.includes(ch)) return a[(a.indexOf(ch) + shift) % 26];
      if (A.includes(ch)) return A[(A.indexOf(ch) + shift) % 26];
      return ch;
    })
    .join("");
}

const clearClue = "ACCESS GRANTED — proceed with CODE=matrix";
const serverCipher = caesarEncode(clearClue, 7);
