import "./Contact.css";

export default function Contact({ siteData }) {
  if (!siteData) return null;

  return (
    <section className="section contact-section" id="contact">
      <div className="section-inner contact-inner">
        <p className="label">— say hello</p>
        <h2 className="contact-title display">let's talk</h2>
        <p className="contact-sub serif">
          "For collaborations, opportunities, or just a conversation."
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

      <div className="contact-ribbon">
        <span>
          ✦ Jannatun nur · dhaka · 2025 ✦ engineer · artist · photographer ✦
          Jannatun nur · dhaka · 2025 ✦ engineer · artist · photographer ✦&nbsp;
        </span>
      </div>

      <footer className="footer">
        {siteData.tagline && (
        <em className="serif footer-tagline">"{siteData.tagline}"</em>
)}
        <p className="footer-credit">made with too much chai · {siteData.name} © 2025</p>
      </footer>
    </section>
  );
}