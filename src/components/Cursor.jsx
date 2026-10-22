import { useEffect, useState } from "react";
import "./Cursor.css";

export default function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [dotPos, setDotPos] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [cursorType, setCursorType] = useState("default");

  useEffect(() => {
    const onMove = (e) => {
      setDotPos({ x: e.clientX, y: e.clientY });
      setTimeout(() => setPos({ x: e.clientX, y: e.clientY }), 80);

      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) return;

      if (el.closest(".polaroid, .photo-card, .art-card, .lightbox")) {
        setCursorType("zoom");
      } else if (el.closest("button, .btn, .proj-link, .social-icon, .nav-link, a")) {
        setCursorType("link");
      } else {
        setCursorType("default");
      }
    };
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <>
      <div
        className={`cursor-ring cursor-ring--${cursorType}`}
        style={{
          left: pos.x,
          top: pos.y,
          transform: `translate(-50%, -50%) scale(${clicking ? 0.6 : 1})`
        }}
      >
        {cursorType === "zoom" && <span className="cursor-zoom-icon">+</span>}
      </div>
      <div className="cursor-dot" style={{ left: dotPos.x, top: dotPos.y }} />
    </>
  );
}