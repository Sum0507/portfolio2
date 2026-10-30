import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBlobPattern from "./NavBlobPattern";
import "./Navbar.css";

const FALLBACKS = {
  about:       "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
  projects:    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  photography: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80",
  art:         "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
  contact:     "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
};

function buildNavItems(navPhotos) {
  navPhotos = navPhotos || {};
  return [
    { label: "about",       href: "#about",       photo: navPhotos.about?.asset?.url       || FALLBACKS.about },
    { label: "projects",    href: "#projects",    photo: navPhotos.projects?.asset?.url    || FALLBACKS.projects },
    { label: "photography", href: "#photography", photo: navPhotos.photography?.asset?.url || FALLBACKS.photography },
    { label: "art",         href: "#art",         photo: navPhotos.art?.asset?.url         || FALLBACKS.art },
    { label: "contact",     href: "#contact",     photo: navPhotos.contact?.asset?.url     || FALLBACKS.contact },
  ];
}

// Socials built dynamically from siteData in component

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

export default function Navbar({ siteData, navPhotos }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const NAV_ITEMS = buildNavItems(navPhotos);

  const SOCIALS = [
    { label: "github",   href: siteData?.github   || "#" },
    { label: "linkedin", href: siteData?.linkedin  || "#" },
    { label: "email",    href: `mailto:${siteData?.email || ""}` },
  ];

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

  // Lock scroll + hide Currently widget when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
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
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  const activePhoto = hoveredIndex !== null ? NAV_ITEMS[hoveredIndex].photo : null;

  return (
    <>
      <nav className="navbar">
        <a href="/" className="nav-logo">{siteData?.name || "S"}.</a>
        <button
          className={`nav-burger ${menuOpen ? "nav-burger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fs-nav"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Background layers */}
            <div className="fs-nav__bg">
              {/* Blob pattern — always visible */}
              <NavBlobPattern />

              {/* Photo — fades in on hover */}
              <AnimatePresence mode="wait">
                {activePhoto && (
                  <motion.div
                    key={activePhoto}
                    className="fs-nav__photo is-active"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ backgroundImage: `url(${activePhoto})` }}
                  />
                )}
              </AnimatePresence>

              <div className={`fs-nav__overlay ${activePhoto ? "fs-nav__overlay--photo" : ""}`} />
            </div>

            {/* Nav links */}
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
                    onClick={() => handleNavClick(item.href)}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <FlipWord label={item.label} />
                    <span className="fs-nav__arrow">↗</span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            {/* Bottom row */}
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
              <a href={siteData?.cvUrl || "#"} target="_blank" rel="noreferrer" className="fs-nav__cv">
                download cv ↓
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}