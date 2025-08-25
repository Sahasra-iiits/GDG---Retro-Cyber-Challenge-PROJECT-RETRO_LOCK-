import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

const GRID_SIZE = 2; // 2x2 puzzle
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

const getMatrixPosition = (index) => ({
  row: Math.floor(index / GRID_SIZE),
  col: index % GRID_SIZE,
});

const getVisualPosition = (row, col, width, height) => ({
  x: col * width,
  y: row * height,
});

export default function Puzzle() {
  const nav = useNavigate();
  const [placedTiles, setPlacedTiles] = useState(Array(TILE_COUNT).fill(null));
  const [availableTiles, setAvailableTiles] = useState([
    ...Array(TILE_COUNT).keys(),
  ]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/session`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.user) nav("/login");
      })
      .finally(() => setLoading(false));
  }, []);

  const containerSize = 300;
  const tileSize = containerSize / GRID_SIZE;

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const tile = parseInt(e.dataTransfer.getData("tile"), 10);

    if (placedTiles.includes(tile)) return;

    const newPlaced = [...placedTiles];
    newPlaced[dropIndex] = tile;

    setPlacedTiles(newPlaced);
    setAvailableTiles((prev) => prev.filter((t) => t !== tile));

    const solved = newPlaced.every((t, i) => t === i);
    if (solved) unlockSecret();
  };

  const unlockSecret = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/secret?code=matrix`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) return setMsg(data?.error || "Access denied");
      nav("/secret", { state: { key: data.key } });
    } catch (e) {
      setMsg("Network error");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Network error during logout", err);
    } finally {
      nav("/login");
    }
  };

  if (loading) return <div className="center">Checking session...</div>;

  return (
    <div className="center">
      <h2 className="title glitch" data-text="PUZZLE//DRAG">
        PUZZLE//DRAG
      </h2>
      <p>Drag the four pieces into the correct place to unlock the key</p>

      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "6px 12px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "150px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            width: containerSize,
            height: containerSize,
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            border: "2px solid #555",
            position: "relative",
          }}
        >
          {placedTiles.map((tile, index) => {
            const { row, col } = getMatrixPosition(index);
            const { x, y } = getVisualPosition(row, col, tileSize, tileSize);

            return (
              <div
                key={index}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  width: tileSize,
                  height: tileSize,
                  border: "1px dashed #aaa",
                  backgroundColor: "#f0f0f0",
                  position: "relative",
                }}
              >
                {tile !== null && (
                  <div
                    style={{
                      position: "absolute",
                      width: tileSize,
                      height: tileSize,
                      backgroundImage: `url(/gdg_logo.png)`,
                      backgroundSize: `${GRID_SIZE * 100}%`,
                      backgroundPosition: `${
                        -(tile % GRID_SIZE) * tileSize
                      }px ${-Math.floor(tile / GRID_SIZE) * tileSize}px`,
                      border: "1px solid #222",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "14px", marginBottom: "8px" }}>
            Solved Image Preview:
          </p>
          <img
            src="/gdg_logo.png"
            alt="Puzzle Preview"
            style={{
              width: "190px",
              border: "1px solid #555",
              borderRadius: "8px",
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "40px",
          flexWrap: "wrap",
        }}
      >
        {availableTiles.map((tile) => (
          <div
            key={tile}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("tile", tile)}
            style={{
              width: tileSize,
              height: tileSize,
              backgroundImage: `url(/gdg_logo.png)`,
              backgroundSize: `${GRID_SIZE * 100}%`,
              backgroundPosition: `${-(tile % GRID_SIZE) * tileSize}px ${
                -Math.floor(tile / GRID_SIZE) * tileSize
              }px`,
              border: "1px solid #222",
              cursor: "grab",
            }}
          />
        ))}
      </div>

      <div className="msg">{msg}</div>
    </div>
  );
}
