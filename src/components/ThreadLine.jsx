import { useEffect, useRef, useState, useCallback } from "react";
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
  const [fillPct, setFillPct] = useState(0);
  const rafRef = useRef(null);

  // Calculate marker positions as % of page height
  useEffect(() => {
    const calcMarkers = () => {
      const pageH = document.documentElement.scrollHeight;
      const m = SECTIONS.map(s => {
        const el = document.getElementById(s.id);
        if (!el) return null;
        const top = el.getBoundingClientRect().top + window.scrollY;
        return { ...s, pct: (top / pageH) * 100 };
      }).filter(Boolean);
      setMarkers(m);
    };

    const t = setTimeout(calcMarkers, 800);
    window.addEventListener("resize", calcMarkers);
    return () => { clearTimeout(t); window.removeEventListener("resize", calcMarkers); };
  }, []);

  // IntersectionObserver for active section
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
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // Scroll fill — throttled with rAF so it never fires more than once per frame
  const onScroll = useCallback(() => {
    if (rafRef.current) return; // already queued
    rafRef.current = requestAnimationFrame(() => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setFillPct(total > 0 ? (scrolled / total) * 100 : 0);
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll]);

  return (
    <div className="thread-line" aria-hidden="true">
      <div className="thread-track" />
      <div className="thread-fill" style={{ height: `${fillPct}%` }} />
      {markers.map(m => (
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