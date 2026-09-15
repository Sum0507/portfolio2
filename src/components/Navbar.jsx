import { useState, useEffect } from "react";
import { siteConfig } from "../data/content";
import "./Navbar.css";

export default function Navbar({ theme, toggleTheme }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["about", "projects", "skills", "research",  "photography", "art", "contact"];

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <a href="/" className="nav-logo">{siteConfig.name}.</a>

      <ul className={`nav-links ${open ? "open" : ""}`}>
        {links.map(l => (
          <li key={l}>
            <a href={`#${l}`} onClick={() => setOpen(false)}>{l}</a>
          </li>
        ))}
        <li>
          <a href={siteConfig.cvUrl} target="_blank" rel="noreferrer" className="nav-cv">
            cv ↓
          </a>
        </li>
      </ul>

      <div className="nav-right">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="toggle dark mode">
          {theme === "dark" ? "☀" : "☾"}
        </button>
        <button className="nav-burger" onClick={() => setOpen(!open)} aria-label="menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
