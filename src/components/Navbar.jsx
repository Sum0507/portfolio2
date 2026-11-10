import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBlobPattern from "./NavBlobPattern";
import "./Navbar.css";
import { scrollToTarget, lockScroll } from "../smoothScroll";

const NAV_ITEMS = [
  { label: "about",       href: "#about" },
  { label: "skills",      href: "#skills" },
  { label: "projects",    href: "#projects" },
  { label: "research",    href: "#research" },
  { label: "photography", href: "#photography" },
  { label: "art",         href: "#art" },
  { label: "contact",     href: "#contact" },
];

function FlipWord({ label }) {
  return (
    <span className="flip-word" aria-label={label}>
      <span className="flip-word__front" aria-hidden="true">
        {label.split("").map((ch, i) => (
          <span key={i} className="flip-letter" style={{ "--i": i }}>{ch}</span>
        ))}
      </span>
      <span className="flip-word__back" aria-hidden="true">
        {label.split("").map((ch, i) => (
          <span key={i} className="flip-letter" style={{ "--i": i }}>{ch}</span>
        ))}
      </span>
    </span>
  );
}

export default function Navbar({ siteData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Only show the links that actually exist in Sanity
  const SOCIALS = [
    { label: "github",    href: siteData?.github },
    { label: "linkedin",  href: siteData?.linkedin },
    { label: "instagram", href: siteData?.instagram },
  ].filter((s) => s.href);

  useEffect(() => {
    const sections = ["about", "skills", "projects", "research", "photography", "art", "contact"];
    const observers = [];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.15 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // Escape closes the menu
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    lockScroll(menuOpen);
    document.body.classList.toggle("menu-open", menuOpen);
    document.body.classList.toggle("nav-open", menuOpen);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("nav-open");
    };
  }, [menuOpen]);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    setTimeout(() => {
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) scrollToTarget(el);
    }, 400);
  };

  return (
    <>
      <nav className="navbar">
        <a href="/" className="nav-logo">{siteData?.name || "S"}.</a>
        <button
          className={`nav-burger ${menuOpen ? "nav-burger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fs-nav"
            id="site-menu"
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="fs-nav__bg">
              <NavBlobPattern />
              <div className="fs-nav__overlay" />
            </div>

            <motion.ul
              className="fs-nav__links"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
              }}
            >
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.label}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } },
                  }}
                >
                  <a
                    href={item.href}
                    className={`fs-nav__link ${hoveredIndex === i ? "fs-nav__link--hovered" : ""} ${hoveredIndex !== null && hoveredIndex !== i ? "fs-nav__link--dimmed" : ""}`}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <FlipWord label={item.label} />
                    <span className="fs-nav__arrow">↗</span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              className="fs-nav__bottom"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
            >
              <div className="fs-nav__socials">
                {SOCIALS.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="fs-nav__social">
                    {s.label}
                  </a>
                ))}
              </div>
              {siteData?.cvUrl && (
                <a href={siteData.cvUrl} target="_blank" rel="noreferrer" className="fs-nav__cv">
                  download cv ↓
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}