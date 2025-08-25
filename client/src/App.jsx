import React, { useState } from "react";
import Terminal from "./components/Terminal.jsx";
import MatrixRain from "./components/MatrixRain.jsx";

export default function App() {
  const [matrixOn, setMatrixOn] = useState(true);
  return (
    <div className="crt-bg">
      {matrixOn && <MatrixRain />}
      <div className="container">
        <h1 className="title glitch" data-text="PROJECT RETRO_LOCK">
          PROJECT RETRO_LOCK
        </h1>
        <p className="subtitle">
          Initializing system... type <span className="hl">help</span> to begin.
        </p>
        <Terminal onToggleMatrix={() => setMatrixOn((m) => !m)} />
      </div>
      <footer className="foot">© 2025 Retro-Cyber Challenge GDG</footer>
    </div>
  );
}
