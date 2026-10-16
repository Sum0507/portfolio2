import { useEffect, useState } from "react";
import "./Cursor.css";

export default function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [dotPos, setDotPos] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      setDotPos({ x: e.clientX, y: e.clientY });
      setTimeout(() => setPos({ x: e.clientX, y: e.clientY }), 80);
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
      <div className="cursor-ring" style={{ left: pos.x, top: pos.y, transform: `translate(-50%, -50%) scale(${clicking ? 0.6 : 1})` }} />
      <div className="cursor-dot" style={{ left: dotPos.x, top: dotPos.y }} />
    </>
  );
}