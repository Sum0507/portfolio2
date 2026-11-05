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

// `ready` turns true once the lower sections (projects, research, photos, art)
// have been added to the page, so the dots and observers get set up again.
export default function ThreadLine({ ready = true }) {
  const [active, setActive]   = useState("about");
  const [markers, setMarkers] = useState([]);

  // Scroll progress is a motion value: it updates the gold fill directly on
  // the element every frame, with NO React re-render and NO layout work.
  const { scrollYProgress } = useScroll();

  // Calculate marker positions as % of page height. Runs again whenever the
  // page changes size (sections loading in, images loading, window resizing).
  useEffect(() => {
    let raf = 0;

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

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(calcMarkers);
    };

    schedule();
    const t = setTimeout(calcMarkers, 800);
    const t2 = setTimeout(calcMarkers, 2500);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      clearTimeout(t2);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, [ready]);

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
  }, [ready]);

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