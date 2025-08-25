import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function Login() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/session`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) nav("/puzzle");
      })
      .catch(() => {});
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("Authenticating...");
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) return setMsg(data?.error || "Login failed");
      setMsg("Access granted. Redirecting…");
      setTimeout(() => nav("/puzzle"), 500);
    } catch (e) {
      setMsg("Network error");
    }
  };

  return (
    <div className="center">
      <h2 className="title glitch" data-text="SECURE LOGIN">
        SECURE LOGIN
      </h2>
      <form className="panel" onSubmit={onSubmit}>
        <input
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="button" type="submit">
          LOGIN
        </button>
        <div className="msg">{msg}</div>
        <div className="hint">
          Hint: find credentials in the terminal using{" "}
          <span className="hl">credentials command</span>
        </div>
        <button type="button" className="button" onClick={() => nav("/")}>
          Go back..
        </button>
      </form>
    </div>
  );
}
