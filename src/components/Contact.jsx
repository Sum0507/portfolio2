import { siteConfig } from "../data/content";
import "./Contact.css";

export default function Contact() {
  return (
    <section className="section contact-section" id="contact">
      <div className="section-inner contact-inner">
        <p className="label">— say hello</p>
        <h2 className="contact-title display">let's talk</h2>
        <p className="contact-sub serif">
          "For collaborations, opportunities, or just a conversation."
        </p>
        <a href={`mailto:${siteConfig.email}`} className="contact-email">
          {siteConfig.email}
        </a>
        <div className="contact-socials">
          {[
            { label: "github",    href: siteConfig.github },
            { label: "linkedin",  href: siteConfig.linkedin },
            { label: "instagram", href: siteConfig.instagram },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="social-link">
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Scrolling ribbon */}
      <div className="contact-ribbon">
        <span>
          ✦ Jannatun Nur · dhaka · 2025 ✦ engineer · artist · photographer ✦
          Jannatun Nur  · dhaka · 2025 ✦ engineer · artist · photographer ✦&nbsp;
        </span>
      </div>

      <footer className="footer">
        <em className="serif footer-tagline">"{siteConfig.tagline}"</em>
        <p className="footer-credit">Made with too much coffee · {siteConfig.name} </p>
      </footer>
    </section>
  );
}
