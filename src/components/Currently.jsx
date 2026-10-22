import { useState, useEffect, useRef } from "react";
import "./Currently.css";

export default function Currently({ text }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const heroHeight = window.innerHeight; // hero is 100vh
      setVisible(window.scrollY < heroHeight * 0.85);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!text) return null;

  return (
    <div className={`currently-widget${visible ? " currently-visible" : ""}`}>
      <span className="currently-dot" />
      <span className="currently-label">currently</span>
      <span className="currently-text">{text}</span>
    </div>
  );
}