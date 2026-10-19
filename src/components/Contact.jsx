import "./Contact.css";

export default function Contact({ siteData }) {
  if (!siteData) return null;

  return (
    <section className="section contact-section" id="contact">
      <div className="section-inner">
        <div className="contact-header">
          <p className="contact-label">— let's connect</p>
          <h2 className="contact-heading display">say hello.</h2>
          <p className="contact-sub serif">
            "Whether it's a project, a collab, or just a chat ........... I'm down."
          </p>
          <a href={`mailto:${siteData.email}`} className="contact-email">
            {siteData.email}
          </a>
          <div className="contact-socials">
            {siteData.github && (
              <a href={siteData.github} target="_blank" rel="noreferrer" className="social-link">github</a>
            )}
            {siteData.linkedin && (
              <a href={siteData.linkedin} target="_blank" rel="noreferrer" className="social-link">linkedin</a>
            )}
            {siteData.instagram && (
              <a href={siteData.instagram} target="_blank" rel="noreferrer" className="social-link">instagram</a>
            )}
          </div>
        </div>
      </div>

      <div className="contact-ribbon">
        <span>
          ✦ Jannatun Nur · dhaka · 2026 ✦ engineer · artist · photographer ✦
          Jannatun Nur · dhaka · 2026 ✦ engineer · artist · photographer ✦&nbsp;
        </span>
      </div>

      <footer className="footer">
        {siteData.tagline && (
          <em className="serif footer-tagline">"{siteData.tagline}"</em>
        )}
        <p className="footer-credit">made with too much coffee · {siteData.name} © 2026</p>
      </footer>
    </section>
  );
}