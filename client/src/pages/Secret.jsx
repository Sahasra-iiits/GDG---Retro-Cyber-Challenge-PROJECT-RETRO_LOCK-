import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Secret() {
  const nav = useNavigate();
  const { state } = useLocation();
  const key = state?.key;

  const [typedKey, setTypedKey] = useState("");

  useEffect(() => {
    if (key) {
      let i = 0;
      const interval = setInterval(() => {
        setTypedKey(key.slice(0, i + 1));
        i++;
        if (i >= key.length) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [key]);

  return (
    <div className="center">
      <h2 className="title glitch" data-text="SECRET KEY UNLOCKED">
        SECRET KEY UNLOCKED
      </h2>
      {key ? (
        <pre className="secret hover-glow">
          {` ###    ###   #   #   ###   ####    ###   #####   ####
#      #   #  ##  #  #      #   #  #   #    #    #
#      #   #  # # #  #      #   #  #   #    #    #
#      #   #  #  ##  #  ##  ####   #####    #     ### 
#      #   #  #   #  #   #  # #    #   #    #        #
#      #   #  #   #  #   #  #  #   #   #    #        #
 ###    ###   #   #   ###   #   #  #   #    #    ####


KEY: ${typedKey}
`}
        </pre>
      ) : (
        <div className="panel">
          <div className="msg">No key found. Try solving the puzzle first.</div>
          <button onClick={() => nav("/")}>Back Home</button>
        </div>
      )}
      <div className="confetti-container">
        {Array.from({ length: 30 }).map((_, i) => (
          <span key={i} className="confetti">
            •
          </span>
        ))}
      </div>
    </div>
  );
}
