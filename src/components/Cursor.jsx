import { useEffect, useRef, useState } from "react";
import "./Cursor.css";

// Only show the custom cursor on devices with a real mouse.
// Phones, tablets and touch laptops keep their normal behaviour.
const hasFinePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * Custom cursor (dot + trailing ring).
 * Positions are written straight to the elements' style in an animation
 * frame, so moving the mouse never makes React re-render.
 */
export default function Cursor() {
  const [enabled] = useState(hasFinePointer);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const dot = dotRef.current;
    const ring = ringRef.current;
    document.documentElement.classList.add("has-custom-cursor");

    const mouse = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let type = "default";
    let clicking = false;
    let raf = 0;

    const setType = (next) => {
      if (next === type) return;
      ring.classList.remove(`cursor-ring--${type}`);
      ring.classList.add(`cursor-ring--${next}`);
      type = next;
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // e.target is free (no extra hit-testing like elementFromPoint)
      const el = e.target instanceof Element ? e.target : null;
      if (el?.closest(".gal-film-card, .gal-gallery-item, .polaroid")) {
        setType("zoom");
      } else if (el?.closest("button, a, [role='button'], input, textarea")) {
        setType("link");
      } else {
        setType("default");
      }
    };
    const onDown = () => { clicking = true; };
    const onUp = () => { clicking = false; };
    const onLeave = () => { dot.style.opacity = "0"; ring.style.opacity = "0"; };
    const onEnter = () => { dot.style.opacity = ""; ring.style.opacity = ""; };

    // The ring eases toward the mouse every frame, which gives the trailing effect
    const tick = () => {
      ringPos.x += (mouse.x - ringPos.x) * 0.2;
      ringPos.y += (mouse.y - ringPos.y) * 0.2;
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform =
        `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${clicking ? 0.6 : 1})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring cursor-ring--default" aria-hidden="true">
        <span className="cursor-zoom-icon">+</span>
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
