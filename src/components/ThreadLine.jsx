import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import "./ThreadLine.css";

const SECTIONS = [
  { id: "about",       label: "about" },
  { id: "skills",      label: "skills" },
  { id: "projects",    label: "projects" },
  { id: "research",    label: "research" },
  { id: "photography", label: "photography" },
  { id: "art",         label: "art" },
  { id: "contact",     label: "contact" },
];

export default function ThreadLine() {
  const [active, setActive]   = useState("about");
  const [markers, setMarkers] = useState([]);

  // Scroll progress is a motion value: it updates the gold fill directly on
  // the element every frame, with NO React re-render and NO layout work.
  const { scrollYProgress } = useScroll();

  // Calculate marker positions as % of page height
  useEffect(() => {
    const calcMarkers = () => {
      const pageH = document.documentElement.scrollHeight;
      const m = SECTIONS.map((s) => {
        const el = document.getElementById(s.id);
        if (!el) return null;
        const top = el.getBoundingClientRect().top + window.scrollY;
        return { ...s, pct: (top / pageH) * 100 };
      }).filter(Boolean);
      setMarkers(m);
    };

    const t = setTimeout(calcMarkers, 800);
    // Images and sticky sections change page height after load, so measure again
    const t2 = setTimeout(calcMarkers, 2500);
    window.addEventListener("resize", calcMarkers);
    window.addEventListener("load", calcMarkers);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
      window.removeEventListener("resize", calcMarkers);
      window.removeEventListener("load", calcMarkers);
    };
  }, []);

  // IntersectionObserver for the active section dot
  useEffect(() => {
    const observers = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.25 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="thread-line" aria-hidden="true">
      <div className="thread-track" />
      <motion.div
        className="thread-fill"
        style={{ scaleY: scrollYProgress, originY: 0 }}
      />
      {markers.map((m) => (
        <a
          key={m.id}
          href={`#${m.id}`}
          className={`thread-dot${active === m.id ? " thread-dot--active" : ""}`}
          style={{ top: `${m.pct}%` }}
          title={m.label}
        >
          <span className="thread-dot-label">{m.label}</span>
        </a>
      ))}
    </div>
  );
}