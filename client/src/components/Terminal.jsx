import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

const bootLines = [
  "Booting Retro-Cyber Shell v1.0...",
  "Loading neon drivers... ok",
  "Calibrating scanlines... ok",
  "Warming CRT phosphors... ok",
  'Type "help" for displaying all commands.',
];

export default function Terminal({ onToggleMatrix }) {
  const nav = useNavigate();
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [typingIdx, setTypingIdx] = useState(0);
  const [bootDone, setBootDone] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    // typewriter boot
    if (typingIdx < bootLines.length) {
      const timer = setTimeout(() => {
        setHistory((h) => [...h, bootLines[typingIdx]]);
        setTypingIdx(typingIdx + 1);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setBootDone(true);
    }
  }, [typingIdx]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const commands = {
    help: () =>
      [
        "Available commands:",
        "  help          - to display all commands",
        "  fortune       - a random quote",
        "  matrix        - toggle matrix rain",
        "  keyhint       - hint about the secret quest",
        "  clear         - clear the console",
        "  whoami        - show user",
        "  status        - system status",
        "  credentials   - ???",
        "  login         - hint to login page",
        "  about         - about this project",
      ].join("\n"),
    clear: () => {
      setHistory([]);
      return "";
    },
    whoami: () => "guest@neon:~$ unauthorized",
    status: () =>
      [
        "[SYSTEM] LINK: stable",
        "[SYSTEM] GLITCH: controlled",
        "[SYSTEM] AUTH: gated",
        "[SYSTEM] PUZZLE: locked",
      ].join("\n"),
    credentials: () => "username: neo  |  password: trinity",
    login: () => {
      setTimeout(() => nav("/login"), 300);
      return "Opening secure channel... redirecting to /login";
    },
    matrix: () => {
      onToggleMatrix?.();
      return "Matrix rain toggled.";
    },
    about: () =>
      [
        "RETRO-CYBER INTERFACE — built for GDG challenge.",
        "Author: Gubba Sahasra (S20240010078)",
        "Stack: React + Vite, Neon CSS, Express + JWT",
        "Tip: explore, investigate, persist.",
      ].join("\n"),
    fortune: () => {
      const f = [
        "There is no spoon.",
        "You are the glitch in the matrix.",
        "Access is a state of mind.",
        "Hacking time: caffeine++",
      ];
      return f[Math.floor(Math.random() * f.length)];
    },
    keyhint: () => "Explore all commands to get clue 1",
  };

  const run = (raw) => {
    const cmd = raw.trim().split(" ")[0];
    const fn = commands[cmd];
    if (!fn)
      return `Unknown command: ${cmd}. Type help to get all commands displayed.`;
    const out = fn();
    return out;
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      const output = run(input);
      setHistory((h) => [...h, `> ${input}`, output]);
      setInput("");
    }
  };

  return (
    <div className="terminal">
      {history.map((line, i) => (
        <pre key={i} className="line">
          {line}
        </pre>
      ))}
      {bootDone && (
        <div className="prompt">
          <span className="caret">▉</span>
          <input
            autoFocus
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="type a command…"
          />
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
