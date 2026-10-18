import { useRef, useEffect } from "react";

export default function useMagnetic(strength = 0.4) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    };

    const onLeave = () => {
      el.style.transform = "translate(0, 0)";
      el.style.transition = "transform 0.4s ease";
    };

    const onEnter = () => {
      el.style.transition = "transform 0.1s ease";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mouseenter", onEnter);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mouseenter", onEnter);
    };
  }, [strength]);

  return ref;
}